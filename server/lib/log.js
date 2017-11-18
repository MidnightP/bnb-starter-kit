const winston = require('winston')

module.exports = (label = 'main') => {
	return new winston.Logger({
		transports: [
			new (winston.transports.Console)({
				colorize:  true,
				timestamp: process.env.NODE_ENV === 'production',
				label:     label
			}),
			new (winston.transports.File)({
				name:     'info-file',
				filename: 'logs/filelog-info.log',
				level:    'info'
			}),
			new (winston.transports.File)({
				name:     'error-file',
				filename: 'logs/filelog-error.log',
				level:    'error'
			})
		]
	})
}
