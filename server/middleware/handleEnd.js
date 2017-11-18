const debug = require('debug')('app:middleware:handleEnd')
const log = require('../lib/log')('middleware:handleEnd')

const { defaultHeaders } = require('../config')

module.exports = (req, res, next) => {

	// NOTE If desired, placing redirectUrl on request will send a redirect
	if (req.redirectUrl) {
		debug(`redirecting to ${req.redirectUrl}`)
		return res.redirect(req.redirectUrl)
	}

	res
		.set(defaultHeaders)
		.json(res.body)
}
