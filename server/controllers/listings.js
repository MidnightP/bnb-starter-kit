const async   = require('async')
const config  = require('../config')
const express = require('express')

const {
	setReviewsMeta,
	sanitizeInput,
	singleton,
	notZero
} = require('../lib/utils')

const { Listing }   = require('../models')

const {
	grants,
	googleMapsRegion,
	services,
	googleMapsLanguage
} = config

const sortDefault = { [services.listing.sortDefault]: services.listing.orderDefault }
const { defaultLimit, allowedSearchArbitrary, limitDefault } = services.listing

// ----------------------------------------
//  get
// ----------------------------------------

exports.readMany = (req, res, next) => {

	const GeoCoder = req.app.get('GeoCoder')

	let searchAttributes

	const { zipcode, radius, categories, category, location, locations } = req.query

	const limit = req.query.limit ? parseInt(req.query.limit) : limitDefault
	const skip  = req.query.skip  ? parseInt(req.query.skip)  : 0
	const sort  = req.query.sort  ? req.query.sort            : sortDefault

	let $and = []
	let $inCategories = []
	let $inLocations = []

	const { coordinates } = req

	if(coordinates) {
		$and.push({
			coordinates: {
				$near: {
					$geometry: {
						type: 'Point' ,
						coordinates: coordinates
					},
					$maxDistance: notZero(radius) * 1000
				}
			}
		})
	}

	if(category)
		if(mongodb.ObjectId.isValid(category)) $inCategories.push(category)

	if(location)
		if(mongodb.ObjectId.isValid(location)) $inLocations.push(location)

	// NOTE The client currently queries for single "location" and "category" only.
	// Below lines makes sure that we can also query for an array of multiple "categories" and "locations".
	if(categories) {
		R.forEach((_id) => {
			if(mongodb.ObjectId.isValid(_id)) $inCategories.push(_id)
		}, categories)
	}

	if(locations) {
		R.forEach((_id) => {
			if(mongodb.ObjectId.isValid(_id)) $inLocations.push(_id)
		}, locations)
	}

	if($inCategories.length) $and.push({ categories: { $in: $inCategories }})
	if($inLocations.length) $and.push({ locations: { $in: $inLocations }})

	const query = $and.length ? { deleted: false, $and } : { deleted: false }

	const getListings = () => {
		async.parallel([
			(cb) => {
				Listing
					.find(query)
					.count()
					.exec(cb)
			},
			(cb) => {
				Listing
					.find(query)
					.select(req.allowances[req.grantName].listings.GET.join(' '))
					.populate('location', `_id`)
					.populate('categories', `_id`)
					.populate('reviews', `rating`)
					.populate({
						path: 'user',
						select: req.allowances['any'].users.GET.join(' '),
						populate: {
							path: 'avatar',
							select: req.allowances['any'].avatars.GET.join(' ')
						}
					})
					.lean()
					.sort(sort)
					.limit(limit)
					.skip(skip)
					.exec(cb)
			}
		], (err, [ count, docs ]) => {
			if(err) return next(err)

			res.body = {
				count,
				listings: docs.map(d => setReviewsMeta(d))
			}

			Listing.find().exec((e, listings) => {
				if(req.coordinates) res.body.coordinates = req.coordinates
				next()
			})
		})
	}

	if(zipcode) {
		const input = sanitizeInput(zipcode)

		GeoCoder.geocode(input, (err, result) => {
			if(err) return next(err)

			if(result[0]) {
				const { longitude, latitude } = result[0]
				req.coordinates = [longitude, latitude]
			} else {
				const err = new Error(`No coordinates found for zipcode ${zipcode}.`)
				res.status(400)
				err.name = `NotFound:Coordinates`

				return next(err)
			}
			getListings()

		}, {
			language: googleMapsLanguage,
			region: googleMapsRegion
		})
	} else {
		getListings()
	}
}

const readSingle = (req, res, next) => {

	const query = {
		_id: req.params._id,
		deleted: false
	}

	let selection = req.allowances[req.grantName].listings.GET.join(' ')

	if(req.user)
		if(req.user.listingId === query._id)
			selection = req.allowances[req.grantName].listings.GET_OWN.join(' ')

	Listing
		.findOne(query)
		.select(selection)
		.populate({ path: 'categories', select: `_id` })
		.populate({ path: 'location', select: `_id` })
		.populate({
			path: 'user',
			select: req.allowances['any'].users.GET.join(' '),
			populate: {
				path: 'avatar',
				select: req.allowances['any'].avatars.GET.join(' ')
			}
		})
		.populate({
			path: 'reviews',
			select: 'rating',
		})
		.lean()
		.exec((err, listing) => {
			if(err) return next(err)

			if(!listing) {
				const err = new Error(`Listing was not found or deleted: ${req.params._id}.`)
				res.status(404)
				err.name = `NotFound:Listing`
				return next(err)
			}

			res.body = {
				listing: setReviewsMeta(listing)
			}

			next()
		})
}

exports.readSingle = readSingle

// ----------------------------------------
//  POST
// ----------------------------------------

const post = (req, res, next) => {

	const { body } = req

	new Listing(R.merge(body, { user: req.user._id }))
		.save((err, listing) => {
			if(err) return handleEnd(err)

			req.params._id = listing._id
			readSingle(req, res)
		})
}

exports.post = post

// ----------------------------------------
//  PATCH
// ----------------------------------------

exports.patch = (req, res, next) => {

	const { body } = req

	const query = {
		_id: req.params._id,
		deleted: false
	}

	Listing
		.findOne(query)
		.exec((err, listing) => {
			if(err) return handleEnd(err)

			if(!listing) {
				const err = new Error(`Listing was not found or deleted: ${req.params._id}.`)
				res.status(404)
				err.name = `NotFound:Listing`
				return handleEnd()
			}

			if(listing.userId !== req.user._id) {
				const err = new Error(`User ${req.user._id} (${req.user.email}) is not owner of listing: ${req.params._id}.`)
				res.status(404)
				err.name = `Incorrect:User`
				return handleEnd()
			}

			const options = {}

			listing.update({ $set: body }, options, (err, listing) => {
				if(err) return handleEnd(err)

				readSingle(req, res)
			})
		})
}

// ----------------------------------------
//  DELETE
// ----------------------------------------

const deleteListing = (req, res, next) => {

	const query = {
		_id: req.params._id,
		deleted: false
	}

	Listing
		.findOne(query)
		.exec((err, listing) => {
			if(err) return handleEnd(err)

			if(!listing) {
				const err = new Error(`Listing was not found or deleted: ${req.params._id}.`)
				res.status(404)
				err.name = `NotFound:Listing`
				return handleEnd()
			}

			if(listing.userId !== req.user._id) {
				const err = new Error(`User ${req.user._id} (${req.user.email}) is not owner of listing: ${req.params._id}.`)
				res.status(404)
				err.name = `Incorrect:User`
				return handleEnd()
			}

			listing.softdelete((err, deletedDoc) => {
				if(err) return handleEnd(err)

				// TODO think about redirecting
				// if (!req.headers.referer) req.headers.referer = req.headers.origin

				res.body = {
					_id: deletedDoc._id
				}

				handleEnd()
		})
	})
}

// NOTE delete is a JavaScript keyword
exports.delete = deleteListing
