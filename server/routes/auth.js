const express = require('express')

const { authentication}  = require('../controllers')
const { setUserService, checkAuthenticated, checkPermissions } = require('../middleware')

const auth = express.Router()

auth
	.use([setUserService, checkPermissions])

// Routes for any role
auth.post(`/signup`,      authentication.signUp)
	.post(`/signin`,      authentication.signIn)
	.get(`/authenticate`, authentication.authenticate)

// Secured routes
auth.get(`/signout`, checkAuthenticated, authentication.signOut)

module.exports = auth
