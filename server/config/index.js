module.exports = {
	cookieSecret: 'AXFGAhjdsa78ui2jq3e9y^&TY*Y@Hdjsa5ctygjn^%@Tyugehjds8UHJSKKA)SAJCNA',
	cookieOptions: {
		maxAge: 86400000,
		httpOnly: true
	},
	reaperInterval: '*/5 * * * *',
	// TODO use this:
	// viewRoutes: ['/', 'advertenties'],
	viewRoutes: ['*'],
	apiVersion: '1',
	authVersion: '1',
	corsOptions: {
		origin: ['http://localhost:3000'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		methods: 'GET,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 204
	},
	googleMapsLanguage: 'nl',
	googleMapsRegion: 'NL',
	services: {
		listing: {
			limitDefault: 50,
			sortDefault: 'price',
			orderDefault: -1
		}
	}
}
