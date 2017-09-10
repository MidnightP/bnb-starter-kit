const mongodb = require('mongodb')

module.exports = (req, res, next) => {
	if(req.params._id){
		if(mongodb.ObjectId.isValid(req.params._id)) {
			return next()
		} else {
			const err = new Error(`Incorrect id in params.`)
			err.status = 400
			err.name = `Incorrect:ID`

			next(err)
		}
	} else {
		const err = new Error(`Missing ID in params.`)
		err.status = 400
		err.name = `Missing:ID`

		next(err)
	}
}
