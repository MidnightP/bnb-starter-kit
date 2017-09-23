const debug  = require('debug')('app:routes:authentication')
const bcrypt = require('bcrypt')
const async  = require('async')
const R      = require('ramda')
const fs     = require('fs')

const config                       = require('../config')
const getLogger                    = require('../lib/log')
const { User, Listing, UserToken } = require('../models')

const { cookieOptions } = config

// TODO this should be middleware. On /authentication route or also routes?
const getListingId = (user, cb) => {
	if(user.role !== 'listingOwner') return cb(null, null)

	Listing
		.findOne({ user: user._id })
		.select('_id')
		.lean()
		.exec(cb)
}

exports.authenticate = (req, res, next) => {

	let { token } = req.headers
	token = req.cookies ? req.cookies.token : token

	if(!token) {
		const err = new Error(`No token was send!`)
		res.status(400)
		return next(err)
		err.name = `No Token`
	}

	UserToken.validate(token, (err, userToken) => {
		if (err) return next(err)

		if(!userToken) {
			res.clearCookie('token', cookieOptions)
			const err = new Error(`Token is expired.`)
			res.status(403)
			err.name = `Expired Token`
			return next(err)
		}

		User.findOne({ _id: userToken.userId, deleted: false }, (err, user) => {
			if(err) return next(err)

			if(!user) {
				res.clearCookie('token', cookieOptions)
				const err = new Error(`User not found.`)
				res.status(404)
				err.name = `NotFound:User`
				return next(err)
			}

			res.body = {
				user: R.pick(req.allowances[req.grantName].users.GET_OWN, user)
			}

			getListingId(user, (err, listing) => {
				if(err) return next(err)

				if(listing) res.body.user.listingId = listing._id

				next()
			})
		})
	})
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

	const avatar = body.avatar[0]

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

			res.cookie('token', userToken.token, Object.assign({}, cookieOptions, { domain: req.headers.origin }))

			// redirectBase = req.headers.referer ? req.headers.referer : req.headers.origin
			// req.redirectUrl = `${redirectBase}?token=${userToken.token}`

			res.body = {
				user: R.pick(req.allowances[req.grantName].users.GET_OWN, user)
			}

			getListingId(user, (err, listingId) => {
				if(err) return next(err)

				res.body.user.listingId = listingId

				next()
			})
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
		if (err) {
			req.body.referrer = req.headers.origin

			if (err) return next(err)
		}

		// res.set({ 'Token': userToken.token })

		res.cookie('token', userToken.token, Object.assign({}, cookieOptions, {
			domain: `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`
		}))

		// redirectBase = req.headers.referer ? req.headers.referer : req.headers.origin
		// req.redirectUrl = `${redirectBase}?token=${userToken.token}`

		res.body = {
			user: R.pick(req.allowances[req.grantName].users.GET_OWN, user)
		}

		getListingId(user, (err, listingId) => {
			if(err) return next(err)

			res.body.user.listingId = listingId

			next()
		})
	})
}

exports.signOut = (req, res, next) => {

	let { token } = req.headers
	token = req.cookies ? req.cookies.token : token

	if(!token) {
		const err = new Error(`No token was sent.`)
		res.status(400)
		err.name = `Missing:Token`
		return next(err)
	}

	UserToken.findOne({ token, expiresAt: { $gt: Date.now() } }, (err, userToken) => {
		if (err) return next(err)

		res.clearCookie('token')

		if (!req.body.referrer) req.body.referrer = req.headers.origin

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
