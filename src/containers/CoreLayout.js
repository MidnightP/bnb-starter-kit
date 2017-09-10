import React, { Component } from 'react'

import NavBar from '../components/NavBar'

class CoreLayout extends Component {

	render() {
		return (
			<div>
				<NavBar />
				<div className="app-container">
					{ this.props.children }
				</div>
			</div>
		)
	}
}

export default CoreLayout
