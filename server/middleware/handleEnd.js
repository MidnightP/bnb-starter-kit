const log = require('../lib/log')('middleware:handleEnd')

module.exports = (req, res, next) => {
	if (req.body.referer) return res.redirect(req.body.referer)
	res.json(res.body)
}
