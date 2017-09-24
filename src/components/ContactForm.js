import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import { getErrorObject } from '../lib'
import { sendMessage } from '../routes/SingleListing/reducer'
import text from '../text'

const validate = (values) => {

	const { message } = values

	const errors = {}

	if(!message) {
		errors.message = 'Must provide message'
	} else if(message.length < 150) {
		errors.message = 'Message is too short'
	}

	console.log('ERRORS', errors)
	return errors
}

class ContactForm extends Component {
	constructor() {
		super()
		this.state = {
			disabled: true
		}
	}

	render() {

		const { error, submitting } = this.props

		return (
			<form onSubmit={this.props.sendMessage}>
				<div>
					<label htmlFor="message">{ text.alias.message } *</label>
					<Field id="message"
						name="message"
						component="input"
						type="text"
						maxLength="400"/>
				</div>
				<button disabled={ !submitting } type="submit">Send</button>
				{
					error ?
						<div className="error">{ error.message }</div>
					: null
				}
			</form>
		)
	}
}

ContactForm = reduxForm({ form: 'contact', validate: validate })(ContactForm)

const mapStateToProps = (state) => {
	return {
		...getErrorObject(state.error)
	}
}

export default connect(mapStateToProps, { sendMessage })(ContactForm)
