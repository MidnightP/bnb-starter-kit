import { apiRequestWrapper } from '../../lib'

import { setLoading, removeLoading } from '../../store/loading'
import { setError } from '../../store/error'

// ------------------------------------
// Constants
// ------------------------------------

const GET_LISTING    = 'GET_LISTING'

// const DELETE_LISTING = 'DELETE_LISTING'

const GET_REVIEWS  = 'GET_REVIEWS'
const CREATE_REVIEW = 'CREATE_REVIEW'

const SEND_MESSAGE = 'SEND_MESSAGE'

// ------------------------------------
// Thunks rest api
// ------------------------------------

export const getListing = (_id) => {
	return (dispatch, getState) => {
		dispatch(setLoading('single_listing'))

		apiRequestWrapper.get(`/listings/${_id}`, (error, body) => {
			dispatch(removeLoading('single_listing'))

			if(error) return dispatch(setError(error))

			dispatch(getListingAction(body))
		})
	}
}

// export const deleteListing = (_id) => {
// 	return (dispatch, getState) => {
//
// 	}
// }

export const getReviews = (_id) => {
	return (dispatch, getState) => {
		dispatch(setLoading('reviews'))

		apiRequestWrapper.get(`/reviews/${_id}`, (error, body) => {
			dispatch(removeLoading('reviews'))

			if(error) return dispatch(setError(error))

			dispatch(getReviewsAction(body))
		})
	}
}


export const createReview = () => {
	return (dispatch, getState) => {
		dispatch(setLoading('create_review'))

		const { values } = getState().form.review

		const httpOptions = {
			uri: `/reviews`,
			json: values
		}

		apiRequestWrapper.post(httpOptions, (error, body) => {
			dispatch(removeLoading('create_reviews'))

			if(error) return dispatch(setError(error))

			dispatch(createReviewAction(body))
		})
	}
}

export const sendMessage = () => {
	return (dispatch, getState) => {
		dispatch(setLoading('send_message'))

		const { values } = getState().form.contact

		const httpOptions = {
			uri: `/contacts`,
			json: values
		}

		apiRequestWrapper.post(httpOptions, (error, body) => {
			dispatch(removeLoading('send_message'))

			if(error) return dispatch(setError(error))

			dispatch(sendMessageAction(body))
		})
	}
}

// ------------------------------------
// Actions rest api
// ------------------------------------

const getListingAction = (payload) => ({
	type: GET_LISTING,
	payload
})

// const deleteListingAction = (payload) => ({
// 	type: DELETE_LISTING,
// 	payload
// })

// TODO fix this action dispatch
const getReviewsAction = (payload) => {
	const rvs = payload ?
		payload.reviews ?
			payload.reviews
		: null
	: null

	return {
		type: GET_REVIEWS,
		payload: {
			reviews: rvs
		}
	}
}

const createReviewAction = (payload) => ({
	type: CREATE_REVIEW,
	payload
})

const sendMessageAction = () => ({
	type: SEND_MESSAGE
})

// ------------------------------------
// Action Handlers
// ------------------------------------

const handleGetListing = (state, payload) => ({ ...state, listing: payload.listing })
// const handleDeleteListing = (state, payload) => ({ ...state, listing: payload.listing })

const handleGetReviews = (state, payload) => ({ ...state, reviews: payload.reviews })
const handleCreateReview = (state, payload) => ({ ...state, reviews: [].concat(state.reviews, payload.review) })

const handleSendMessage = (state) => state

// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[GET_LISTING]: handleGetListing,

	// [DELETE_LISTING]: handleDeleteListing,

	[GET_REVIEWS]: handleGetReviews,
	[CREATE_REVIEW]: handleCreateReview,

	[SEND_MESSAGE]: handleSendMessage
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
	listing: null,
	reviews: null
}

export default (state = initialState, action) => {
	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action.payload) : state
}
