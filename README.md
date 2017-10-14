# BnB Starter Kit

This template is written for starters with a bnb. The essence of this web app is, of course, the back end. The front end is meant only to display and use its features. Nonetheless, the app is production ready.

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

You are ready to go!

##### Run the server

`npm install`

`npm start`

If all configuration is in place you should now can now visiti the webapp in the browser. You will notice that their is no content yet. Read the next step on how to seed MongoDB.

##### Seeds

In order to start with a freshly seeded MongoDB, run with the `SEED` flag:

`npm run start:seed`

It is now possible to login with **test@test.com** and password **123456**.

You can repeat this whenever desired. Seeding is a nice way to validate what going in to the database still satisfies the models. While developing, start the app normally with `npm start` or some other preferred way. In full production, you can remove the `SEED=1` functionality or prevent it from being run (see NOTE in server/main.js).

To Change the language of the random generator use e.g. `const faker = require('faker/locale/en')` in seeds/index.js:

##### production

Create a production build with `npm run build:prod`. When the app is ready to go live and the production build has succeeded, build a Docker container.

Install the serve module. The bundle i served with `serve -s build`. You can start the server concurrently with `npm run stat:prod`. Notice that if you run the previous command locally, the server will try to restart on killing the process. Change it to 0 in package.json for local testing. Type `serve --help` for options, such as caching 

If you are using a docker registry make sure you are logged in and that you have the user id set in your environment under the key `DOCKER_ID_USER`. Then use docker login to make sure you're logged in. Build the container by running the `docker build -t ${DOCKER_ID_USER}/bnb-starter-kit:0.0.1 .` command. The `-t` flag makes sure it has the right tag for your registry, `${DOCKER_ID_USER}/bnb-starter-kit:0.0.1` being the name of the image with it's version. Note the dot at the end of the command. This makes sure that the Dockerfile in the root of the project is used.

Then push the newly build image `docker push ${DOCKER_ID_USER}/bnb-starter-kit:0.0.1` to the registry.

You can now pull it on a server with `docker pull ${DOCKER_ID_USER}/bnb-starter-kit:0.0.1`. Create a `.env` file using the `.env.sample` as a guide and source it. Also make sure that mongodb is running. The hostname of mongo service specified in specified in `.env` should correspond to the hostname of mongo on the server. Finally, run the container by using the following command `docker run -d --name bnb-starter-kit --net host --env-file=.env  ${DOCKER_ID_USER}/bnb-starter-kit`.

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

##### To do's

For information on current development, I've included a [tentative overview of my to do's](https://github.com/MidnightP/bnb-starter-kit/blob/master/TODO.md).
