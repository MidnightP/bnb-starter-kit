import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { setHighlightedListing } from '../../routes/Listings/reducer'

// TODO Don't use inline styling !
const styles = {
	cluster: {
		color: 'white',
		paddingLeft: '21px',
		paddingTop: '24px',
		fontWeigth: 'bold',
		fontSize: '1em',
		width: '50px',
		height: '50px',
		background: `url(${window.location.origin}/icons/whatshot/web/ic_whatshot_black_24dp_2x-black.png)`
	}
}

class Cluster extends PureComponent {

	// TODO 1) Make sure we have listingIds of cluster here
	//
	// copy strategy from Marker

	render() {
		const { /* $hover, highlighted, lat, lng,*/ numPoints, coordinates } = this.props
		return <div onClick={() => this.props.panToMarker(coordinates)} style={styles.cluster}>{numPoints}</div>
	}
}

const mapStateToProps = (state) => {
	return {
		// highlighted: state.listings.highlighted.reduce((prev, next) => this.props.listingIds.includes(prev) ? true : next)
	}
}

export default connect(mapStateToProps, { setHighlightedListing })(Cluster)
