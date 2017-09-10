const async = require('async')
const fs = require('fs')
const path = require('path')
const semver = require('semver')
const debug = require('debug')('app:bin:migrate')
const mongoose = require('mongoose')

const log = require('../lib/log')('migrate')
const config = require('../config')
const { constructMongoUri } = require('../lib/utils')

mongoose.Promise = global.Promise

const mongoUri = constructMongoUri()

const _arrow_right_ = '--------------> '
const _arrow_left_ = ' <--------------'

const UpdateSchema = new mongoose.Schema({
	key: { type: String, index: true },
	appliedOn: { type: Date, default: Date.now },
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})

const Update = mongoose.model('App_Migrations', UpdateSchema)

let migrations = []
let migrateCount = 0
let skipCount = 0

const migrationsPath = path.join(__dirname, '..', 'migrations')

const cb = (error) => {
	log.error('An error occures whilst checking migrations:', error)
	process.exit()
}

if(!process.env.SEMVER) return cb('No SEMVER given in environment (e.g. SEMVER=0.0.1)')

const applyMigrations = (file, done) => {
	Update.findOne({ key: file }, (err, updateRecord) => {
		if (err) done('Error searching database (`App_Migrations`) for migrations ' + file + ':', err)

		// If no record is found, we run the file
		if (!updateRecord || process.env.FORCE ) {
			const migrate = require(path.join(migrationsPath, file))
			log.info('Will check and on succes run the following migration:', _arrow_right_, file)
			// skip migrations that export a falsy value
			if (!migrate) {
				skipCount++
				return done('One falsy migrations path given')
			}

			if (typeof migrate !== 'function'){
				skipCount++
				return done(`Migrate file ${file} does not export a function`)
			}

			migrate(config, (err) => {
				if (err) return done(err)
				migrateCount++
				new Update({ key: file }).save((err) => {
					if(err) return done(err)
					done()
				})
			})
		} else {
			done()
		}
	})
}

const read = (done) => {
	fs.readdir(migrationsPath, null, (err, files) => {
		if (err) return cb(err)

		let hasError = ''

		log.info(`Will now check migrations folder for SemVer and see if we can run ${process.env.SEMVER}`)
		const javascriptOrCoffee = files.map((i) => {
			// exclude non-javascript or coffee files in the migrations folder
			if (path.extname(i) !== '.js' && path.extname(i) !== '.coffee') {
				hasError = `${path} is not a .coffee or .js file!`
				return false
			}
			return path.basename(i, '.js')
		})

		const semverValid = javascriptOrCoffee.filter((i) => {
			// exclude falsy values and filenames that without a valid semver
			return i && semver.valid(i.split('-')[0])
		})

		if(!semver.valid(process.env.SEMVER)) {
			hasError = `${process.env.SEMVER} is not a valid semver :/`
		}

		if (hasError) return cb(hasError)

		migrations = semverValid.sort((a, b) => {
			// exclude anything after a hyphen from the version number
			return semver.compare(a.split('-')[0], b.split('-')[0])
		}).filter((migration) => {
			return migration.includes(process.env.SEMVER)
		})
		done()
	})
}

const run = (done) => {
	async.eachSeries(migrations, applyMigrations, (err) => {
		if(err) return cb(err)
    if (migrateCount > 0 || skipCount > 0) {
			if (migrateCount > 0) {
				log.info(_arrow_right_ + 'Successfully applied migrations: ' + migrateCount + _arrow_left_)
			}
			if (skipCount > 0) {
				log.info(_arrow_right_ + 'Skipped migrations: ' + skipCount + _arrow_left_)
			}
		} else {
			log.info(_arrow_right_ + 'No new migrations ran' + _arrow_left_)
		}
		done()
  })
}

if(!path.isAbsolute(migrationsPath)) {
	debug('migrationsPath is not absolute! -->>', migrationsPath)
	return cb('migrationsPath is not absolute!')
}
if (!fs.existsSync(migrationsPath)) {
	debug('migrationsPath doesn`t exist', migrationsPath)
	return cb('\nMigrate Error:\n\n'
		+ 'An migrations folder must exist in your project root to use automatic migrations.\n')
}

mongoose.connect(mongoUri, (err) => {
	if(err) log.error('Error connecting to mongoose !',err)
	log.info('mongoDB connected to: ', mongoUri)

	async.series([
		read,
		run
	], (err) => {
		if (err) return cb(err)
		process.exit()
	})
})
