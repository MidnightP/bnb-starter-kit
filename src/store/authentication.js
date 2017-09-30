import RequestWrapper from '../lib/RequestWrapper'

import { history } from './location'
import { setLoading, removeLoading } from './loading'
import { setError } from './error'
import config from '../config'

const { __authBase__ } = config
const authRequestWrapper = new RequestWrapper({ baseURL: __authBase__ })

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

				if(error) {
					if(process.env.NODE_ENV !== 'production') console.error('Error in authenticating:', error)
					return dispatch(setError(error))
				}

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

		if(!values) return dispatch(setError({ message: 'sign up form is empty' }))

		delete values.passwordConfirmation

		const httpOptions = {
			url: '/signup',
			data: values
		}

		dispatch(setLoading('signUp'))

		authRequestWrapper.post(httpOptions, (error, body, response) => {
			dispatch(removeLoading('signUp'))

			if(error) {
				if(process.env.NODE_ENV !== 'production') console.error('Error in signing up:', error)
				return dispatch(setError(error))
			}

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
			url: '/signin',
			data: values
		}

		dispatch(setLoading('signIn'))

		authRequestWrapper.post(httpOptions, (error, body, response) => {
			dispatch(removeLoading('signIn'))

			if(error) {
				if(process.env.NODE_ENV !== 'production') console.error('Error in signing in:', error)
				return dispatch(setError(error))
			}

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

			if(error) {
				if(process.env.NODE_ENV !== 'production') console.error('Error in signing out:', error)
				return dispatch(setError(error))
			}

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
