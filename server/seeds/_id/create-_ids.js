const config = require('config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const mongodbUri = require('mongodb-uri')

const mongodb_url = mongodbUri.format(config.get('mongodb'))

mongoose.connect(mongodb_url, err => {
	if(err) return console.error('Error connecting to Mongoose !', err)

	const Dummy = mongoose.model('dummy', new mongoose.Schema({
		text: String
	}))

	let _ids = []
	let times = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

	times.forEach(a => {
		const entry = new Dummy({text: 'I am a dummy'})
		console.info(entry._id)
	})
	process.exit(0)
})
