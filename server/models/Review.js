const mongoose = require('mongoose')
const soft_delete = require('mongoose-softdelete')

const { validateHook } = require('./helpers')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
		author:           { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		user:             { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		listingId:        { type: Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
		text:             { type: String, required: true, maxlength: 400 },
		rating:           { type: Number, required: true, min: 1, max: 5 }
	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

reviewSchema.plugin(soft_delete)

reviewSchema.pre('save', () => {
})

reviewSchema.post('validate', (error, doc, next) => {
	validateHook(error, doc, next, 'Review')
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
