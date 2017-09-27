import { RequestWrapper } from '../../lib'

import { setLoading, removeLoading } from '../../store/loading'
import { setError } from '../../store/error'
import config from '../../config'

const { __apiBase__ } = config
const apiRequestWrapper = new RequestWrapper({ baseURL: __apiBase__ })

// ------------------------------------
// Constants
// ------------------------------------

const PATCH_LISTING  = 'PATCH_LISTING'

// ------------------------------------
// Thunks rest api
// ------------------------------------

export const patchListing = () => {
	return (dispatch, getState) => {
		dispatch(setLoading('patch_listing'))

		// TODO should we get _id from listing form ? No, as param given to action payload...
		const { values, _id } = getState().form.listing

		const httpOptions = {
			url: `/listings/${_id}`,
			data: values
		}

		apiRequestWrapper.post(httpOptions, (error, body) => {
			dispatch(removeLoading('patch_listing'))

			if(error) return dispatch(setError(error))

			dispatch(patchListingAction(body))
		})
	}
}

// ------------------------------------
// Actions rest api
// ------------------------------------

const patchListingAction = (payload) => ({
	type: PATCH_LISTING,
	payload
})

// ------------------------------------
// Action Handlers
// ------------------------------------

const handlePatchListing = (state, payload) => ({ ...state, listing: payload.listing })


// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[PATCH_LISTING]: handlePatchListing
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
