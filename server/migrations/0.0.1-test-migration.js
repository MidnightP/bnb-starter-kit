const async = require('async')
const mongodb = require('mongodb')
const debug = require('debug')('app:migrations:0.0.1-example')

const config = require('../config')
const log = require('../lib/log')('0.0.1-example')

const { Listing, User } = require('../models')

const upSert = ( Model, query, data, done) => {
	const options = {
		setDefaultsOnInsert: false,
		upsert: true,
		new: true
	}
	Model.findOneAndUpdate(query, data, options, (err, res) => {
		if (err) {
			debug('Error in findOneAndUpdate:', err)
			return done(err)
		}
		if(!res) {
			debug('no response for:', query)
			return done(new Error(`no response for: ${query._id}`))
		}
		done()
	})
}

const updateListings = (cb) => {
	Listing
		.find({})
		.lean()
		.exec((error, entries) => {
			if (error) return cb(error)

			log.info('Updating listings')
			log.info(`Found ${entries.length} listings`)

			let skipAmount = 0
			let total = entries.length

			async.eachSeries(entries, (entry, done) => {

        // NOTE
        // Do stuff here

        const data = { $set: entry }

        debug(`Going to upsert listing: '${entry._id}'`)
        const query  = { _id: entry._id }
        delete entry._id
				upSert(Listing, query, data, done)
			}, (err) => {
				if (err) return cb(err)
				log.info(`Success! Skipped ${skipAmount} listings of total ${total} !`)
				cb()
			})
		})
}

const updateUsers = (cb) => {
	User
		.find({})
		.lean()
		.exec((error, entries) => {
			if (error) return cb(error)

			log.info('Updating users')
			log.info(`Found ${entries.length} users`)

			let skipAmount = 0
			let total = entries.length

			async.eachSeries(entries, (entry, done) => {

        // NOTE
        // Do stuff here

        const data = { $set: entry }

        debug(`Going to upsert user: '${entry._id}'`)
        const query  = { _id: entry._id }
        delete entry._id
				upSert(User, query, data, done)
			}, (err) => {
				if (err) return cb(err)
				log.info(`Success! Skipped ${skipAmount} users of total ${total} !`)
				cb()
			})
		})
}

module.exports = (config, cb_migr) => {
	log.info('Starting migration...')

	async.series([
		updateUsers,
		updateListings
	], (error) => {
		if (error) return cb_migr(error)
		cb_migr()
	})
}
