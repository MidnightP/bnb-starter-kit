### Get out there!

medium
slack channels
react starter kits
http://yeoman.io/generators/

### Front End

show reviews

patchListing and createListing stores are redundant since we're using Redux form??

alt tags of images should be something meaningful and something that is not the name of the image, or location or category etc.

signout thunk should not redirect to home if the page that was requested is available for any user (e.g. /listings/:id)

### Back End

check if we really need to set serviceName to `user` like that for authentication routes? Do we really need it? This is inconvenient and confusing.
Instead of logging the service we want to just log the route so that we can figure out exactly we're it comes from.

Does react-maps support google maps v3 key ?

find a way to run production on port 5000 locally but on 80 on server

store token reference on user instead of UserToken?

Set fixed seed images!

Optimize signUp flow

Change reviews route to `listings/:_id/reviews`

Send email if user receives review
Use mail helper in contacts.js and reviews.js

How to receive all emails in gmail.....?
We can send from Gmail as @bijlesismore.nl but somehow don't receive.... in Gmail

Find a good way to send content of `src/config` and `src/text` up from the server so we can use modules like config to fill in some fields there.
First thing is a request to `/config` and put the result in general state.

### Front End

The remove (x) button next to dropped files sends an http request when clicked?

Use everywhere redux-form Synchronous Validation to disable buttons (example made in ContactForm & ReviewForm)

