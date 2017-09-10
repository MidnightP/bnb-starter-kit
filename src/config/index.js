import text from '../text'

const { user, listingOwner } = text.alias

export default {
	__apiBase__: `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/v0.1`,
	__authBase__: `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/auth/v0.1`,
	__queryDefaults__: {
		limit: 10,
		sort: { createdAt: 1 }
	},
	__radiusMax__: 50,
	__defaultZoom__: 8,
	__defaultCenter__: [52.21083, 4.655556],
	listing: {
		description: {
			minLength: 20
		}
	},
	user: {
		password: {
			minLength: 4
		},
		roles: [{
			text: user,
			value: 'user'
		}, {
			text: listingOwner,
			value: 'listingOwner'
		}]
	}
}
