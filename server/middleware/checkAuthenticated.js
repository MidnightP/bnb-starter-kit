const error = new Error(`Rejected:Unauthorized`)

error.status = 401

module.exports = (req, res, next) => {
	if(!req.user) return next(error)

	// Succes!
	next()
}