Place 'modules' (/routes/*/reducer.js) inside the store folder in dedicated 'modules' folder with name of particular route
instead of 'hiding' them inside the respective routes. Else you'll have to search and that is never good.

Make scroll movement have horizontal effect ?

Pull input fields to the right and put all in one column! `right: 0px` on `form-field` and `align-items: space-between` on form tag and `display: inline-block` on form tag all not doing anything.

Prevent too large image sizes to be uploaded. Check size on file.... if too large --> dispatch error
--> check again in back-end...!

### Questions ***

Exposing API : How to authenticate the application client? not only the users github issue #405
Use apiTokens? or is whitelisting using CORS sufficient?

do we actually need request wrapper ? maybe only for headers and retry on 502 ...

use XFSR (?) tokens ? What are they for?

Session middleware should be as lean as possible. Think about when and how often to do a database query.
`express-session` is built-in to Express 3.x. use it

SEO friendly HTMl and CSS. How?

use uniform error messages (!) to let the the front end know what to do!
We don't need descriptive messages since no one is using the api yet.

Mongoose validation resuls in `Unhandled rejection`. How and where to handle it? Is it handled when logged?

If requirements of geocoding get to special, construct google maps api get request end point instead of using Geocode module.

A1) Figure out if it is wise to Calculate clusters server side ??
A2) Place an async geocode request in the front end
		` return await GeoCoder.geocode(sanitize(overrides.zipcode)) `
		Back end: if coordinates available use them, else look for zipcode....
		This allows us to 'instantly' recenter the map in the browser, before fetching the listings (?).....

**bijlesismore** Grommet or MUI or something else?
----> Check out: http://redux-form.com/6.6.3/examples/material-ui/

**bijlesismore** Use react motion?
https://github.com/chenglou/react-motion

are we using Etags ?

Think about using express for serving the statics.  This way we can add more security and control. See example:
```javascript
// NOTE Express can be used to serve build

const express = require('express')
const path = require('path')
const log = require('./server/lib/log')('production-server')
const http = require('http')
// const os = require('os')
const port = 3002
// const host = os.hostname()
const app = express()
// app.use(express.static(path.join(__dirname, 'build')))
const server = http.createServer(app)
server
	.on('listening', () => log.info(`Production server serving build on: http://localhost:${port}`))
	.on('error', (error) => log.error('Server error', error))
	.listen(port)
```

### Front end ***

In index.html, if possible use variables for things likewebsitetitle

Use `getComponent` function on all pages' index.js . needed for code splitting (see create-react-app docs for code splitting?)

use throttle as an option in request util and set a default. So we can specify throttling in individual reducers.

@@@ Convert all inline style to css or sass or scss or less

Use react-snapshot to create static html as explained by react-app
https://www.npmjs.com/package/react-snapshot

@@@ Make sure that there is NO text in components.... but in config/text

Make map size properly with display flex with `{ flex: 1 }` ?

figure out how to use `fitBounds` function: https://github.com/istarkov/google-map-react/blob/master/API.md
map needs to now bounds and size (!)
 (https://github.com/istarkov/google-map-react/blob/master/DOC.md)
	`bounds: { nw, se, sw... }, // map corners in lat lng`
	`size: { width, height... } // map size in px`

##### google-map-react ***

Use `marginBounds` array to make sure that markers are not shown when on border of map.

### Back end ***

expand session:
- Set anonymous tokens.
- Store lastVisit on userToken
- Store visitAmount on userToken
- Store known IP's on userToken (put it on all requests with redux middleware)

use header 'Authorization' instead of a POST body
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization

find out from where (in file structure) it is best do migrations and seeds
preferably outside Docker container (using production config) or preferably in Docker container where production already applies?

development
- debug colors are gawn... ;(
- Nodemon restart with `rs` not working (see github issue in email)

find a way to both source enviroment and set it in docker using a single file!

if the user is non-existent (for whatever reason), the user-less listing should not be send to client! Else, everything breaks...

find a nice way to store logs outside of the container... package for winston protocol?

geocoding should happen in put / patch function if zipcode changed, not in pre save hook


##### Authentication & Security ***

FB, Instagram en Google login !!
1) install and configure `passport` (and `passport-strategy`?)
2) https://github.com/jaredhanson/passport-google-oauth2
3) https://github.com/jaredhanson/passport-facebook
--> this should give us already some avatars
check what happens if user changes avatar on social medium
--> use user.patch() to set missing data

Follow these recommendations for Express:
https://expressjs.com/en/advanced/best-practice-security.html

Figure out how to deal with many malicious requests. This saves a lot of checking and sanitizing on the request bodies and headers.
---> Whitelisting + apiKey
	General prevention against too many requests from same address ?
	Front picking of fields is still desired. This prevents against too large bodies or headers.

### Research / decisions ***

Think about how to search for fixed location (e.g. Central OBA or OBA Zuid-West).
Think about amenities model and reference in listings

Figure out how to use localStorage to store important parts of state ( use LockR or serviceWorker ?)

Restore scroll position. See: [React Starter Kit](https://www.reactstarterkit.com) by Kriasoft.

Promise.all for multiple async calls:::::: -->
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise

Storybook
https://github.com/storybooks/react-storybook


#### Code examples for specific locale:

Example for a Dutch zipcode validation:
In the server do either of the two:
1) Use list of zipCode to select from.
2) Validate Dutch zipcode with helper function:

`
let zipCodeCheck = false
if(zipcode)
	if(zipcode.match(/\d{4}[A-Z]{2}/ig)) zipCodeCheck = true
`

`
exports.validateZipcode = [(val) => {
	let valid = true
	valid = val.length === 6
	valid = val.match(/\d{4}[A-Z]{2}/ig).length
	return valid
}, 'Validation:Match:1234XX ({VALUE})' ]
`
Add the helper to the model in models/Listing.js:
`zipcode:     { type: String, required: true, validateZipcode: validateZipcode, maxlength: 6, trim: true },``


### Code example for handling arbitrary searchinput

Add allowedSearchArbitrary field in config/default.json5
`services : { listing: { allowedSearchArbitrary: ['firstName', 'description'] } }`


Add this to readMany in routes/listings.js:
```
const arbitraryQuery = R.pickBy((val, field) => allowedSearchArbitrary.includes(field), req.query)

R.forEachObjIndexed((input, field) => {
	if(input) {
		$and.push({
			[field]: {
				$regex: new RegExp(sanitize(input)),
				$options: 'ix'
			}
		})
	}
}, arbitraryQuery)
```

Also use regex in sanitizeInput in helpers/index.js.
