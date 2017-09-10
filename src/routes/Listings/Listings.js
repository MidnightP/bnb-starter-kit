import React, { Component } from 'react'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'
import R from 'ramda'
import { Grid, Row, Col } from 'react-flexbox-grid'

import config from '../../config'
import { getErrorObject } from '../../lib'
import { actions } from './reducer'
import { resetError } from '../../store/error'
import { ListingCard, Map } from '../../components'
import { SearchField } from './components'

import './listings.css'
import 'react-widgets/dist/css/react-widgets.css'

// TODO __queryDefaults__ not defined?
console.log('CONFIG __queryDefaults__ not defined?', config)

class Listings extends Component {
	constructor() {
		super()
		this.state = {
			query: R.merge(config.__queryDefaults__, {
				zipcode: null,
				category: null,
				location: null,
				radius: null,
				skip: 0
			})
		}
	}

	componentWillMount() {
		this.props.getListings()
	}

	componentDidMount() {
		this.props.resetError()
	}

	getListings(overrides) {
		const { query } = this.state
		const newQuery = R.merge(query, overrides)
		if(!deepEqual(query, newQuery)) {
			this.props.getListings(newQuery)
			this.setState({query: newQuery})
		}
	}

	setListingCards(listing, i) {
		const highlight = this.props.highlighted.includes(listing._id)
		return (
			<ListingCard { ...listing }
				link={`listings/${listing._id}`}
				key={listing.user.firstName + '-' + i}
				highlight={highlight}
				categoriesList={this.props.categoriesList}
				locationsList={this.props.locationsList} />
		)
	}

	render() {
		const { loading, count, listings } = this.props
		return (
			<Grid className="listings-container" fluid>
				<Row>
					<Col className="map" xs={0} sm={12}>
						<Map listings={listings}/>
					</Col>
				</Row>
				<Row>
					<Col className="searchfield" xs={12} md={6} mdOffset={3}>
						<SearchField onSubmit={this.getListings.bind(this)}/>
					</Col>
				</Row>
				<Row>
					<Col className="listings-list" xs={9} mdOffset={3} md={6} >
						{
							listings ?
								listings.map(this.setListingCards.bind(this))
							: null
						}
					</Col>
					<Col className="listings-meta" xs={3} md={3}>
						<div>
							Found  { count ? count : 0 } listings!
						</div>
						{
							loading.length ?
								<div className="loader"/>
							: null
						}
					</Col>
				</Row>
			</Grid>
		)
	}
}

const mapStateToProps = (state) => ({
	...getErrorObject(state.error),
	categoriesList: state.general.categories,
	locationsList: state.general.locations,
	loading: state.loading.active,
	listings: state.listings.listings,
	count: state.listings.count,
	highlighted: state.listings.highlighted
})

export default connect(mapStateToProps, { ...actions, resetError })(Listings)
