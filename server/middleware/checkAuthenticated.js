module.exports = (req, res, next) => {

	// Succes!
	if(req.user) return next()

	// Please sign in
	const err = new Error(`Rejected:Unauthorized`)
	err.status = 401
	return next(err)
}
