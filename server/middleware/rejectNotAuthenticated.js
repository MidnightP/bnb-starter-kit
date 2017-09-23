const error = new Error(`Rejected:Unauthorized`)


module.exports = (req, res, next) => {
	if(!req.user) {
		res.status(401)
		return next(error)
	}

	// Succes!
	next()
}
