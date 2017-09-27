import { RequestWrapper } from '../lib'
import { setLoading, removeLoading } from './loading'

import config from '../config'

const { __apiBase__ } = config
const apiRequestWrapper = new RequestWrapper({ baseURL: __apiBase__ })

// ------------------------------------
// Constants
// ------------------------------------

const GET_CATEGORIES = 'GET_CATEGORIES'
const GET_LOCATIONS = 'GET_LOCATIONS'

// ------------------------------------
// Thunks rest api
// ------------------------------------

export const getCategories = () => {
	return (dispatch, getState) => {
		dispatch(setLoading('categories'))

		apiRequestWrapper.get('/categories', (error, body) => {
			dispatch(removeLoading('categories'))

			if(error) return console.error('Error in retrieving categories:', error)

			dispatch(getCategoriesAction(body))
		})
	}
}

export const getLocations = () => {
	return async (dispatch, getState) => {
		dispatch(setLoading('locations'))

		apiRequestWrapper.get('/locations', (error, body) => {
			dispatch(removeLoading('locations'))

			if(error) return console.error('Error in retrieving locations:', error)

			dispatch(getLocationsAction(body))
		})
	}
}

// ------------------------------------
// Actions rest api
// ------------------------------------

const getCategoriesAction = (payload) => ({
	type: GET_CATEGORIES,
	payload
})

const getLocationsAction = (payload) => ({
	type: GET_LOCATIONS,
	payload
})

// ------------------------------------
// Action Handlers
// ------------------------------------

const handleGetCategories = (state, payload) => ({ ...state, categories: payload.categories })
const handleGetLocations = (state, payload) => ({ ...state, locations: payload.locations })

// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[GET_CATEGORIES]: handleGetCategories,
	[GET_LOCATIONS]: handleGetLocations
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
	categories: [],
	locations: []
}

export default (state = initialState, action) => {
	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action.payload) : state
}
