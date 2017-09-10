import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import { sendMessage } from '../routes/SingleListing/reducer'
import text from '../text'

class ContactForm extends Component {
	constructor() {
		super()
		this.state = {
			disabled: true
		}
	}

	// componentWillReceiveProps(nextProps) {
	// 	this.validate(nextProps)
	// }
	//
	// validate(props) {
	// 	let disabled = true
	// 	let messageCheck = false
	//
	// 	const { message, error } = props
	//
	// 	if(!error && message.length > 150) disabled = false
	//
	// 	this.setState({ disabled })
	// }

	render() {

		const { error } = this.props

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
				<button disabled={this.state.disabled} type="submit">Send</button>
				{
					error ?
						<div className="error">{ error.message }</div>
					: null
				}
			</form>
		)
	}
}

ContactForm = reduxForm({ form: 'contact' })(ContactForm)

const selector = formValueSelector('contact')

// TODO
// selector(state, 'message') should return an empty object instead of undefined

const mapStateToProps = (state) => {
	// const { message } = selector(state, 'message')
	console.log(1, selector(state, 'message'))
	return {
		error: state.error,
		// message
	}
}

export default connect(mapStateToProps, { sendMessage })(ContactForm)
