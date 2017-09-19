const debug = require('debug')('app:middleware:handleEnd')
const log = require('../lib/log')('middleware:handleEnd')

module.exports = (req, res, next) => {
	if (req.redirectUrl) {
		debug(`redirecting to ${req.redirectUrl}`)
		return res.redirect(req.redirectUrl)
	}

	res.json(res.body)
}
