import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col } from 'react-flexbox-grid'

import text from '../text'
import { signOut } from '../store/authentication'

const { websiteTitle } = text


class NavBar extends PureComponent {

	render() {

		const { signedIn, signOut } = this.props
		const listingId = signedIn ? signedIn.listingId : null

		return(
			<Grid className="navbar">
				<Row>
					<Col xs={4}>
						<NavLink to="/" className="link-router">
							<h1>{ websiteTitle }</h1>
						</NavLink>
					</Col>
					{
						!signedIn ?
							<Col xsOffset={4} xs={2}>
								<NavLink to="/signin" className="link-router" activeClassName="link-router--active">
									<h3>Sign in</h3>
								</NavLink>
							</Col>
						: null
					}
					{
						!signedIn ?
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
						signedIn ?
							<Col xsOffset={ listingId ? 0 : 10} xs={2}>
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
		signedIn: !!state.authentication.currentUser
	}
}

export default connect(mapStateToProps, { signOut })(NavBar)
