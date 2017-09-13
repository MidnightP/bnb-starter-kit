import { authRequestWrapper } from '../lib/'

import { history } from './location'
import { setLoading, removeLoading } from './loading'
import { setError } from './error'

// ------------------------------------
// Constants
// ------------------------------------

const AUTH     = 'AUTH'
const SIGN_UP  = 'SIGN_UP'
const SIGN_IN  = 'SIGN_IN'
const SIGN_OUT = 'SIGN_OUT'

// ------------------------------------
// Thunks rest api
// ------------------------------------

export const authenticate = () => {
	return (dispatch, getState) => {

		if(getState().authentication.currentUser) {
			dispatch(setLoading('authenticate'))

			authRequestWrapper.get('/authenticate', (error, body, response) => {
				dispatch(removeLoading('authenticate'))

				if(error) return console.error('Error in authenticating:', error)

				const { statusCode } = response

				if(statusCode === 200) return dispatch(authenticateAction(body))

				dispatch(signOut())
				dispatch(setError(body))
			})
		} else {
			dispatch(signOut())
		}
	}
}

export const signUp = () => {
	return (dispatch, getState) => {

		let { values } = getState().form.user
		delete values.passwordConfirmation

		const httpOptions = {
			uri: '/signup',
			json: values
		}

		console.log('VALUES', values)

		dispatch(setLoading('signUp'))

		authRequestWrapper.post(httpOptions, (error, body, response) => {
			dispatch(removeLoading('signUp'))

			if(error) return console.error('Error in signing up:', error)

			if(response.statusCode !== 200) return dispatch(setError(body))

			history.push('/')
			dispatch(signUpAction(body))
		})
	}
}

export const signIn = () => {
	return (dispatch, getState) => {

		let { values } = getState().form.user

		const httpOptions = {
			uri: '/signin',
			json: values
		}

		dispatch(setLoading('signIn'))

		authRequestWrapper.post(httpOptions, (error, body, response) => {
			dispatch(removeLoading('signIn'))

			if(error) return console.error('Error in signing in:', error)

			if(response.statusCode !== 200) return dispatch(setError(body))

			history.push('/')
			dispatch(signInAction(body))
		})
	}
}

export const signOut = () => {
	return (dispatch, getState) => {
		dispatch(setLoading('signOut'))

		authRequestWrapper.get('/signout', (error, body, response) => {
			dispatch(removeLoading('signOut'))

			history.push('/')
			dispatch(signOutAction())

			if(error) return console.error('Error in signing out:', error)

			if(response.statusCode !== 200) dispatch(setError(body))
		})
	}
}

// ------------------------------------
// Actions Redux only
// ------------------------------------

const authenticateAction = (payload) => ({
	type: AUTH,
	payload
})

const signUpAction = (payload) => ({
	type: SIGN_UP,
	payload
})

const signInAction = (payload) => ({
	type: SIGN_IN,
	payload
})

const signOutAction = (payload) => ({
	type: SIGN_OUT
})

// ------------------------------------
// Exports
// ------------------------------------

export const actions = {
	authenticate,
	signUp,
	signIn,
	signOut
}

// -----------------------------------
// Action Handlers
// -----------------------------------

const handleAuthenticate = (state, payload) => {
	localStorage.setItem('currentUser', JSON.stringify(payload.user))
	return { ...state, currentUser: payload.user }
}

const handleSignUp = (state, payload) => {
	localStorage.setItem('currentUser', JSON.stringify(payload.user))
	return { ...state, currentUser: payload.user }
}

const handleSignIn = (state, payload) => {
	localStorage.setItem('currentUser', JSON.stringify(payload.user))
	return { ...state, currentUser: payload.user }
}

const handleSignOut = (state) => {
	localStorage.removeItem('currentUser')
	return { ...state, currentUser: null }
}

// ----------------------------------
// Main action handler
// ----------------------------------

const ACTION_HANDLERS = {
	[AUTH]: handleAuthenticate,
	[SIGN_UP]: handleSignUp,
	[SIGN_IN]: handleSignIn,
	[SIGN_OUT]: handleSignOut
}

// ------------------------------------
// Reducer
// ------------------------------------

let currentUser

try {
	currentUser = JSON.parse(localStorage.getItem('currentUser'))
} catch (error) {
	if(error) {
		currentUser = null
	}
}

const initialState = { currentUser }

// ------------------------------------
// Reducer
// ------------------------------------

export default (state = initialState, action) => {
	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action.payload) : state
}
