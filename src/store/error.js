const SET_ERROR = 'SET_ERROR'
const RESET_ERROR = 'RESET_ERROR'

// ------------------------------------
// Constants
// ------------------------------------

export const setError = (payload) => ({
	type: SET_ERROR,
	payload
})

export const resetError = (payload) => ({
	type: RESET_ERROR
})

// ------------------------------------
// Exports
// ------------------------------------

export const actions = {
	setError,
	resetError
}

// -----------------------------------
// Action Handlers
// -----------------------------------

const handleSetError = (state, payload) => payload
const handleresetError = (state, payload) => null

// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[SET_ERROR]: handleSetError,
	[RESET_ERROR]: handleresetError
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = null

// ------------------------------------
// Reducer
// ------------------------------------

export default (state = initialState, action) => {
	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action.payload) : state
}
