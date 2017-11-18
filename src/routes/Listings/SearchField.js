import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import Slider, { createSliderWithTooltip } from 'rc-slider'

import 'rc-slider/assets/index.css'

import { Dropdown } from '../../components'
import config from '../../config'

const { __radiusMax__ } = config

const SliderWithToolTip = createSliderWithTooltip(Slider)

const styles = {
	form: {
		marginTop: '2%',
		marginBottom: '2%'
	},
	field: {
		marginTop: '2%',
		marginBottom: '2%'
	},
	input: {
		width: '100%',
		height: '100%'
	}
}

class SearchField extends Component {
	constructor() {
		super()
		this.state = {
			zipcode: '',
			category: '',
			radius: __radiusMax__
		}
	}

	getListings(overrides) {
		this.props.onSubmit(Object.assign({}, this.state, overrides))
	}

	handleZipcode(e) {
		const { value } = e.target
		const { length } = value
		const overrides = { zipcode: value }
		if(length < this.state.zipcode.length) {
			if(!length) {
				this.setState(Object.assign({}, overrides, { radius: null }))
			} else {
				this.setState(overrides)
			}
		} else {
			if(length < 4) {
				this.setState(overrides)
			} else {
				this.getListings(overrides)
				this.setState(overrides)
			}
		}
	}

	handleSubmit(e) {
		e.preventDefault()
		this.getListings()
	}

	handleCategories(selected) {
		console.log('SELECTED', selected)
		const overrides = { category: selected }
		this.setState(overrides)
		this.getListings(overrides)
	}

	handleRadius(value) {
		this.getListings({ radius: value })
	}

	handleRadiusChange(value) {
		this.setState({ radius: value })
	}

	render() {
		const categories = [].concat(this.props.categories, [{ _id: null, name: 'All' }])

		return (
			<form style={styles.form} onSubmit={this.handleSubmit.bind(this)}>
				<Row>
					<Col xs={12} md={4} style={styles.field}>
						<Dropdown placeholder="Categorie"
							data={categories}
							valueField="_id"
							textField="name"
							onChange={this.handleCategories.bind(this)}/>
					</Col>
					<Col xs={12} md={4} style={styles.field}>
						<input placeholder="Postcode"
							style={styles.input}
							type="text"
							value={this.state.zipcode}
							onChange={this.handleZipcode.bind(this)}/>
					</Col>
					<Col xs={12} md={4} style={styles.field}>
						<label>Radius</label>
						<SliderWithToolTip min={0}
							max={__radiusMax__}
							step={2}
							value={this.state.radius}
							defaultValue={__radiusMax__}
							onChange={this.handleRadiusChange.bind(this)}
							onAfterChange={this.handleRadius.bind(this)} disabled={!this.state.zipcode}/>
					</Col>
				</Row>
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	categories: state.general.categories,
	loading: state.loading.active,
})

export default connect(mapStateToProps, null)(SearchField)
