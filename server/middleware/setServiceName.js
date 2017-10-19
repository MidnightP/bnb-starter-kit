const log = require('../lib/log')('middleware:set-service')

module.exports = (req, res, next) => {

	const splitUrl = req.originalUrl.split('/')[3]

	req.serviceName = splitUrl.includes('?') ? splitUrl.split('?')[0] : splitUrl

	log.info(`${req.method}:${req.serviceName}`)

	next()
}
