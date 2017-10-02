const mongoose = require('mongoose')
const soft_delete = require('mongoose-softdelete')
const config = require('../config')

const Schema = mongoose.Schema

const avatarSchema = new Schema({

		user:  { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		url:   { type: String },
		image: { type: Buffer }

	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

avatarSchema.plugin(soft_delete)

avatarSchema.post('validate', (error, doc, next) => {
	validateHook(error, doc, next, 'Avatar')
})

const Avatar = mongoose.model('Avatar', avatarSchema)
module.exports = Avatar
