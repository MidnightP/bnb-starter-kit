import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMap from 'google-map-react'
import supercluster from 'supercluster'

import Cluster from './Cluster'
import config from '../../config'
import Marker from './Marker'
import snazzy from '../../styles/snazzy'

const { __defaultZoom__, __defaultCenter__ } = config

const CLUSTER_RADIUS = 240

class Map extends Component {

	constructor(props) {
		super(props)
		this.state = {
			zoom: __defaultZoom__,
			setZoom: __defaultZoom__,
			center: __defaultCenter__,
			setCenter: __defaultCenter__
		}
	}

	componentWillReceiveProps(newProps) {
		const { searchedCoordinates, singleListingCoordinates } = newProps
		const setCenter = searchedCoordinates !== this.state.center
		if(searchedCoordinates) {
			if(setCenter) this.setState({ setCenter: [searchedCoordinates[1], searchedCoordinates[0]] })
		} else if(singleListingCoordinates) {
			this.setState({ setCenter: [singleListingCoordinates[1], singleListingCoordinates[0]] })
		}
	}

	handleClick = ({ x, y, lat, lng, event }) => {
		// console.log('handleClick: ', x, y, lat, lng, event)
	}

	handleBoundsChange = ({ center, zoom, bounds, marginBounds }) => {
		// console.log('handleBoundsChange: ', center, zoom, bounds, marginBounds)
		if(zoom !== this.state.zoom || center !== this.state.center) {
			this.setState({
				center,
				zoom
			})
		}
	}

	setMarkers(listings) {
		const MAX_ZOOM = 13
		const MIN_ZOOM = 4

		let index = supercluster({
			radius: CLUSTER_RADIUS,
			minZoom: MIN_ZOOM,
			maxZoom: MAX_ZOOM
		})

		const points = listings.map(({_id, coordinates, description }) => ({
			id: _id,
			geometry: {
				type: 'Point',
				coordinates: coordinates
			},
			properties: {
				_id,
				description
			}
		}))

		// TODO What does it do ?
		if(this.state.zoom === MAX_ZOOM) console.info('MAX_ZOOM !')
		if(this.state.zoom === MIN_ZOOM) console.info('MIN_ZOOM !')

		// TODO We might need to combine info from the index and CLUSTER_RADIUS in order
		// to get to the points in the cluster fit the bounds onclick
		index.load(points)

		// NOTE bbox array ([westLng, southLat, eastLng, northLat]) and integer zoom
		return index.getClusters([-180, -85, 180, 85], this.state.zoom)
	}

	panToMarker(coords) {
		const center = [coords[1], coords[0]]

		//  TODO check whether cluster or marker
		// const zoom = Math.round(CLUSTER_RADIUS / 10)
		const zoom = 12

		this.setState({
			setCenter: center,
			setZoom: zoom,
			zoom,
			center
		})
	}

	renderMarker(m) {
		const { highlighted } = this.props

		const { properties } = m
		const lng = m.geometry.coordinates[0]
		const lat = m.geometry.coordinates[1]

		const defaultMarkerProps = {
			coordinates: m.geometry.coordinates,
			panToMarker: this.panToMarker.bind(this)
		}

		if(properties.cluster){
			const { point_count, cluster_id } = properties

			const clusterProps = {
				numPoints: point_count
			}

			return <Cluster key={cluster_id}
								{ ...defaultMarkerProps }
								{ ...clusterProps }
								lat={lat}
								lng={lng}/>
		} else {
			const { id } = m
			const highlight = highlighted ? highlighted.includes(id) : false

			return <Marker key={id}
								{ ...defaultMarkerProps }
								{ ...properties }
								link={`listings/${id}`}
								highlight={highlight}
								lat={lat}
								lng={lng}/>
		}
	}

	render (){
		const { listings } = this.props
		const { setCenter, setZoom } = this.state

		const settings = {
			// NOTE style: { flex: 1 }, can be used to e.g. place searchfield on top of the map
			bootstrapURLKeys : {
				key:      process.env.REACT_APP_GOOGLE_API_BROWSER,

				// TODO get these from src/config/
				// language: process.env.GOOGLE_MAPS_LANGUAGE,
				// region:   process.env.GOOGLE_MAPS_REGION,
			},
			zoom:   setZoom,
			center: setCenter,
			options : {
				zoomControl: false,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false,
				styles: snazzy
			}
		}

		const markers = listings ? this.setMarkers(listings) : []

		return (
			<GoogleMap { ...settings }
				onClick={ this.handleClick }
				onChange={ this.handleBoundsChange }
				panControl
				onScroll >
				{
					markers.map(this.renderMarker.bind(this))
				}
			</GoogleMap>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		singleListingCoordinates: state.singlelisting ? state.singlelisting.coordinates : null,
		searchedCoordinates: state.listings ? state.listings.coordinates : null,
		highlighted: state.listings ? state.listings.highlighted : null
	}
}

export default connect(mapStateToProps, null)(Map)
