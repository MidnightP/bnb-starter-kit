const log = require('../lib/log')('middleware:set-service')

module.exports = (forResource) => {
	return (req, res, next) => {
		if(forResource){
			req.resourceName = forResource
		} else {
			const splitUrl = req.originalUrl.split('/')[3]

			req.resourceName = splitUrl.includes('?') ? splitUrl.split('?')[0] : splitUrl
		}

		next()
	}
}
