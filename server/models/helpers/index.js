const setDebugger = require('debug')
const log = require('../../lib/log')('models:helpers')
const crypto = require('crypto')

exports.validateHook = (error, doc, next, modelName) => {
	if (error.name === 'ValidationError') {
		const message = `${error.name} for ${modelName} (${doc._id})`

		log.error(message, error.toString())
		return next(error)
	}
	next(error)
}

exports.validateCoordinates = [(val) => {
	return val.length === 2
}, '{PATH} must (only) contain lat and lng: [<lat>, <lng>]']

exports.toLowerFirst = (field) => {
	return field.charAt(0).toUpperCase() + field.slice(1);
}

exports.randomStr = (cb) => {
	crypto.randomBytes(48, (err, buf) => cb(err, buf.toString('hex')))
}
