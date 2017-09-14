const mongoose = require('mongoose')
const soft_delete = require('mongoose-softdelete')
const config = require('../config')

const { grants }                     = require('../middleware/permissions')
const { validateHook, toLowerFirst } = require('./helpers')

const roles = Object.keys(grants).filter(g => g !== 'any' && g !== 'own')

const Schema = mongoose.Schema

const userSchema = new Schema({
		email:              { type: String, unique: true, required: true, maxlength: 30 , trim: true, lowercase: true },
		firstName:          { type: String, required: true, trim: true, maxlength: 30, trim: true, set: toLowerFirst },
		lastName:           { type: String, required: true, trim: true, maxlength: 30, trim: true, set: toLowerFirst },
		prefix:             { type: String, trim: true, maxlength: 15, trim: true, lowercase: true },
		role:               { type: String, required: true, enum: { values: roles } },
		password:           { type: String },

		avatarUrl:          { type: String },
		// avatar:             { type: Buffer },
	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

userSchema.plugin(soft_delete)

userSchema.post('validate', (error, doc, next) => {
	validateHook(error, doc, next, 'User')
})

const User = mongoose.model('User', userSchema)
module.exports = User
