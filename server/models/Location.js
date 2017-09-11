const mongoose = require('mongoose')
const soft_delete = require('mongoose-softdelete')

const { validateHook, toLowerFirst } = require('./helpers')

const Schema = mongoose.Schema

const locationSchema = new Schema({
		name:             { type: String, required: true, trim: true, set: toLowerFirst },
		image:            { type: String, required: true }
	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'
	}
})

locationSchema.plugin(soft_delete)

locationSchema.post('validate', (error, doc, next) => {
	validateHook(error, doc, next, 'Location')
})

const Location = mongoose.model('Location', locationSchema)
module.exports = Location
