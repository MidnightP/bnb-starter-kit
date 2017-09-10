module.exports = (req, res, next) => {
	if(req.user) {

		// Service requires authentication
		const properRequestBody = R.difference(req.body, req.writeFields).length === 0

		if(properRequestBody) {

			// Succes!
			return next()
		} else {

			// Better luck next time!
			const err = new Error(`Rejected:NotAllowed`)
			err.status = 400
			return next(err)
		}
	} else {

		// Please sign in
		const err = new Error(`Rejected:Unauthorized`)
		err.status = 401
		return next(err)
	}
}
