const debug  = require('debug')('app:routes:authentication')
const bcrypt = require('bcrypt')
const async  = require('async')
const R      = require('ramda')
const fs     = require('fs')

const config                       = require('../config')
const getLogger                    = require('../lib/log')
const { User, Listing, UserToken } = require('../models')

const { cookieOptions } = config

exports.authenticate = (req, res, next) => {

	// NOTE token and user are checked in previous middleware

	res.body = {
		user: R.pick(req.allowances[req.grantName].users.GET_OWN, req.user)
	}

	if(req.user.listingId) res.body.user.listingId = req.user.listingId

	next()
}

exports.signUp = (req, res, next) => {
	if(!req.body) {
		const err = new Error(`Attempt to sign up without form data.`)
		res.status(404)
		err.name = `Missing:FormData`
		return next(err)
	}

	const { body } = req

	if(!body) {
		const err = new Error(`Attempt to sign up without form data.`)
		res.status(404)
		err.name = `Missing:FormData`
		return next(err)
	}

	console.log('BODY.AVATAR', body.avatar)
	const { avatar } = body
	delete body.avatar

	console.log('AVATAR', avatar)
	console.log('TYPEOF AVATAR', typeof avatar)

	async.waterfall([

		(cb) => {
			cb(null, new User(body))
		},

		(user, cb) => {
			async.parallel({

				user: (cb) => {
					user.save((err, user) => {
						if (err) return cb(err)

						debug(user.email + ' signing up')
						cb(null, user)
					})
				},

				avatar: (cb) => fs.writeFile(avatar, `../../public/avatars/${user._id}.jpg`, cb)

			}, (error, { user }) => {
				if(error) return cb(error)

				cb(null, user)
			})

		},

		(user, cb) => {

			const { password } = req.body

			bcrypt.hash(password, 10, (err, encryptedPWD) => {
				if (err) return cb(err)

				User.findByIdAndUpdate(user._id, { $set: { password: encryptedPWD } })
					.exec((err, user) => {
						if(err) return cb(err)

						debug(user.email + ' password bcrypted')
						cb(null, user)
					})
			})
		},

		(user, cb) => {
			new UserToken({ userId: user._id })
				.save((err, userToken) => {
					if (err) return cb(err)

					debug('UserToken created')
					cb(null, user, userToken)
				})
		}], (err, user, userToken) => {
			if (err) return next(err)

			res.cookie(cookieOptions.name, userToken.token, Object.assign({}, cookieOptions, { domain: process.env.REACT_APP_API_HOST }))

			res.body = {
				user: R.pick(req.allowances[req.grantName].users.GET_OWN, user)
			}

			next()
	})
}

exports.signIn = (req, res, next) => {

	const log = getLogger('controllers:authentication')

	if(!req.body) {
		const err = new Error(`Attempt to sign up without form data.`)
		res.status(403)
		err.name = `Missing:FormData`
		return next(err)
	}

	const { email, password } = req.body

	async.waterfall([
		(cb) => {
			User.findOne({ email: email, deleted: false })
				.exec((err, user) => {
					if (err) return cb(err)

					if (!user) {
						const err = new Error(`User not found: ${email}`)
						res.status(404)
						err.name = `NotFound:User`
						return next(err)
					}
					cb(null, user)
				})
		}, (user, cb) => {

			bcrypt.compare(password, user.password, (err, pwdMatch) => {
				if (err) return cb(err)

				if (!pwdMatch) {
					const err = new Error(`Incorrect Password for ${user.email} (${user._id})`)
					res.status(403)
					err.name = `Password:Incorrect`
					return next(err)
				}

				cb(null, user)
			})
		}, (user, cb) => {

			UserToken.findOne({ userId: user._id })
				.exec((err, userToken) => {
					if (err) return cb(err)

					cb(null, user, userToken)
				})
		}, (user, userToken, cb) => {

			if (userToken) {
				cb(null, user, userToken)
			} else {
				userToken = new UserToken({ userId: user._id })
				userToken.save((err, userToken) => {
					if (err) return cb(err)

					cb(null, user, userToken)
				})
			}
		}
	], (err, user, userToken) => {
		if (err) return next(err)

		res.cookie(cookieOptions.name, userToken.token, Object.assign({}, cookieOptions, {
			domain: process.env.REACT_APP_API_HOST
		}))

		res.body = {
			user: R.pick(req.allowances[req.grantName].users.GET_OWN, user)
		}

		if(user.listingId) res.body.user.listingId = req.user.listingId

		next()
	})
}

exports.signOut = (req, res, next) => {

	const token = req.cookies[cookieOptions.name]

	if(!token) {
		const err = new Error(`No token was sent.`)
		res.status(400)
		err.name = `Missing:Token`
		return next(err)
	}

	UserToken.findOne({ token, expiresAt: { $gt: Date.now() } }, (err, userToken) => {
		if (err) return next(err)

		res.clearCookie(cookieOptions.name)

		if(!userToken) {
			next()
		} else {
			UserToken.findByIdAndRemove(userToken._id, (err) => {
				if (err) return next(err)

				next()
			})
		}
	})
}
