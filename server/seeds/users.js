const faker = require('faker/locale/nl')

const firstName1 = faker.name.firstName()
const firstName2 = faker.name.firstName()
const firstName3 = faker.name.firstName()
const firstName4 = faker.name.firstName()
const firstName5 = faker.name.firstName()

module.exports = [
	{
		_id: '58e2be093cf163426eb6d8d1',
		contacts: ['58e2be093cf163426eb6d8d2', '58e2be093cf163426eb6d8d3'],
		firstName: firstName1,
		email: `test@test.com`,
		avatar: '58e4084ad53975150acb43fd',
		prefix: 'van der',
		lastName: faker.name.lastName(),
		password: '123456',
		role: 'listingOwner',
		deleted: false
	}, {
		_id: '58e2be093cf163426eb6d8d3',
		contacts: ['58e2be093cf163426eb6d8d1'],
		firstName: firstName2,
		email: `${firstName2}@${firstName2}.com`,
		avatar: '58e4084ad53975150acb43fe',
		lastName: faker.name.lastName(),
		password: '123456',
		role: 'listingOwner',
		deleted: false
	}, {
		_id: '58e2be093cf163426eb6d8d2',
		contacts: ['58e2be093cf163426eb6d8d3', '58e2be6567411c42cf43f61e'],
		firstName: firstName3,
		email: `${firstName3}@${firstName3}.com`,
		avatar: '58e4084ad53975150acb43ff',
		lastName: faker.name.lastName(),
		password: '123456',
		role: 'listingOwner',
		deleted: false
	}, {
		_id: '58e2be6567411c42cf43f61f',
		contacts: ['58e2be093cf163426eb6d8d3', '58e2be6567411c42cf43f61e'],
		firstName: firstName4,
		email: `${firstName4}@${firstName4}.com`,
		avatar: '58e4084ad53975150acb4400',
		lastName: faker.name.lastName(),
		password: '123456',
		role: 'listingOwner',
		deleted: false
	}, {
		_id: '58e2be6567411c42cf43f61e',
		contacts: ['58e2be093cf163426eb6d8d2'],
		firstName: firstName5,
		email: `${firstName5}@${firstName5}.com`,
		avatar: '58e4084ad53975150acb4401',
		prefix: 'van',
		lastName: faker.name.lastName(),
		password: '123456',
		role: 'user',
		deleted: false
	}
]
