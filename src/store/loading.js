const SET_LOADING = 'SET_LOADING'
const REMOVE_LOADING = 'REMOVE_LOADING'

// ------------------------------------
// Actions
// ------------------------------------

export const setLoading = (payload) => ({
	type: SET_LOADING,
	payload
})

export const removeLoading = (payload) => ({
	type: REMOVE_LOADING,
	payload
})

// ------------------------------------
// Exports
// ------------------------------------

export const actions = {
	setLoading,
	removeLoading
}

// -----------------------------------
// Action Handlers
// -----------------------------------

const handleSetLoading = (state, payload) => {
	const active = state.active.includes(payload) ? state.active : [ ...state.active, payload ]
	return { ...state, active }
}
const handleRemoveLoading = (state, payload) => {
	const active = state.active.filter( type => type !== payload && type !== 'main')
	return { ...state, active }
}

// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[SET_LOADING]: handleSetLoading,
	[REMOVE_LOADING]: handleRemoveLoading,
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
	active: ['main']
}

// ------------------------------------
// Reducer
// ------------------------------------

export default (state = initialState, action) => {
	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action.payload) : state
}
