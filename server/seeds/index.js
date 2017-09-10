const { MongoClient } = require('mongodb')
const async = require('async')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const { singleton } = require('../lib/utils')
const log = require('../lib/log')('seed')
const { Listing, Category, Location, User, Review } = require('../models')

const usersData = require('./users')
const listingsData = require('./listings')
const categoriesData = require('./categories')
const locationsData = require('./locations')
const reviewsData = require('./reviews')


const createUsersAndHashPasswords = (cb) => {

	async.map(usersData, (user, cb) => {

		bcrypt.hash(user.password, 10, (error, encryptedPWD) => {
			if(error) return cb(error)

			log.info(user.email + ' password bcrypted')

			user.password = encryptedPWD

			cb(null, user)
		})
	}, (error, users) => {
		if(error) return cb(error)

		User.insertMany(users, (error) => {
			if(error) return cb(error)

			cb()
		})
	})

}

const saveListings = (cb) => {
	Listing.find().exec((e, docs) => {
		if(e) return cb(e)

		docs.forEach(doc => {

			// NOTE need to change the doc to save it
			// TODO we can't save without modifying document?

			doc.price = doc.price - 0.01
			doc.save()
		})

		cb()
	})
}


const create2dIndexes = (cb) => {

	const mongoUri = singleton.get('mongoUri')

	MongoClient.connect(mongoUri, (error, db) => {
		if(error) return cb(error)

		db.collection('listings').createIndex({ coordinates : "2dsphere" }, (error, output) => {
			if(error) return cb(error)

			log.info(`Created indexes: ${output}`)

			cb()
		})
	})
}

const seedDatabase = (cb) => {

	async.parallel([

		Listing.insertMany.bind(null, listingsData),

		Category.insertMany.bind(null, categoriesData),

		Location.insertMany.bind(null, locationsData),

		Review.insertMany.bind(null, reviewsData),

		createUsersAndHashPasswords

	], cb)
}

module.exports = () => {

	mongoose.connection.db.dropDatabase((error) => {
		if(error) return log.error(error)

		// TODO how can we recieve duplicate key errors after database has been dropped?

		log.info(`Dropped ${process.env.NODE_ENV} DB`)

		async.series([

			seedDatabase,

			// NOTE this triggers model hooks
			saveListings,

			create2dIndexes

		], (error) => {
			if(error) log.error(error)

			log.info('Inserted seed data')
		})
	})
}
