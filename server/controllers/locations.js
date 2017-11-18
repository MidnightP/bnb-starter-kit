const config = require('../config')

const { Location }  = require('../models')

// ----------------------------------------
//  get
// ----------------------------------------

exports.readMany = (req, res, next) => {

	Location
		.find({ deleted: false })
		.select(req.allowances[req.grantName].locations.GET.join(' '))
		.lean()
		.sort({ createdAt: 1 })
		.exec((err, locations) => {
			if(err) return next(err)

			res.body = { locations }

			next()
		})
}
