const async      = require('async')
const log        = require('../lib/log')('controllers:contact')

const config                     = require('../config')
const { Contact, Listing, User } = require('../models')

const { grants, websiteTitle }   = config

// ----------------------------------------
//  POST
// ----------------------------------------

exports.post = (req, res, next) => {

	const mailTransporter = req.app.get('mailTransporter')

	const { message } = req.body
	const listingId = req.params._id
	const sender = req.user._id

	async.waterfall([
		(cb) => {
			Listing
				.findOne({ _id: listingId, deleted: false })
				.select('user')
				.lean()
				.exec((err, listing) => {
					if(err) return cb(err)

					if(!listing) {
						const err = new Error(`Listing was not found or deleted: ${req.params._id}.`)
						res.status(404)
						err.name = `NotFound:Listing`
						return cb(err)
					}

					cb(null, listing)
				})
		}, (listing, cb) => {
			const receiverId = listing.user

			User
				.findOne({ _id: receiverId, deleted: false })
				.select('email firstName lastName prefix')
				.lean()
				.exec((err, receiver) => {
					if(err) return cb(err)

					if(!receiver) {
						const err = new Error(`Email recipient was not found or deleted: ${req.params._id}.`)
						res.status(404)
						err.name = `NotFound:Receiver`
						return cb(err)
					}

					cb(null, receiver)
				})
		}, (receiver, cb) => {

			const { message } = body

			const mailOptions = {
					from: `${websiteTitle} <test@bijlesismore.nl>`,
					to: `${receiver.email}`,
					bcc: `${process.env.EMAIL_ADDRESS}`,
					subject: `Message from ${receiver.firstName}`,
					text: message,
					html: `<b>This is HTML ${message}</b>`
			}

			mailTransporter.sendMail(mailOptions, (error, info) => {
					if (error) return cb(error)

					log.info('Message %s sent: %s', info.messageId, info.response)
					cb(null, receiver, mailOptions)
			})
		}, (receiver, mailOptions, cb) => {

			const newContact = {
				sender: sender._id,
				receiver: receiver._id,
				message: mailOptions
			}

			new Contact(newContact)
				.save((e, contact) => {
					if(e) return cb(e)

					res.body = 'Message sent succesfully.'

					cb()
				})
		}
	], (err) => {
		if(err) return next(err)

		next()
	})
}
