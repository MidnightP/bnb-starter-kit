import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { ListingForm } from '../../components'
import { resetError } from '../../store/error'
import { createListing } from './reducer'
import { getErrorObject } from '../../lib'

class CreateListing extends Component {

	componentDidMount() {
		this.props.resetError()
	}

	render() {
		return (
			<ListingForm { ...this.props }
				onSubmit={ this.props.createListing }/>
		)
	}
}

const selector = formValueSelector('listing')

const mapStateToProps = (state) => {

	const { zipcode, price, description, categories } = selector(state, 'zipcode', 'price', 'description', 'categories')

	return {
		...getErrorObject(state.error),
		categoriesList: state.general.categories,
		locationsList: state.general.locations,
		zipcode,
		price,
		description,
		categories
	}
}

export default connect(mapStateToProps, { createListing, resetError })(CreateListing)
