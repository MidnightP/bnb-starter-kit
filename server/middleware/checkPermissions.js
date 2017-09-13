const debug   = require('debug')('app:middleware:permissions')
const R       = require('ramda')
const express = require('express')
const config  = require('../config')
const async   = require('async')

const { cookieOptions, corsOptions,
	apiVersion, authVersion }   = config
const { allAllowances }         = require('./permissions')
const { User, UserToken }       = require('../models')
const log                       = require('../lib/log')('middleware:permissions')
const whitelisted               = corsOptions.origin

// NOTE if async.series sequence becomes large and cumbersome,
// divide into 3 individual middleware functions instead of one overarching function.

module.exports = (req, res, next) => {

	async.series([

		malicious.bind(null, req, res),

		session.bind(null, req, res),

		permissions.bind(null, req, res)

	], (err, req, res) => {
		if(err) return next(err)

		next()
	})
}

// TODO See whether CORS can also check referer address for us.
// Look for referer-, user data and "AC kinda data"

const malicious = (req, res, cb) => {
	debug('scanning for malicious content')

	if(req.body.referer) {
		if(!whitelisted.includes(req.body.referer)) {
			const err = new Error('Rejected:NotWhitelisted')
			err.status = 400

			return cb(err)
		}
	}

	cb()
}

// TODO
// Store lastVisit on userToken
// Store visitAmount on userToken
// Store known IP's on userToken (put it on all requests with redux middleware)

const session = (req, res, cb) => {
	debug('session')

	const token = req.headers.token ? req.headers.token : req.cookies.token
	console.log('REQ.HEADERS', req.headers)
	console.log('REQ.COOKIES', req.cookies)

	if(token) {
		return UserToken.validate(token, (error, userToken) => {
			if (error) return cb(err)
			if(!userToken) {
				debug('user token is not valid')
				res.cookie('token', 'deleted', cookieOptions)
				return cb()
			}

			User.findOne({ _id: userToken.userId, deleted: false }, (error, user) => {
				if (error) return cb(error)

				req.user = user

				debug(`placed user ${user.firstName} on request`)

				cb()
			})
		})
	}

	// TODO Set anonymous token here.
	// First decide how to deal with it when getting the user in authentication routes.
	cb()
}

const permissions = (req, res, cb) => {
	debug('checking permissions')

	const { method, body } = req

	req.grantName = req.user ? req.user.role : 'any'

	if(method === 'GET') {

		// Go ahead
		req.allowances = allAllowances

		return cb()

	}

	const receivedFields = Object.keys(body)
	const allowedFields = allAllowances[req.grantName][req.serviceName][req.method].filter((field) => field[0] !== "-")

	const notAllowedFields = R.difference(receivedFields, allowedFields)

	if(notAllowedFields.length === 0) {

		// Go ahead
		req.allowances = allAllowances

		return cb()

	}

	// Please piss off
	const err = new Error(`Rejected:${notAllowedFields.join(', ')}`)
	err.status = 400
	cb(err)
}
