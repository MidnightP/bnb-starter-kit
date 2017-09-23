const debug = require('debug')('app:middleware:errorHandler')

const pckg = require('../../package.json')

const badRequests = [
	'MongoError',
	'ValidationError'
]

module.exports = (error, req, res, next) => {

	debug('Error middleware recieved error:', error)

	if(badRequests.includes(error.name)) res.status(400)

	statusCode = res.statusCode ?
		res.statusCode === 200 ?
			500 : res.statusCode
		: 500

	res
		.status(statusCode)
		.json({
			message: error.message,
			code:    res.statusCode,
			name:    error.name || res.statusCode,
			version: pckg.version
		})
}
