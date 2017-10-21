import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Grid } from 'react-flexbox-grid'
import _ from 'underscore'

import { history } from '../store/location'
import { Map, ReviewForm, ContactForm } from './'
import { setHighlightedListing } from '../routes/Listings/reducer'

class ListingCard extends Component {

	onMouseEnter() {
		const { _id, expanded } = this.props
		if(!expanded) this.props.setHighlightedListing(_id)
	}

	onMouseLeave() {
		const { expanded } = this.props
		if(!expanded) this.props.setHighlightedListing()
	}

	render() {
		const { expanded, categoriesList, locationsList, location, user, price, description, categories,
			reviewCount, ratingAverage, createdAt, highlight, link } = this.props
		const { firstName, avatar } = user

		const activeCategories = categories.map((c) => {
			return _.findWhere(categoriesList, { _id: c._id })
		})

		const activeLocation = _.findWhere(locationsList, { _id: location._id })

		console.log("ARE WE highlighted ?", highlight);

		return (
			<Grid className={highlight ? "listing listing-highlighted" : "listing"}
				onMouseEnter={this.onMouseEnter.bind(this)}
				onMouseLeave={this.onMouseLeave.bind(this)}
				onClick={ () => link ? history.push(link) : null } >

				<Row>
					<Col xs={6}>
						<img alt={`${firstName} img unavailable`} className={ expanded ? "avatar-large" : "avatar-small" } src={avatar.url ? avatar.url : avatar.dataUrl}/>
						<h1 className="text">{`${firstName} img unavailable`}</h1>
						<p className="text"> PRICE: {price}</p>
					</Col>
					{
						expanded ?
							<Col xs={6}>
								<Map listings={[this.props]}/>
							</Col>
						: null
					}
				</Row>

				<Row>
					<Col xs={12}>
						<p className="text">
							{ expanded ? description : description.substring(0, 250).trim() + '...' }
						</p>
					</Col>
				</Row>

				<Row>
					<Col xs={9}>
						<p className="text"> AMOUNT OF REVIEWS:
							<span className="number">{reviewCount}</span>
						</p>

						<p className="text"> AVERAGE RATING:
							<span className="number">{ratingAverage}</span>
						</p>

						{
							expanded ?
								<div>
									<p className="text"> LISTED SINCE: {createdAt}</p>
									<p className="text"> USER JOINED AT: {user.createdAt}</p>
								</div>
							: null
						}

						{
							activeLocation ?
								<div>
									<p className="text">LOCATION: {activeLocation.name}</p>
									<img alt={`${activeLocation.name} img unavailable`} className="image image-location" src={activeLocation.image} />
								</div>
							: null
						}

						{
							expanded ?
								<Row>
									<Col>
										<ContactForm />
									</Col>
								</Row>
							: null
						}
						{
							expanded ?
								<Row>
									<Col>
										<ReviewForm />
									</Col>
								</Row>
							: null
						}

					</Col>
					<Col xs={3}>
						<p className="text"> CATEGORIES: </p>
						{
							activeCategories.map((c, i) => {
								return (
									<div key={c._id + '-' + i}>
										<p className="text" key={c.name}>{c.name}</p>
										<img alt={`${c.name} img unavailable`} className="image image-category" src={c.image} />
									</div>
								)
							})
						}
					</Col>
				</Row>
			</Grid>
		)
	}
}

export default connect(null, { setHighlightedListing })(ListingCard)
