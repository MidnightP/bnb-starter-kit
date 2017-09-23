### Questions

css or sass or scss or less in combination with create-react-app ?

Breaking changes???
react-scripts  1.0.11  →  1.0.13
react-widgets  ^3.4.8  →  ^4.0.0
supercluster   ^2.3.0  →  ^3.0.0

### Back End

Is `req.body.referrer` not used?

### Front End

`Set-Cookie` header not working.....
START HERE https://github.com/request/request/issues/2747

1) Can we get the buffer (in the back-end) from the preview reference to the blob?
supposedly we need:
```
blob

var reader = new Reader()

/** e.g. readAsText**/
reader.readAsText(blob)

/** check if it's onload or on('load', () => {}) **/
reader.onLoad((res) => {
	console.log(res)
	})

```
But the reader keeps `reader.readyState === 1 && reader.result === ""`


@@@ selector not defined in ContactForm !?!?

Fix contact redux form returning undefined instead of {}

### production

figure out how to use `serve build` and then run the docker container locally and then if and how to use apache2 ?


### Small Bugs ***

@@@ `faker.image.image()` and `faker.image.imageUrl()` and `faker.image.city()` give url that generates random image on every get
	How to fixate image faker after seeding ?

### Questions ***

SEO friendly HTMl and CSS. How?

use uniform error messages (!) to let the the front end know what to do!
We don't need descriptive messages since no one is using the api yet.

@@@ Mongoose validation resuls in `Unhandled rejection`. How and where to handle it? Is it handled when logged?

use `express-session` to simplify code?

**bijlesismore** Grommet or MUI or something else?
----> Check out: http://redux-form.com/6.6.3/examples/material-ui/

**bijlesismore** Use react motion
https://github.com/chenglou/react-motion

### Front end ***

why is the first http request to api an OPTIONS reqest?

In index.html, if possible use variables for things likewebsitetitle

Pull input fields to the right and put all in one column! `right: 0px` on `form-field` and `align-items: space-between` on form tag and `display: inline-block` on form tag all not doing anything.

Use `getComponent` function on all pages' index.js . needed for code splitting

use throttle as an option in request util and set a default. So we can specify throttling in individual reducers.

@@@ Prevent too large image sizes to be uploaded. Check size on file.... --> dispatch error

@@@ Convert all inline style to css or sass or scss or less

Use react-snapshot to create static html as explained by react-app
https://www.npmjs.com/package/react-snapshot

Make scroll movement have horizontal effect ?

@@@ Make sure that there is NO text in components.... but in config/text

Make map size properly with display flex with `{ flex: 1 }` so that searchfield can be on the map :)

figure out how to use `fitBounds` function: https://github.com/istarkov/google-map-react/blob/master/API.md
map needs to now bounds and size (!)
 (https://github.com/istarkov/google-map-react/blob/master/DOC.md)
	`bounds: { nw, se, sw... }, // map corners in lat lng`
	`size: { width, height... } // map size in px`

##### google-map-react ***

Use `marginBounds` array to make sure that markers are not shown when on border of map.

### Back end ***

find out from where (in file structure) it is best do migrations and seeds
preferably outside Docker container (using production config) or preferably in Docker container where production already applies?

debug colors are gawn... ;(

find a way to both source enviroment and set it in docker using a single file!

if the user is non-existent (for whatever reason), the user-less listing should not be send to client! Else, everything breaks...

find a nice way to store logs outside of the container... package for winston protocol?

CORS
a) cors errors are not logged...
b) we still receive proper responses, which I don't see in the front-end but only in network-tab, why?
c) cors errors -> should not be retried

Change reviews route to `listings/:_id/reviews`

Use patch & put for creating, updating and modifying.
Leave post for actions.

Nodemon restart with `rs` not working (see github issue in email)

Resize images to one size and resolution to make sure database size doesnt blow up.

Exposing API : How to authenticate the application client? not only the users github issue #405
Use apiTokens ??

Mongoose validation resuls in `Unhandled rejection`. Are we handling it by logging or possibly catching it in post hooks?

Send email if user receives review
Use mail helper in contacts.js and reviews.js

Add Avatar upload possibility ( Schema.Types.Buffer ?? )

If requirements of geocoding get to special, construct google maps api get request end point instead of using Geocode module.

A1) Figure out if it is wise to Calculate clusters server side ??
A2) Place an async geocode request in the front end
		` return await GeoCoder.geocode(sanitize(overrides.zipcode)) `
		Back end: if coordinates available use them, else look for zipcode....
		This allows us to 'instantly' recenter the map in the browser, before fetching the listings (?).....

Use async await for parallel stuff instead of async module ?

geocoding should happen in put / patch function if zipcode changed, not in pre save hook ??

How to receive all emails in gmail.....?
We can send from Gmail as @bijlesismore.nl but somehow don't receive.... in Gmail

This acl package could be useful, want doesnt have functionality for specific fields...
https://www.npmjs.com/package/acl


##### Express ***

Figure out how to send errors with Express (and create Errors) and catching them with Super Agent
	Currently errors are just send as a body which is wrong!
	------Send real errors instead of message + name object only
				1) Why is error thrown when I use new Error here?
								-> Because of a setting in main.js ?
				2) Why is error.message just the string "[object Object]"

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

Find a good way to send content of `src/config` and `src/text` up from the server.

Think about how to search for fixed location (e.g. Central OBA or OBA Zuid-West).
Think about amenities model and reference in listings

Figure out how to use localStorage to store important parts of state ( use LockR )

How to acheive this: "with Node, you can push the database writes off to the side and deal with them later, proceeding as if they succeeded."

Restore scroll position. See: [React Starter Kit](https://www.reactstarterkit.com) by Kriasoft.

Promise.all for multiple async calls:::::: -->
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise

Connect or connect-redis:
https://www.npmjs.com/package/connect

Storybook
https://github.com/storybooks/react-storybook

Use FireBase for storage of images?
https://firebase.google.com/docs/storage/web/start

Koa is more performant and versatile than Express. It programs much like Express.
Use Koa?


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
