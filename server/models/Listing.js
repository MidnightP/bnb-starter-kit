const mongoose    = require('mongoose')
const soft_delete = require('mongoose-softdelete')
const log         = require('../lib/log')('models:listing')

const { singleton }                         = require('../lib/utils')
const { validateHook, validateCoordinates } = require('./helpers')

const Schema = mongoose.Schema

const listingSchema = new Schema({
		price:       { type: Number, required: true, min: 1, max: 99 },
		description: { type: String, required: true, maxlength: 1000 },
		zipcode:     { type: String, required: true, maxlength: 10, trim: true },
		location:    { type: Schema.Types.ObjectId, ref: 'Location' },
		user:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
		coordinates: [{ type: Number, validate: validateCoordinates }],
		categories:  [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }]
	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		toJSON: { virtuals: true }
})

listingSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'listingId'
})

listingSchema.plugin(soft_delete)

listingSchema.post('validate', function(error, doc, next) {
	validateHook(error, doc, next, 'Listing')
})

listingSchema.pre('save', async function(next) {
	log.info('Geo coding listing coordinates based on zipcode')

	const GeoCoder = singleton.get('GeoCoder')

	try {
		const data = await GeoCoder.geocode(this.zipcode)
		this.coordinates = [data[0].longitude, data[0].latitude]
	} catch (e) {
		log.error(e)
	} finally {
		next()
	}
})

// NOTE After requirement the model Listing is defined and we can use the model itself in hooks in this file if we like
const Listing = mongoose.model('Listing', listingSchema)
module.exports = Listing
