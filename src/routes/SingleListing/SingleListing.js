import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid'

import { ListingCard, ReviewCard } from '../../components'
import { getListing, getReviews } from './reducer'
import { resetError } from '../../store/error'
import { getErrorObject } from '../../lib'

class SingleListing extends Component {

	componentWillMount() {
		const { _id } = this.props.match.params
		this.props.getListing(_id)
		this.props.getReviews(_id)
	}

	componentDidMount() {
		this.props.resetError()
	}

	setReviewCards(review, i) {
		const { _id } = review

		return (
			<Col key={ _id + '-' + i } xs={4}>
				<ReviewCard { ...review } />
			</Col>
		)
	}

	render() {
		const { listing, reviews } = this.props

		if(!listing) return <div className="loader" />

		return (
			<Grid fluid>
				<Row>
					<Col xs={12}>
						<ListingCard {...listing}
							key={ listing.user.firstName }
							categoriesList={ this.props.categoriesList }
							locationsList={ this.props.locationsList }
							expanded />
					</Col>
				</Row>
				<Row>
					{
						reviews ?
							reviews.map(this.setReviewCards.bind(this))
						: null
					}
				</Row>
			</Grid>
		)
	}
}

const mapStateToProps = (state) => ({
	...getErrorObject(state.error),
	listing: state.singlelisting.listing,
	reviews: state.singlelisting.reviews,
	locationsList: state.general.locations,
	categoriesList:  state.general.categories
})

export default connect(mapStateToProps, { getListing, getReviews, resetError })(SingleListing)
