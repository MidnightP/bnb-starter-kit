import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import { history } from './location'
import makeRootReducer from './reducers'
import { updateLocation } from './location'


export default (initialState = {}) => {

	const middleware = [
		thunk
	]


	const enhancers = []

	let composeEnhancers = compose

	if (process.env.NODE_ENV === 'development') {
		const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		if (typeof composeWithDevToolsExtension === 'function') {
			composeEnhancers = composeWithDevToolsExtension
		}
	}

	const store = createStore(
		makeRootReducer(),
		initialState,
		composeEnhancers(
			applyMiddleware(...middleware),
			...enhancers
		)
	)
	store.asyncReducers = {}

	// To unsubscribe, invoke `store.unsubscribeHistory()` anytime
	store.unsubscribeHistory = history.listen(updateLocation(store))

	if(module.hot) {
	module.hot.accept('./reducers', () => {
			const reducers = require('./reducers').default
			store.replaceReducer(reducers(store.asyncReducers))
		})
	}

	return store
}
