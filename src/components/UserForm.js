import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Field, reduxForm } from 'redux-form'

import Dropzone from './Dropzone'
import Dropdown from './Dropdown'
import config from '../config'

const { roles } = config.user

class UserForm extends Component {

	constructor() {
		super()
		this.state = {
			disabled: true,
			passwordCheck: false
		}
	}

	componentWillReceiveProps(nextProps) {
		this.validate(nextProps)
	}

	validate(props) {
		let disabled = true

		const { password, passwordConfirmation, email, firstName, lastName, role, avatar, avatarUrl } = props

		const passwordCheck = this.checkPasswords(password, passwordConfirmation)
		const avatarCheck = avatar || avatarUrl

		if(this.props.mode === 'signUp')
			if(passwordCheck && avatarCheck && email && firstName && lastName && role) disabled = false

		if(this.props.mode === 'signIn')
			if(passwordCheck && email) disabled = false

		this.setState({ passwordCheck, disabled })
	}

	checkPasswords(password, passwordConfirmation) {
		if(password) {
			if(password.length < config.user.password.minLength) {
				return false
			}
		}

		if(this.props.mode === 'signIn') {
			if(password) {
				if(password.length >= config.user.password.minLength) {
					return true
				}
			}
		}

		if(this.props.mode === 'signUp') {
			if(password !== passwordConfirmation) {
				return false
			} else {
				return true
			}
		}
	}

	render() {

		const { mode, errorMessage, errorCode, avatar, avatarUrl } = this.props

		// TODO pull form field right (using css, but how...?) so that they are all aligned....

		return (
			<Grid>
				<Row>
					<Col xs={12} sm={6}>
						<form onSubmit={this.props.handleSubmit}>
							<div className={  errorCode === 404 ? " error" : "" }>
								<label htmlFor="email">Email *</label>
								<Field className="form-field"
									id="email"
									name="email"
									component="input"
									type="email"
									maxLength="30"/>
							</div>
							<div className={  errorCode === 403 ? " error" : "" }>
								<label htmlFor="password">Password *</label>
								<Field className={ "form-field" }
									id="password"
									name="password"
									component="input"
									type="password"
									maxLength="30"/>
							</div>
							{
								mode === 'signUp' ?
									<div>
										<div>
											<label htmlFor="passwordConfirmation">Password confirmation *</label>
											<Field className="form-field"
												id="passwordConfirmation"
												name="passwordConfirmation"
												component="input"
												type="password"
												maxLength="30"/>
										</div>
										<div>
											<label htmlFor="firstName">Surname *</label>
											<Field className="form-field"
												id="firstName"
												name="firstName"
												component="input"
												type="text"
												maxLength="15"/>
										</div>

										<div>
											<label htmlFor="prefix">Prefix</label>
											<Field className="form-field"
												id="prefix"
												name="prefix"
												component="input"
												type="text"
												maxLength="10"/>
										</div>

										<div>
											<label htmlFor="lastName">Last name *</label>
											<Field className="form-field"
												id="lastName"
												name="lastName"
												component="input"
												type="text"
												maxLength="15"/>
										</div>
										<div>
											<label htmlFor="role">Role *</label>
											<Field className="form-field"
												id="role"
												name="role"
												valueField="value"
												textField="text"
												component={Dropdown}
												data={roles}/>
										</div>
										{
											!avatar ?
												<div>
													<label htmlFor="avatarUrl">Avatar (URL)</label>
													<Field className="form-field"
														id="avatarUrl"
														name="avatarUrl"
														type="text"
														component="input"
														maxLength="500"/>
												</div>
											: null
										}
										{
											!avatarUrl ?
												<div>
													<label htmlFor="avatar">Avatar (upload a file)</label>
													<Field className="form-field"
														id="avatar"
														name="avatar"
														type="file"
														multiple={ false }
														component={ Dropzone }/>
												</div>
											: null
										}
									</div>
								: null
							}
							{/*
								NOTE use this button instead
								<button type="submit" disabled={this.state.disabled}>
							*/}
							<button type="submit" >
								{ mode === 'signUp' ? 'Sign up' : mode === 'signIn' ? 'Sign in' : null }
							</button>
						</form>
						<div>
							<NavLink to={`/signin`}
								activeStyle={{ display: 'none' }}
								activeClassName='change-mode'>
								<button>Already have an account?</button>
							</NavLink>
							<NavLink to={`/signup`}
								activeStyle={{ display: 'none' }}
								activeClassName='change-mode'>
								<button>Want to create an account?</button>
							</NavLink>
							{
								errorMessage ?
									<div className="error">{ errorMessage }</div>
								: null
							}
						</div>
					</Col>
				</Row>
			</Grid>
		)
	}
}

UserForm = reduxForm({ form: 'user' })(UserForm)

export default UserForm
