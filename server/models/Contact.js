const mongoose = require('mongoose')

const { validateHook } = require('./helpers')

const Schema = mongoose.Schema

const contactSchema = new Schema({
		sender:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
		receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		message:  { type: Object, required: true }
	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

contactSchema.post('validate', (error, doc, next) => {
	validateHook(error, doc, next, 'Contact')
})

const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact
