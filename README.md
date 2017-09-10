# BnB Starter Kit

This template is written for starters with a bnb. The essence of this web app is, of course, the back end. The front end (heroku link) is meant only to display and use its features. Nonetheless, the app is production ready.

The starter kit is setup in a Rails kind of fashion, with familiar features like database migrations, seeders... (TODO add more). I recommend at least a beginner level with Javascript / Node. Yet, the code is also highly useful for more experienced developers who want to spin up a conventional BnB quickly.

The template is under continous development. Many front-end bugs still need solving and tests will be added in the near future. Please feel free to participate.

## Getting Started

##### Environment

Place the necessary environment variables in the environment. Variables to be included in the client code are prefixed with `REACT_APP_`. Your .bashrc or .zshrc file should contain at least the following:

```
# google API key for clients
export REACT_APP_GOOGLE_API_BROWSER="AIzaSyBxE7hVIvXCDWZNUJRR97bkx7WBdbrApAk"

# google API key for servers
export GOOGLE_API_WEBSERVER="xxx-secret-xxx"

# email
export EMAIL_HOST="not-so-secret"
export EMAIL_PORT="not-so-secret"
export EMAIL_ADDRESS="not-so-secret"
export EMAIL_PASS="xxx-secret-xxx"

# mongo
export DB_USER=""             # add user if present (usually in production)
export DB_PASSWORD=""         # add password if present and user present (usually in production)
export DB_NAME="db_name_xxx"
export DB_HOST="host_name_xx" # "localhost" in development and usually "mongo" in production
export DB_PORT="xxxxx"

```

Replace the secrets with your own, generated with the respective services. Make sure to create the right Google Javascript API-keys. The GOOGLE_API_WEBSERVER key needs to be a **webserver key (webservers, cron jobs enz.)**, which needs to whitelist the relevant IP-address or multiple IP-addresses. The REACT_APP_GOOGLE_API_BROWSER key needs to be a key for **HTTP-requests (websites)**, which needs to whitelist the relevant host names, that is `localhost:3000` for starters.

In production on Heroku, you can set the content of your environment as explained here: https://devcenter.heroku.com/articles/config-vars


You are ready to go!

##### Run the server

`npm install`

`npm start`

If all configuration is in place you should now can now visiti the webapp in the browser. You will notice that their is no content yet. Read the next step on how to seed MongoDB.

##### Seeds

In order to start with a freshly seeded MongoDB, run with the `SEED` flag:

`SEED=1 npm start`

It is now possible to login with **test@test.com** and password **123456**.

You can repeat this whenever desired. Seeding is a nice way to validate what going in to the database still satisfies the models. While developing, start the app normally with `npm start` or some other preferred way. In full production, you can remove the `SEED=1` functionality or prevent it from being run (see NOTE in server/main.js).

To Change the language of the random generator use e.g. `const faker = require('faker/locale/en')` in seeds/index.js:

##### production

When the app is ready to go live and the production build has succeeded, build a Docker container.


If you are using a docker registry make sure you have the user id set in your environment under the key `DOCKER_ID_USER`. Then use docker login to make sure you're logged in. Build the container by running the `docker build -t ${DOCKER_ID_USER}/bnb-starter-kit:0.0.1 .` command. The `-t` flag makes sure it has the right tag for your registry, `${DOCKER_ID_USER}/bnb-starter-kit:0.0.1` being the name of the image with it's version. Note the dot at the end of the command. This makes sure that the Dockerfile in the root of the project is used.

Then push the newly build image `docker push ${DOCKER_ID_USER}/bnb-starter-kit:0.0.1` to the registry.

You can now pulled it somewhere else and run it by using the following command `${DOCKER_ID_USER}/bnb-starter-kit:latest`. Create a `.env` file using the `.env.sample` as a guide and copy the `docker-compose.yml`.

WORKING: `docker run --name bnb-starter-kit --net host --env-file=.env  heijden/bnb-starter-kit`
NOT WORKING: Run `docker-compose up -d` to run the container.

Note: Make you have a version of mongodb running and that the host corresponds to the one specified in `.env`.

## What you should now

##### Authentication & Security

Permission schmea for HTTP-methods:

