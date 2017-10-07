import React, { Component } from 'react'
import { Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { Provider } from 'react-redux'

import { history } from '../store/location'
import { getCategories, getLocations } from '../store/general'
import { authenticate } from '../store/authentication'
import CoreLayout from './CoreLayout'

class AppContainer extends Component {

	componentWillMount() {

		const { currentUser, authenticate, getCategories, getLocations } = this.props

		authenticate()
		getCategories()
		getLocations()
	}

	shouldComponentUpdate () {
		return false
	}

	render () {
		const { store, routes } = this.props

		return (
			<Provider store={store}>
				<Router history={history} >
					<CoreLayout children={routes} />
				</Router>
			</Provider>
		)
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.authentication.currentUser
})

export default connect(mapStateToProps, { getCategories, getLocations, authenticate })(AppContainer)
