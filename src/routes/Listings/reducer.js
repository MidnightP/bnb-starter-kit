import RequestWrapper from '../../lib/RequestWrapper'

import { setLoading, removeLoading } from '../../store/loading'
import { resetError } from '../../store/error'
import config from '../../config'

const { __apiBase__ } = config
const apiRequestWrapper = new RequestWrapper({ baseURL: __apiBase__ })

// ------------------------------------
// Constants
// ------------------------------------

const GET_LISTINGS = 'GET_LISTINGS'
const SET_HIGHLIGHTED = 'SET_HIGHLIGHTED'

// ------------------------------------
// Thunks rest api
// ------------------------------------

export const getListings = (query) => {
	return (dispatch, getState) => {

		const state = getState()

		// NOTE example validation of zipcode input
		// if(query.zipcode) {
		// 	if(query.zipcode.length === 4) {
		// 		if(!query.zipcode.match(/[0-9]{4}/ig)) return dispatch(setError({ message: 'Invalid Zipcode' }))
		// 	} else if(!(query.zipcode.match(/[0-9]{4}[A-Z]{2}/ig))) {
		// 		return dispatch(setError({ message: 'Invalid Zipcode' }))
		// 	}
		// }

		// let throttle = new Throttle({
		// 	active: false,    // set false to pause queue
		// 	rate: 2,          // how many requests can be sent every `ratePer`
		// 	ratePer: 5000,    // number of ms in which `rate` requests may be sent
		// 	concurrent: 4     // how many requests can be sent concurrently
		// })

		if(state.error) dispatch(resetError())

		dispatch(setLoading('listings'))

		const httpOptions = {
			url: 'listings',
			qs: query
		}

		apiRequestWrapper.get(httpOptions, (error, body) => {
			dispatch(removeLoading('listings'))

			if(error) return console.error('Error in retrieving listings:', error)

			dispatch(getListingsAction(body))
		})
	}
}

// ------------------------------------
// Actions rest api
// ------------------------------------

export const getListingsAction = (payload) => ({
	type: GET_LISTINGS,
	payload
})

// ------------------------------------
// Pure front end actions
// ------------------------------------

export const setHighlightedListing = (highlighted) => {
	const h =
		highlighted ?
			Array.isArray(highlighted) ?
				highlighted : [ highlighted ]
			: []

	return {
		type: SET_HIGHLIGHTED,
		payload: h
	}
}

// ------------------------------------
// Exports
// ------------------------------------

export const actions = {
	setHighlightedListing,
	getListings
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const handleGetListings = (state, payload) => ({ ...state, ...{
		listings: payload.listings,
		count: payload.count,
		coordinates: payload.coordinates
	}
})

const handleSetHighlighted = (state, payload) => ({ ...state, ...{
		highlighted: payload
	}
})

// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[GET_LISTINGS]: handleGetListings,
	[SET_HIGHLIGHTED]: handleSetHighlighted
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
	highlighted: [],
	listings: [],
	coordinates: [],
	count: 0
}

export default (state = initialState, action) => {
	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action.payload) : state
}
