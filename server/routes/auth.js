const express = require('express')

const { authentication}  = require('../controllers')
const { setResourceName, rejectNotAuthenticated, checkPermissions } = require('../middleware')

const setResourceNameMiddleware = setResourceName('users')

const defaultMiddleware = [ setResourceNameMiddleware, checkPermissions ]

const auth = express.Router()

// Routes for any role
auth.post(`/signup`,      defaultMiddleware,                         authentication.signUp)
	.post(`/signin`,      defaultMiddleware,                         authentication.signIn)
	.get(`/authenticate`, defaultMiddleware, rejectNotAuthenticated, authentication.authenticate)

// Secured routes
auth.get(`/signout`, defaultMiddleware, rejectNotAuthenticated, authentication.signOut)

module.exports = auth
