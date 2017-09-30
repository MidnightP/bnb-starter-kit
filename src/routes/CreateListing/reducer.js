import RequestWrapper from '../../lib/RequestWrapper'

import { setLoading, removeLoading } from '../../store/loading'
import { setError } from '../../store/error'
import config from '../../config'

const { __apiBase__ } = config
const apiRequestWrapper = new RequestWrapper({ baseURL: __apiBase__ })

// ------------------------------------
// Constants
// ------------------------------------

const CREATE_LISTING = 'CREATE_LISTING'

// ------------------------------------
// Thunks rest api
// ------------------------------------

export const createListing = () => {
	return (dispatch, getState) => {
		dispatch(setLoading('create_listing'))

		let { values } = getState().form.listing

		const httpOptions = {
			url: '/listings',
			data: values
		}

		apiRequestWrapper.post(httpOptions, (error, body) => {
			dispatch(removeLoading('create_listing'))

			if(error) return dispatch(setError(error))

			dispatch(createListingAction(body))
		})
	}
}

// ------------------------------------
// Actions rest api
// ------------------------------------

const createListingAction = (payload) => ({
	type: CREATE_LISTING,
	payload
})

// ------------------------------------
// Action Handlers
// ------------------------------------

const handleCreateListing = (state, payload) => ({ ...state, listing: payload.listing })

// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[CREATE_LISTING]: handleCreateListing
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
	listing: null
}

export default (state = initialState, action) => {
	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action.payload) : state
}
