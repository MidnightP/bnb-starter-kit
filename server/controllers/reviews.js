const config = require('../config')

const { Review, Listing }  = require('../models')

const { grants } = config

// ----------------------------------------
//  get
// ----------------------------------------

exports.readMany = (req, res, next) => {

	const query = {
		listingId: req.params._id,
		deleted: false
	}

	Review
		.find(query)
		.select(req.allowances[req.grantName].reviews.GET.join(' '))
		.populate({ path: 'author', select: req.allowances['any'].users.GET.join(' ') })
		.lean()
		.exec((err, reviews) => {
			if(err) return next(err)

			res.body = { reviews }

			next()
		})
}

// ----------------------------------------
//  POST
// ----------------------------------------

exports.post = (req, res, next) => {

	const { body } = req
	const listingId = req.params._id
	const authorId = req.user._id

	Review
		.find({ author: authorId, listing: listingId, deleted: false })
		.count()
		.exec((err, count) => {
			if(err) return next(err)

			if(count === 0) {
					Listing
						.findOne({ _id: listingId, deleted: false })
						.select('user')
						.lean()
						.exec((err, listing) => {
							if(err) return next(err)

							if(!listing) {
								const err = new Error(`Listing was not found or deleted: ${req.params._id}.`)
								res.status(404)
								err.name = `NotFound:Listing`
								return next(err)
							}

							const userId = listing.user

							const additionalData = {
								author: authorId,
								user: userId,
								listing: listingId
							}

							new Review(R.merge(body, additionalData))
								.save((err, review) => {
									if(err) return next(err)

									res.body = {
										review: R.pick(req.allowances[req.grantName].reviews.GET, review)
									}

									next()
								})
						})
			} else {
				const err = new Error(`Review for this listing was already written. Author: ${authorId}. Listing: ${req.params._id}.`)
				res.status(422)
				err.name = `AlreadyExists:Review`

				return next(err)
			}
		})
}
