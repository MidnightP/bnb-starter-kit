import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from './containers/AppContainer'
import createStore from './store/createStore'
import registerServiceWorker from './registerServiceWorker'

import './styles/core.css'

const initialState = window.__INITIAL_STATE__
const store = createStore(initialState)
const routes = require('./routes').default(store)

ReactDOM.render(<AppContainer store={store} routes={routes} />, document.getElementById('root'))

registerServiceWorker()
