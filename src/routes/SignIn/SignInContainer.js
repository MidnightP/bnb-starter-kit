import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { signIn } from '../../store/authentication'
import { resetError } from '../../store/error'
import { UserForm } from '../../components'
import { getErrorObject } from '../../lib'

class SignIn extends PureComponent {

	componentDidMount() {
		this.props.resetError()
	}

	submit(e) {
		e.preventDefault()
		this.props.signIn()
	}

	render() {
		return (
			<UserForm mode='signIn'
				{ ...this.props }
				handleSubmit={this.submit.bind(this)}/>
		)
	}
}

const selector = formValueSelector('user')

const mapStateToProps = (state) => {

	const { password, email } = selector(state, 'email', 'password')

	return {
		...getErrorObject(state.error),
		email,
		password
	}
}

export default connect(mapStateToProps, { signIn, resetError })(SignIn)
