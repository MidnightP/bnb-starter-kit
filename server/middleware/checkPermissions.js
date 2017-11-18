const _       = require('underscore')
const async   = require('async')
const debug   = require('debug')('app:middleware:permissions')
const express = require('express')
const config  = require('../config')

const { cookieOptions, corsOptions,
	apiVersion, authVersion }      = config
const { allAllowances }            = require('./permissions')
const { User, UserToken, Listing } = require('../models')
const log                          = require('../lib/log')('middleware:check-permissions')
const whitelisted                  = corsOptions.origin

// NOTE divide into 3 individual middleware functions instead of one overarching function.

module.exports = (req, res, next) => {

	async.series([

		// malicious.bind(null, req, res),

		session.bind(null, req, res),

		permissions.bind(null, req, res)

	], (err) => {
		if(err) return next(err)

		next()
	})
}

// const malicious = (req, res, cb) => {
// 	debug('scanning for malicious content')
//
// TODO scan for user data and "AC kinda data"
//
// 	cb()
// }

const session = (req, res, cb) => {
	debug('session')

	log.info(`${req.method}:${req.path}`)

	const token = req.cookies[cookieOptions.name]

	if(token) {
		return UserToken.validate(token, (error, userToken) => {
			if (error) return cb(err)
			if(!userToken) {
				debug('user token is not valid')
				res.cookie(cookieOptions.name, 'deleted', cookieOptions)
				return cb()
			}

			User.findOne({ _id: userToken.userId, deleted: false }, (error, user) => {
				if (error) return cb(error)
				if(!user) {
					res.clearCookie(cookieOptions.name, cookieOptions)
					const err = new Error(`User not found.`)
					err.name = `NotFound:User`
					res.status(404)
					return cb(err)
				}

				req.user = user

				log.info(`request with session from: ${user.firstName}`)

				if(user.role !== 'listingOwner') return cb()

				Listing
					.findOne({ user: user._id })
					.select('_id')
					.lean()
					.exec((error, listing) => {
						if(error) return cb(error)

						if(listing) req.user.listingId = listing._id

						cb()
					})
			})
		})
	}

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
	const allowedFields = allAllowances[req.grantName][req.resourceName][req.method].filter((field) => field[0] !== "-")

	const notAllowedFields = _.difference(receivedFields, allowedFields)

	if(notAllowedFields.length === 0) {

		// Go ahead
		req.allowances = allAllowances

		return cb()

	}

	// Please piss off
	const err = new Error(`Rejected:${notAllowedFields.join(', ')}`)
	res.status(403)

	cb(err)
}
