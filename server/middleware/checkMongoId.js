const mongodb = require('mongodb')

module.exports = (req, res, next) => {
	if(req.params._id){

		if(mongodb.ObjectId.isValid(req.params._id)) return next()

		const err = new Error(`Incorrect id in params.`)
		res.status(400)
		err.name = `Incorrect:ID`

		return next(err)
	}

	const err = new Error(`Missing ID in params.`)
	res.status(400)
	err.name = `Missing:ID`

	next(err)
}
