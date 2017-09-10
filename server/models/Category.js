const mongoose = require('mongoose')
const soft_delete = require('mongoose-softdelete')

const { validateHook, toLowerFirst } = require('./helpers')

const Schema = mongoose.Schema

const categorySchema = new Schema({
		text:             { type: String, required: true, trim: true, set: toLowerFirst },
		image:            { type: String, required: true }
	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

categorySchema.plugin(soft_delete)

categorySchema.post('validate', (error, doc, next) => {
	validateHook(error, doc, next, 'Category')
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category
