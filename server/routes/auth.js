const express = require('express')

const { authentication}  = require('../controllers')
const { setUserService, rejectNotAuthenticated, checkPermissions } = require('../middleware')

const defaultMiddleware = [ setUserService, checkPermissions ]

const auth = express.Router()

// Routes for any role
auth.post(`/signup`,      defaultMiddleware, authentication.signUp)
	.post(`/signin`,      defaultMiddleware, authentication.signIn)
	.get(`/authenticate`, defaultMiddleware, authentication.authenticate)

// Secured routes
auth.get(`/signout`, defaultMiddleware, rejectNotAuthenticated, authentication.signOut)

module.exports = auth
