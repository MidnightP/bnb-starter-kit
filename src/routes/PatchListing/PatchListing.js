import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { ListingForm } from '../../components'
import { resetError } from '../../store/error'
import { patchListing } from './reducer'
import { getErrorObject } from '../../lib'

class PatchListing extends Component {

	componentDidMount() {
		this.props.resetError()
	}

	render() {
		const { location, zipcode, price, description, categories } = this.props.listing

		const initialValues = {
			location,
			zipcode,
			price,
			description,
			categories
		}

		return (
			<ListingForm { ...this.props }
				initialValues={ initialValues }
				onSubmit={ this.props.patchListing }/>
		)
	}
}

const selector = formValueSelector('listing')

const mapStateToProps = (state) => {

	const { zipcode, price, description, categories } = selector(state, 'zipcode', 'price', 'description', 'categories')

	return {
		...getErrorObject(state.error),
		listing: state.singlelisting.listing,
		categoriesList: state.general.categories,
		locationsList: state.general.locations,
		zipcode,
		price,
		description,
		categories
	}
}

export default connect(mapStateToProps, { patchListing, resetError })(PatchListing)
