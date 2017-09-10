const config = require('../config')
const mongoose = require('mongoose')

const log = require('../lib/log')
const { randomStr } = require('./helpers')

const Schema = mongoose.Schema

const userTokenSchema = new Schema({
		token:       String,
		userId:      { type: Schema.Types.ObjectId, unique: true },
		expiresAt:   Number,
	}, {
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

userTokenSchema.statics.validate = function(token, cb) {
	this.findOne({
		token: token,
		expiresAt: { $gt: Date.now() }
	}, cb)
}

// NOTE mind the scope of 'this' here
userTokenSchema.pre('save', function(next) {
	randomStr((err, string) => {
		if(err) return log.error(err)
		this.token = string
		this.expiresAt = Date.now() + config.cookieOptions.maxAge
		next()
	})
})

const UserToken = mongoose.model('UserToken', userTokenSchema)
module.exports = UserToken
