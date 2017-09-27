module.exports = {
	cookieSecret: 'AXFGAhjdsa78ui2jq3e9y^&TY*Y@Hdjsa5ctygjn^%@Tyugehjds8UHJSKKA)SAJCNA',
	cookieOptions: {
		maxAge: 86400000,
		httpOnly: true,
		name: '_starter-token',
		sameSite: false  // 'Strict', 'Lax', true, false
	},
	reaperInterval: '*/5 * * * *',
	apiVersion: '1',
	authVersion: '1',
	corsOptions: {
		// using regex the 'Access-Control-Allow-Origin' header is set in the response on the 'OPTIONS' preflight
		// but not on the response for the first POST
		// but yet it is there on the first re-attempt at POST done by Axiios
		// origin: [/\:\/\/localhost:/ig],

		origin: ['http://localhost:3000'],
		allowedHeaders: [
			'Content-Type',
		// 	'Authorization',
		// 	'Access-Control-Allow-Methods',
		//	'Access-Control-Allow-Origin',
		// 	'Access-Control-Allow-Headers'
		],
		methods: ['GET','PUT','PATCH','POST','DELETE'],
		preflightContinue: false,             // TODO seems to have no effect?
		optionsSuccessStatus: 204,            // TODO seems to have no effect?
		credentials: true                     // sets header 'Access-Control-Allow-Credentials': true
	},
	defaultHeaders: {
		// 'Access-Control-Request-Headers': ['Content-Type', 'Access-Control-Allow-Credentials'],
		// 'Access-Control-Request-Method': 'GET,PUT,PATCH,POST,DELETE',
		'Access-Control-Allow-Credentials': true
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
