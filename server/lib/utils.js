const config  = require('../config')
const debug   = require('debug')('app:routes:helpers')

const { grants, services } = config
const { radiusDefault, allowedSearchArbitrary } = services.listing

const {
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME
} = process.env

const auth = DB_USER ? DB_USER + ':' + DB_PASSWORD + '@' : ''

exports.mongoUri = `mongodb://${auth}${DB_HOST}:${DB_PORT}/${DB_NAME}`

exports.sanitizeInput = (input) => input ? input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').trim() : ''

exports.notZero = (radius) => {
	return radius ?
	radius !== 0 ? radius : 1
	: 1
}

exports.setReviewsMeta = (doc) => {
	if(doc.reviews.length) {
		doc.reviewCount = doc.reviews.length
		doc.ratingAverage = doc.reviews.reduce((prev, next) => prev.rating + next.rating ) / doc.reviewCount
	}
	return doc
}
