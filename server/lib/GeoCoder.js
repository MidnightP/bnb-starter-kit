const NodeGeocoder = require('node-geocoder')

const geoCoder = NodeGeocoder({
	provider: 'google',
	httpAdapter: 'https',
	apiKey: process.env.GOOGLE_API_WEBSERVER,
	language: 'nl',
	region: 'nl',
	formatter: null
})

module.exports = geoCoder
