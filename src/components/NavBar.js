import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col } from 'react-flexbox-grid'

import text from '../text'
import { signOut } from '../store/authentication'

const { websiteTitle } = text

class NavBar extends PureComponent {

	render() {

		let listingId, firstName, avatar
		const { currentUser, signOut } = this.props

		if(currentUser){
			listingId = currentUser.listingId
			firstName = currentUser.firstName
			avatar    = currentUser.avatar
		}

		return(
			<Grid className="navbar">
				<Row>
					<Col xs={4}>
						<NavLink to="/" className="link-router">
							<h1>{ websiteTitle }</h1>
						</NavLink>
					</Col>
					{
						!currentUser ?
							<Col xsOffset={4} xs={2}>
								<NavLink to="/signin" className="link-router" activeClassName="link-router--active">
									<h3>Sign in</h3>
								</NavLink>
							</Col>
						: null
					}
					{
						!currentUser ?
							<Col xs={2}>
								<NavLink to="/signup" className="link-router" activeClassName="link-router--active">
									<h3>Sign up</h3>
								</NavLink>
							</Col>
						: null
					}
					{
						listingId ?
							<Col xsOffset={4} xs={2}>
								<NavLink to={`/listings/${listingId}`} className="link-router" activeClassName="link-router--active">
									<h3>My listing</h3>
								</NavLink>
							</Col>
						: null
					}
					{
						currentUser ?
							<Col xsOffset={ listingId ? 0 : 4 } xs={2}>
								<img alt={`avatar for ${firstName}`} className="avatar-small" src={avatar} />
							</Col>
						: null
					}
					{
						currentUser ?
							<Col xs={2}>
								<div onClick={signOut} className="link-router">
									<h3>Sign out</h3>
								</div>
							</Col>
						: null
					}
				</Row>
			</Grid>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.authentication.currentUser
	}
}

export default connect(mapStateToProps, { signOut })(NavBar)
