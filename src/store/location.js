import createBrowserHistory from 'history/createBrowserHistory'

export const history = createBrowserHistory()

// ------------------------------------
// Constants
// ------------------------------------
export const LOCATION_CHANGE = 'LOCATION_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export const locationChange = (location = '/') => {
	return {
		type: LOCATION_CHANGE,
		payload: location
	}
}

// ------------------------------------
// Thunks
// ------------------------------------
export const updateLocation = ({ dispatch }) => {
	return (nextLocation) => dispatch(locationChange(nextLocation))
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = history.location

export default function locationReducer (state = initialState, action) {
	return action.type === LOCATION_CHANGE
		? action.payload
		: state
}
