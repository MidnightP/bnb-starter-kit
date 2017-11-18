import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { history } from '../../store/location'
import { setHighlightedListing } from '../../routes/Listings/reducer'

// TODO Don't use inline styling !
const styles = {
	marker: {
		width: '25px',
		height: '25px',
		background: `url(${window.location.origin}/icons/whatshot/web/ic_whatshot_black_24dp_1x.png)`
	}
}

class Marker extends PureComponent {

	componentWillReceiveProps(newProps) {
		const { _id, highlight, $hover } = newProps

		if($hover && !highlight) {
			this.props.setHighlightedListing(_id)
		}
		if(!$hover && highlight) {
			this.props.setHighlightedListing()
		}
	}

	renderPopUp() {
		const { description, link } = this.props
		return(
			<div onClick={ () => link ? history.push(link) : null }>
				{ description }
			</div>
		)
	}

	render() {
		const { $hover, highlight, /* lat, lng, */ coordinates } = this.props

		const highlighted = $hover || highlight
		return (
			<div onClick={() => this.props.panToMarker(coordinates)}>
				{ highlighted ? this.renderPopUp.call(this) : null }
				<div style={styles.marker}/>
			</div>
		)
	}
}

export default connect(null, { setHighlightedListing })(Marker)
