import _ from "underscore"
import retry from  'async/retry'
import axios from  'axios'

const activeWrappers = []

export default ({ baseURL }) => {

	let wrapper

	const active = _.find(activeWrappers, (wrapper) => wrapper.baseURL === baseURL)

	if(active) {
		wrapper = active
	} else {
		wrapper = new RequestWrapper({ baseURL })
		activeWrappers.push(wrapper)
	}

	return wrapper
}

class RequestWrapper {

	constructor({ baseURL }) {
		console.log('BASEURL', baseURL)

		if(!baseURL) console.error('Must provide request wrapper a baseURL')

		this.baseURL          = baseURL
		this.retryTimes       = 4
		this.baseAmount       = 200
		this.maxRetryTimeout  = 1000
		this.retryStatusCodes = [ 500, 502 ]

		this.axios = axios.create({
			baseURL: this.baseURL,
			withCredentials: true,
			// xsrfCookieName: 'token',
			// xsrfHeaderName: 'Token',
			headers: {
				// 'Access-Control-Allow-Credentials': true,
				// 'Access-Control-Allow-Origin': window.location.origin,
				// 'Access-Control-Allow-Methods': ['GET','PUT','PATCH','POST','DELETE'],
				// 'Access-Control-Allow-Headers': [
				// 	'Content-Type',
				// 	'Authorization',
				// 	'Access-Control-Allow-Methods',
				// 	'Access-Control-Allow-Credentials',
				// 	'Access-Control-Allow-Origin',
				// 	'Access-Control-Allow-Headers'
				// ]
			},
			timeout: 1000,         // default
			responseType: 'json',  // default
			validateStatus: status => {
				console.log('STATUS', status)
				console.log("!this.retryStatusCodes.includes(status)", !this.retryStatusCodes.includes(status))
				return !this.retryStatusCodes.includes(status)
			}
		})

		this.retryOptions = {
			times: this.retryTimes,
			errorFilter: error => true,
			interval: (count) => {
				const timeout = count === 2 ? 0 : this.baseAmount * Math.pow(2, count - 2)
				const maxedRetryTimeout = Math.min(timeout, this.maxRetryTimeout)

				if(process.env.NODE_ENV !== 'production') console.warn(`Request failed. Will retry in ${maxedRetryTimeout}`)

				return maxedRetryTimeout
			}
		}
	}

	put(httpOptions, cb) {
		const options = Object.assign({}, httpOptions, { method: 'put' })
		this.request(options, cb)
	}

	post(httpOptions, cb) {
		const options = Object.assign({}, httpOptions, { method: 'post' })
		this.request(options, cb)
	}

	patch(httpOptions, cb) {
		const options = Object.assign({}, httpOptions, { method: 'patch' })
		this.request(options, cb)
	}

	delete(httpOptions, cb) {
		if(typeof httpOptions === 'string') {
			return this.request({
				url: httpOptions
			}, cb)
		}

		const options = Object.assign({}, httpOptions, { method: 'delete' })
		this.request(options, cb)
	}

	get(httpOptions, cb) {
		if(typeof httpOptions === 'string') {
			return this.request({
				url: httpOptions
			}, cb)
		}

		const options = Object.assign({}, httpOptions, { method: 'get' })
		this.request(options, cb)
	}

	request(httpOptions, done) {
		retry(this.retryOptions,

			(cb) => this.issueRequest(httpOptions, cb)

		, (error, body, response) => {
			if(error) return done(`Failed request for "${httpOptions.url}". Reason: ${error}`)

			done(null, body, response)
		})
	}

	issueRequest(httpOptions, cb) {
		this.axios(httpOptions)
			.then(response => {
				if(this.retryStatusCodes.includes(response.status)) {
					return cb(`Request failed with status code ${response.status}`)
				}

				cb(null, response.data, { statusCode: response.status, statusText: response.statusText })
			})
			.catch(cb)
	}
}
