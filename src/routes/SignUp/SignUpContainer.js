import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { signUp } from '../../store/authentication'
import { resetError } from '../../store/error'
import { UserForm } from '../../components'
import { getErrorObject } from '../../lib'

class SignUp extends PureComponent {

	componentDidMount() {
		this.props.resetError()
	}

	submit(e) {
		e.preventDefault()
		this.props.signUp()
	}

	render() {
		return (
			<UserForm mode='signUp'
				{ ...this.props }
				handleSubmit={this.submit.bind(this)}/>
		)
	}
}

const selector = formValueSelector('user')

const mapStateToProps = (state) => {

	const { password, passwordConfirmation, email, firstName, lastName, avatar, avatarUrl, role } = selector(state, 'email', 'firstName', 'lastName', 'avatar', 'avatarUrl', 'role', 'password', 'passwordConfirmation')

	return {
		...getErrorObject(state.error),
		avatar,
		avatarUrl,
		email,
		firstName,
		lastName,
		role,
		password,
		passwordConfirmation
	}
}


export default connect(mapStateToProps, { signUp, resetError })(SignUp)
