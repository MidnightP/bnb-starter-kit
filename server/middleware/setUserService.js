const log = require('../lib/log')('middleware:permissions')

module.exports = (req, res, next) => {

	req.serviceName = 'users'

	log.info(`${req.method}:${req.serviceName}`)

	next()
}
