import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import error from './error'
import general from './general'
import loading from './loading'
// import location from './location'
import authentication from './authentication'

export const makeRootReducer = (asyncReducers) => {
	return combineReducers({
		form,
		error,
		general,
		loading,
		// location,
		authentication,
		...asyncReducers
	})
}

export const injectReducer = (store, { key, reducer }) => {
	if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

	store.asyncReducers[key] = reducer
	store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
