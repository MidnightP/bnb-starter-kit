import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import { getErrorObject } from '../lib'
import { createReview } from '../routes/SingleListing/reducer'
import text from '../text'

const validate = (values) => {

	const { rating, text } = values

	const errors = {}

	if(!rating) {
		errors.rating = 'Must provide rating'
	}

	if(!text) {
		errors.text = 'Must provide text'
	} else if(text.length < 30) {
		errors.text = 'Text is too short (min. 30)'
	}

	return errors
}

class ReviewForm extends Component {

	render() {

		const { error, valid } = this.props

		return (
			<form onSubmit={this.props.createReview}>
				<div>
					<label htmlFor="rating">{ text.alias.rating } </label>
					<Field id="rating"
						name="rating"
						component="input"
						type="number"
						min="1"
						max="5"/>
				</div>
				<div>
					<label htmlFor="text">{ text.alias.review } </label>
					<Field id="text"
						name="text"
						component="input"
						type="text"
						maxLength="400"/>
				</div>
				<button type="submit" disabled={ !valid || error }>Opslaan</button>
				{
					error ?
						<div className="error">{ error.message }</div>
					: null
				}
			</form>
		)
	}
}

ReviewForm = reduxForm({ form: 'review', validate: validate })(ReviewForm)

const selector = formValueSelector('review')

const mapStateToProps = (state) => {
	return {
		...getErrorObject(state.error),
	}
}

export default connect(mapStateToProps, { createReview })(ReviewForm)
