const config = require('../config')

const log = require('./log')('jobs')
const UserToken = require('../models/UserToken')

exports.reaper = (cb) => {
	log.info('Reaping expired tokens!')
	UserToken.find({
		expiresAt: {
			$lte: Date.now()
		}
	}).remove(cb)
}
