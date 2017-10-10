const { MongoClient } = require('mongodb')
const async = require('async')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const log = require('../lib/log')('seed')
const { Avatar, Listing, Category, Location, User, Review } = require('../models')
const { mongoUri } = require('../lib/utils')

const usersData = require('./users')
const avatarsData = require('./avatars')
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

		Avatar.insertMany.bind(null, avatarsData),

		createUsersAndHashPasswords

	], cb)
}

const dropDatabase = (cb) => {
	log.info(`Dropping ${process.env.NODE_ENV} DB`)
	mongoose.connection.db.dropDatabase(cb)
}

const connectMongoose = (cb) => {
	log.info('Connecting Mongoose to: ', mongoUri)
	mongoose.connect(mongoUri, cb)
}


async.series([

	connectMongoose,

	dropDatabase,

	seedDatabase,

	// NOTE this triggers model hooks
	saveListings,

	create2dIndexes

], (error) => {
	if(error) throw error

	log.info('Inserted seed data. Done after geocode...')
})
