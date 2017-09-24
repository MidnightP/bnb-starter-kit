import retry from  'async/retry'
import axios from  'axios'

import config from '../config'

const { __apiBase__, __authBase__ } = config

export const capitalizeFirst = string => string.charAt(0).toUpperCase() + string.slice(1)

export const sanitize = input => input ? input.replace(/[-[\]/{}()*+?.^$|<>]/g, '\\$&').trim() : ''

export const getErrorObject = (error) => ({
	errorName:    error ? error.name    : null,
	errorMessage: error ? error.message : null,
	errorCode:    error ? error.code    : null,
})

class RequestWrapper {

	constructor({ baseURL }) {

		if(!baseURL) console.error('Must provide request wrapper a baseURL')

		this.baseURL          = baseURL
		this.retryTimes       = 4
		this.baseAmount       = 200
		this.maxRetryTimeout  = 1000
		this.retryStatusCodes = [ 500, 502 ]

		//  do we need to change these options?
		// `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
		//  xsrfCookieName: 'XSRF-TOKEN', // default
		// `xsrfHeaderName` is the name of the http header that carries the xsrf token value
		//  xsrfHeaderName: 'X-XSRF-TOKEN', // default

		this.axios = axios.create({
			baseURL: this.baseURL,
			withCredentials: true,
			// xsrfCookieName: 'token',
			// xsrfHeaderName: 'Token',
			headers: {
				'Access-Control-Allow-Credentials': true,
				'Access-Control-Allow-Origin': window.location.origin,
				'Access-Control-Allow-Methods': ['GET','PUT','PATCH','POST','DELETE'],
				'Access-Control-Allow-Headers': [
					'Content-Type',
					'Authorization',
					'Access-Control-Allow-Methods',
					'Access-Control-Allow-Credentials',
					'Access-Control-Allow-Origin',
					'Access-Control-Allow-Headers'
				]
			},
			timeout: 1000,         // default
			responseType: 'json'   // default
		})
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

		const retryOptions = {
			times: this.retryTimes,
			errorFilter: (error) => {
				console.error(error)
				return true
			},
			interval: (count) => {
				const timeout = count === 2 ? 0 : this.baseAmount * Math.pow(2, count - 2)
				const maxedRetryTimeout = Math.min(timeout, this.maxRetryTimeout)

				return maxedRetryTimeout
			}
		}

		retry(retryOptions,

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

export const apiRequestWrapper  = new RequestWrapper({ baseURL: __apiBase__ })
export const authRequestWrapper = new RequestWrapper({ baseURL: __authBase__ })