|   GET   | POST         | PUT          | DELETE       |
|:-------:|:------------:|:------------:|:------------:|
|   any   | listingOwner | listingOwner | listingOwner |
|   own   | user         | user         | user         |
|         | any          |              |              |
|         |              |              |              |

###### When do we check permissions?
When the client makes a request that is no GET.

###### How do we check permissions?
The order in which the permissions middleware looks up grants is crucial and therefore worthwhile explaining.

To keep things simple and robust we follow 2 rules:
A) Composed allowances for a role are based on a left merge of the allowances of that grant and those for 'any'.
B) non-GET actions are specified for a user role (listingOwner or user) only if they are different from 'own' and 'any'. This rule should be kept in mind modifying or extending looking up the allowances.

Also notice writeFields, this object is also required in the api if the user performs a write action on a (one!) model.

Currently we don't have 'own' grant:
Anyhow, 'own' grant should only used when we want to discriminate between a request for users own resource and a user's request for anoher user's resource. 'own' allowances are therefore placed on the request object in addition to the normal allowances.


##### configuration

Different kinds of configuration live in different kinds of places. We have four kinds:

Server:

1) /server/config: Generic config of the app.
2) /server/permissions/grants.json: Here user roles and grants are defined.

Client:

3) /src/config: Here some client configuration like defaultzoom and minimum password length are defined for easy adjustment.
4) /src/text: Here some important text is stored so that it can be easily translated and used in different components.

I advice to go through them before you make any modifications.

To change e.g. the name of the website, change the field `websiteTitle` in both the client code in src/text.js and /config/default.json (used for the emailer).

##### Migrations

How to run database migrations
1) add explanation
2) add simple example migration



## TODO

### Small Bugs


### Questions

css or sass or scss or less in combination with create-react-app ?

think about how to source .env inside the container

### Back End

use bcryptjs package cause bcrypt-node aint working

duplicate key error when seeding more then once.... why?
--> database is not dropped immediately when call back is called?

simplify checkAuthenticated - checkPermissions combination
`req.writefields` is probably not there

debug colors are gawn... ;(

remove config package?

remove logs functionality..? heroku storage is limited... :/

### Front End


1) Can we get the buffer (in the back-end) from the preview reference to the blob? Probably not.

<!--  solved ?
2) we're note receiving the value
	---------------- `ValidationError for User (59791055ece30f12358101c7)`
	`ValidationError: role: Cast to String failed for value "{ name: 'Buyer', value: 'user' }" at path "role"` -->

@@@ Is prefix coming through right in userform ?

@@@ style widgets not simply working (consult respective widgets libraries -> which classNames to use?)

@@@ selector not defined in ContactForm !?!?

Fix contact redux form returning undefined instead of {}

Add redirects to actions (history.push in thunk not working ...?
signIn signOut etc createListing update etc.

If and how to preventDefault() with redux form ??

1) UserForm is not updating when error is set in the state :/

@@@ Is SVG favicon working ...?


### Final TODO

use concurrently module to restart app if it dies in production (if not okay, try forever module)
concurrently not found wheninstalled globally in container .... why?
Dockerfile: `RUN npm install -g --silent concurrently`
package.json: `NODE_ENV=production concurrently --allow-restart --restart-tries 5 \"node server/main.js\" \"serve -s -p 6000 build\"`


## TODO ***


### Small Bugs ***

@@@ `faker.image.image()` and `faker.image.imageUrl()` and `faker.image.city()` give url that generates random image on every get
	How to fixate image faker after seeding ?

### Questions ***

@@@ Mongoose validation resuls in `Unhandled rejection`. How and where to handle it? Is it handled when logged?

**bijlesismore** Grommet or MUI or something else?
----> Check out: http://redux-form.com/6.6.3/examples/material-ui/

**bijlesismore** Use react motion
https://github.com/chenglou/react-motion

### Front end ***

Pull input fields to the right and put all in one column! `right: 0px` on `form-field` and `align-items: space-between` on form tag and `display: inline-block` on form tag all not doing anything.

Use `getComponent` function on all pages' index.js . needed for code splitting

use throttle in components itself to fully control when firing action when required

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
