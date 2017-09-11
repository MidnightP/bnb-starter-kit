import retry from  "async/retry"
import request from  "request"

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

	constructor({ baseUrl }) {

		if(!baseUrl) console.error('Must provide request wrapper a baseUrl')

		this.baseAmount       = 200
		this.retryTimes       = 4
		this.maxTimeout       = 1000
		this.retryStatusCodes = [ 500, 502 ]
		this.baseUrl          = baseUrl

		this.http = request.defaults({
			baseUrl: this.baseUrl,
			json:    true
		})
	}

	put(httpOptions, cb) {
		const options = Object.assign({}, httpOptions, { method: 'PUT' })
		this.request(options, cb)
	}

	post(httpOptions, cb) {
		const options = Object.assign({}, httpOptions, { method: 'POST' })
		this.request(options, cb)
	}

	patch(httpOptions, cb) {
		const options = Object.assign({}, httpOptions, { method: 'PATCH' })
		this.request(options, cb)
	}

	delete(httpOptions, cb) {
		const options = Object.assign({}, httpOptions, { method: 'DELETE' })
		this.request(options, cb)
	}

	get(httpOptions, cb) {
		if(typeof httpOptions === 'string') {
			return this.request({
				uri: httpOptions
			}, cb)
		}

		const options = Object.assign({}, httpOptions, { method: 'GET' })
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
				const maxedTimeout = Math.min(timeout, this.maxTimeout)

				return maxedTimeout
			}
		}

		retry(retryOptions,

			(cb) => this.issueRequest(httpOptions, cb)

		, (error, body, response) => {
			if(error) return done(`Failed request. Reason: ${error}`)

			done(null, body, response)
		})
	}

	issueRequest(httpOptions, cb) {
		this.http(httpOptions, (error, response, body) => {

			if(error) return cb(error)

			if(this.retryStatusCodes.includes(response.statusCode)) {
				return cb(`Request failed with status code ${response.statusCode}`)
			}

			cb(null, body, response)
		})
	}
}

export const apiRequestWrapper  = new RequestWrapper({ baseUrl: __apiBase__ })
export const authRequestWrapper = new RequestWrapper({ baseUrl: __authBase__ })
