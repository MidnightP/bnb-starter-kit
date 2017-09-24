import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import { getErrorObject } from '../lib'
import { createReview } from '../routes/SingleListing/reducer'
import text from '../text'

class ReviewForm extends Component {

	// onSubmit(e,b,c) {
	// 	e.preventDefault()
	// 	console.log(e);
	// 	console.log(b);
	// 	console.log(c);
	// 	// this.props.createReview()
	// }

	render() {

		const { error } = this.props

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
				<button type="submit">Opslaan</button>
				{
					error ?
						<div className="error">{ error.message }</div>
					: null
				}
			</form>
		)
	}
}

ReviewForm = reduxForm({ form: 'review' })(ReviewForm)

const selector = formValueSelector('review')

const mapStateToProps = (state) => {
	const { text, rating } = selector(state, 'text', 'rating')
	return {
		...getErrorObject(state.error),
		text,
		rating
	}
}

export default connect(mapStateToProps, { createReview })(ReviewForm)
