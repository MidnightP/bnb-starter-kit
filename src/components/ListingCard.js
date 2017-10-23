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

		let className = "listing"
		if(highlight) className += " listing-highlighted"
		if(expanded) {
			className += " listing-large"
		} else {
			className += " listing-small"
		}

		return (
			<Grid className={className}
				onMouseEnter={this.onMouseEnter.bind(this)}
				onMouseLeave={this.onMouseLeave.bind(this)}
				onClick={ () => link ? history.push(link) : null }>

				<Row>
					<Col start="xs" xs={6}>
						<img alt={`${firstName} img unavailable`} className={ expanded ? "avatar-large" : "avatar-small" } src={avatar.url ? avatar.url : avatar.dataUrl}/>
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
					</Col>
					<Col center="xs" xs={3}>
						<h1 className="text">{ firstName }</h1>
					</Col>
					<Col end="xs" xs={3}>
						{
							expanded ?
							<Map listings={[this.props]}/>
							: null
						}
						<p className="text"> PRICE: {price}</p>
					</Col>
				</Row>


				<Row>
					<Col xs={12}>
						<p className="text">
							{ expanded ? description : description.substring(0, 250).trim() + '...' }
						</p>
					</Col>
				</Row>

				<Row>
					<Col xs={6}>
						{
							activeLocation ?
								<div>
									<img alt={`${activeLocation.name} img unavailable`} className="image image-location" src={activeLocation.image} />
									<p className="text">{activeLocation.name}</p>
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
					{
						activeCategories[0] ?
							<Col xs={3}>
								<img alt={`${activeCategories[0].name} img unavailable`}
									className="image image-category"
									src={activeCategories[0].image} />
								<p className="text">{activeCategories[0].name}</p>
							</Col>
						: null
					}
					{
						activeCategories[1] ?
							<Col bottom="xs" xs={3}>
								<img alt={`${activeCategories[1].name} img unavailable`}
									className="image image-category"
									src={activeCategories[1].image} />
								<p className="text">{activeCategories[1].name}</p>
							</Col>
						: null
					}
				</Row>
			</Grid>
		)
	}
}

export default connect(null, { setHighlightedListing })(ListingCard)
