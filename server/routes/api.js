const express = require('express')

const { setServiceName, checkPermissions, checkAuthenticated, checkMongoId } = require('../middleware')
const { categories, contacts, listings, locations, reviews } = require('../controllers')

const api = express.Router()

api
	.use([setServiceName, checkPermissions])

// Routes for any role
api
	.get(`/categories`,                  categories.readMany)
	.get(`/locations`,                   locations.readMany)
	.get(`/reviews`,                     reviews.readMany)
	.get(`/listings`,                    listings.readMany)
	.get(`/listings/:_id`, checkMongoId, listings.readSingle)

// Secured routes
api
	.post(`/listings`,                      checkAuthenticated, listings.post)
	.patch(`/listings/:_id`,  checkMongoId, checkAuthenticated, checkMongoId, listings.patch)
	.delete(`/listings/:_id`, checkMongoId, checkAuthenticated, checkMongoId, listings.delete)
	.post(`/reviews`,                       checkAuthenticated, reviews.post)
	.post(`/contacts`,                      checkAuthenticated, contacts.post)

module.exports = api
