const config = require('../config')

const { Category }  = require('../models')

// ----------------------------------------
//  get
// ----------------------------------------

exports.readMany = (req, res, next) => {

	Category
		.find({ deleted: false })
		.select(req.allowances[req.grantName].categories.GET.join(' '))
		.lean()
		.sort({ createdAt: 1 })
		.exec((err, categories) => {
			if(err) return next(err)

			res.body = { categories }

			next()
		})
}
