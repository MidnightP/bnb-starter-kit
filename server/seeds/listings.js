const faker = require('faker/locale/nl')

const getRandomIntInclusive = () => Math.floor(Math.random() * 99) + 1

module.exports = [
	{
		_id: '58e2be6567411c42cf43f618',
		user: '58e2be093cf163426eb6d8d1',
		categories: ['58e2be093cf163426eb6d8da', '58e2be6567411c42cf43f616'],
		location: '58e2be6567411c42cf43f61a',
		price: getRandomIntInclusive(),
		description: faker.lorem.paragraphs(),
		zipcode: '1025NK',
		deleted: false
	}, {
		_id: '58e2be6567411c42cf43f619',
		user: '58e2be093cf163426eb6d8d3',
		categories: ['58e2be6567411c42cf43f616', '58e2be6567411c42cf43f617'],
		location: '58e2be6567411c42cf43f61c',
		price: getRandomIntInclusive(),
		description: faker.lorem.paragraphs(),
		zipcode: '1051CK',
		deleted: false
	}, {
		_id: '58e2be6567411c42cf43f61b',
		user: '58e2be093cf163426eb6d8d2',
		categories: ['58e2be093cf163426eb6d8da', '58e2be6567411c42cf43f617'],
		location: '58e2be6567411c42cf43f61d',
		price: getRandomIntInclusive(),
		description: faker.lorem.paragraphs(),
		zipcode: '1025KB',
		deleted: false
	}, {
		_id: '58e4084ad53975150acb43fb',
		user: '58e2be6567411c42cf43f61f',
		categories: ['58e2be093cf163426eb6d8da', '58e2be6567411c42cf43f617'],
		location: '58e2be6567411c42cf43f61d',
		price: getRandomIntInclusive(),
		description: faker.lorem.paragraphs(),
		zipcode: '1051NZ',
		deleted: false
	}
]
