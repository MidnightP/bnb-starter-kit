import React, { Component } from 'react'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'
import { Grid, Row, Col } from 'react-flexbox-grid'

import config from '../../config'
import { getErrorObject } from '../../lib'
import { actions } from './reducer'
import { resetError } from '../../store/error'
import { ListingCard, Map } from '../../components'
import SearchField from './SearchField'

import './listings.css'
import 'react-widgets/dist/css/react-widgets.css'

// TODO __queryDefaults__ not defined?
console.log('CONFIG __queryDefaults__ not defined?', config.__queryDefaults__)

class Listings extends Component {
	constructor() {
		super()
		this.state = {
			query: Object.assign({}, config.__queryDefaults__, {
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
		const newQuery = Object.assign({}, query, overrides)
		if(!deepEqual(query, newQuery)) {
			this.props.getListings(newQuery)
			this.setState({query: newQuery})
		}
	}

	setListingCards(listing, i) {
		const highlight = this.props.highlighted.includes(listing._id)
		return (
			<div className="listing-container-small">
				<ListingCard { ...listing }
					key={listing.user.firstName + '-' + i}
					link={`listings/${listing._id}`}
					highlight={highlight}
					categoriesList={this.props.categoriesList}
					locationsList={this.props.locationsList} />
			</div>
		)
	}

	render() {
		const { loading, count, listings } = this.props
		return (
			<Grid fluid>
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
				<div className="listings-list" >
					{
						listings ?
							listings.map(this.setListingCards.bind(this))
						: null
					}
				</div>
				{/* TODO center prop not doing anything !? */}
				<Row center="xs" className="listings-meta">
					<Col xs={6}>
						<div>
							Found  { count ? count : 0 } listings!
							{
								loading.length ?
									<span className="loader"/>
								: null
							}
						</div>
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
