const express = require('express')
const cors = require('cors')

const { setServiceName, checkPermissions, rejectNotAuthenticated, checkMongoId } = require('../middleware')
const { categories, contacts, listings, locations, reviews } = require('../controllers')

const defaultMiddleware = [ setServiceName, checkPermissions ]

const api = express.Router()

// Routes for any role
api
	.get(`/categories`,    defaultMiddleware,               categories.readMany)
	.get(`/locations`,     defaultMiddleware,               locations.readMany)
	.get(`/reviews`,       defaultMiddleware,               reviews.readMany)
	.get(`/listings`,      defaultMiddleware,               listings.readMany)
	.get(`/listings/:_id`, defaultMiddleware, checkMongoId, listings.readSingle)

// Secured routes
api
	.post(`/listings`,        defaultMiddleware,                rejectNotAuthenticated, listings.post)
	.patch(`/listings/:_id`,  defaultMiddleware,  checkMongoId, rejectNotAuthenticated, listings.patch)
	.delete(`/listings/:_id`, defaultMiddleware,  checkMongoId, rejectNotAuthenticated, listings.delete)
	.post(`/reviews`,         defaultMiddleware,                rejectNotAuthenticated, reviews.post)
	.post(`/contacts`,        defaultMiddleware,                rejectNotAuthenticated, contacts.post)

module.exports = api
