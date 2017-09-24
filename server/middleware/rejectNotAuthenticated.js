const error = new Error(`Rejected:Unauthorized`)

const { cookieOptions }  = require('../config')

module.exports = (req, res, next) => {
	if(!req.user) {
		const token = req.headers.token ? req.headers.token : req.cookies.token

		if(!token) {
			const err = new Error(`No token was send!`)
			err.name = `Missing:Token`
			res.status(400)
			return next(err)
		}

		res.clearCookie(cookieOptions.name, cookieOptions)
		res.status(401)
		return next(error)
	}

	// Succes!
	next()
}
