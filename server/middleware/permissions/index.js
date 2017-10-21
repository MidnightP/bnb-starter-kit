const log = require('../../lib/log')('middleware:permissions')

// NOTE All actions below are HTTP methods with one exception: GET_OWN.

const grants = {
	any: {
		listings: {
			GET: ['_id', 'location', 'categories', 'user', 'reviews', 'price', 'description', 'coordinates', 'createdAt']
		},
		categories: {
			GET: ['_id', 'name', 'image']
		},
		locations: {
			GET: ['_id', 'name', 'image']
		},
		reviews: {
			GET: ['_id', 'listingId', 'author', 'text', 'rating', 'createdAt', 'updatedAt']
		},
		users: {
			GET_OWN: ['-_id', 'role', 'email', 'firstName', 'prefix', 'lastName', 'avatar', 'createdAt', 'updatedAt'],
			GET:     ['-_id', 'role', 'firstName', 'avatar', 'createdAt'],
			POST:    ['-_id', 'role', 'email', 'password', 'firstName', 'prefix', 'lastName', 'avatar'],
			PATCH:   ['-_id', 'role', 'email', 'firstName', 'prefix', 'lastName', 'avatar']
		},
		avatars: {
			GET:     ['-_id', 'url', 'dataUrl'],
			PATCH:   ['-_id', 'url', 'dataUrl'],
			POST:    ['-_id', 'url', 'dataUrl']

		}
	},
	listingOwner: {
		listings: {
			GET:   ['_id', 'location', 'categories', 'user', 'reviews', 'price', 'description', 'coordinates', 'createdAt', 'zipcode'],
			PATCH: ['-_id', 'location', 'categories', 'price', 'user', 'description', 'zipcode'],
			POST:  ['-_id', 'location', 'categories', 'price', 'user', 'description', 'zipcode']
		},
		categories: {},
		locations: {},
		reviews: {},
		users: {
		}
	},
	user: {
		listings: {},
		categories: {},
		locations: {},
		reviews: {
			POST:  ['-_id', 'listingId', 'author', 'text', 'rating', 'createdAt', 'updatedAt'],
			PATCH: ['-_id', 'listingId', 'author', 'text', 'rating', 'createdAt', 'updatedAt']
		},
		users: {}
	}
}

const allGrantNames = Object.keys(grants)

const allAllowances = allGrantNames.reduce((grantsForGrant, grantName) => {
	grantsForGrant[grantName] = Object.assign({}, grants['any'], grants[grantName])
	return grantsForGrant
}, {})

module.exports = {
	grants,
	allAllowances
}

// NOTE Needs more complex merging ?

// const resourceNames = Object.keys(grants.any)
//
// const lookupAllAllowances = (condition) => {
// 	return allGrantNames.reduce((allAllowances, grantName) => {
// 		allAllowances[grantName] = resourceNames.reduce((services, resourceName) => {
//
// 			if(services[resourceName] === undefined) services[resourceName] = {}
//
// 			if(grants[grantName][resourceName]) {
//
// 				grants[grantName][resourceName].map((method, methodName) => {
// 					if(condition(methodName)) {
// 						if(method) {
// 							services[resourceName][methodName] = grants[grantName][resourceName][methodName]
// 						}
// 					}
// 				})
// 			}
// 			return services
// 		}, {})
// 		return allAllowances
// 	}, {})
// }

// const allWriteAllowances = lookupAllAllowances(methodName => methodName !== 'GET')
// const allReadAllowances  = lookupAllAllowances(methodName => methodName === 'GET')
