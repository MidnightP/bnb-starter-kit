const log = require('../lib/log')('middleware:set-user-service')

module.exports = (req, res, next) => {

	req.serviceName = 'users'

	log.info(`${req.method}:${req.serviceName}`)

	next()
}
