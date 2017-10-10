import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import _ from 'underscore'

import { history } from '../store/location'
import { Map, ReviewForm, ContactForm } from './'
import { setHighlightedListing } from '../routes/Listings/reducer'

const styles = {
	categoryImage: {
		width: '80px',
		height: '80px',
		borderRadius: '50%'
	},
	locationImage: {
		width: '240px'
	},
	text: {
		margin: '4px',
		padding: '4px'
	},
	number: {
		border: '1px solid',
		borderRadius: '50%',
		margin: '4px',
		padding: '4px',
		width: '27px',
		height: '27px'
	},
	listing: {
		border: '1px solid',
		marginBottom: '12px',
		padding: '25px',
		width: '100%'
	},
	listingHighlight: {
		background: 'grey'
	}
}

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
			<div style={highlight ? Object.assign({}, styles.listingHighlight, styles.listing) : styles.listing}
				onMouseEnter={this.onMouseEnter.bind(this)}
				onMouseLeave={this.onMouseLeave.bind(this)}
				onClick={ () => link ? history.push(link) : null }>

				<Row>
					<Col xs={6}>
						<img alt={firstName} className={ expanded ? "avatar-large" : "avatar-small" } src={avatar.url ? avatar.url : avatar.dataUrl}/>
						<h1 style={styles.text}>{firstName}</h1>
						<p style={styles.text}> PRICE: {price}</p>
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
						<p style={styles.text}>
							{ expanded ? description : description.substring(0, 250).trim() + '...' }
						</p>
					</Col>
				</Row>

				<Row>
					<Col xs={9}>
						<p style={styles.text}> AMOUNT OF REVIEWS:
							<span style={styles.number}>{reviewCount}</span>
						</p>

						<p style={styles.text}> AVERAGE RATING:
							<span style={styles.number}>{ratingAverage}</span>
						</p>

						{
							expanded ?
								<div>
									<p style={styles.text}> LISTED SINCE: {createdAt}</p>
									<p style={styles.text}> USER JOINED AT: {user.createdAt}</p>
								</div>
							: null
						}

						{
							activeLocation ?
								<div>
									<p style={styles.text}>LOCATION: {activeLocation.name}</p>
									<img alt={activeLocation.name} style={styles.locationImage} src={activeLocation.image} />
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
						<p style={styles.text}> CATEGORIES: </p>
						{
							activeCategories.map((c, i) => {
								return (
									<div  key={c._id + '-' + i}>
										<p style={styles.text} key={c.name}>{c.name}</p>
										<img alt={c.name} style={styles.categoryImage} src={c.image} />
									</div>
								)
							})
						}
					</Col>
				</Row>
			</div>
		)
	}
}

export default connect(null, { setHighlightedListing })(ListingCard)
