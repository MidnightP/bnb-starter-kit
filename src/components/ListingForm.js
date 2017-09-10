import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import { Dropdown, MultiSelect } from './'
import config from '../config'
import text from '../text'

class ListingForm extends Component {
	constructor() {
		super()
		this.state = {
			disabled: true,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.validate(nextProps)
	}

	validate(props) {
		let disabled = true
		let descriptionCheck = false

		const { price, description, categories, error } = props

		if(description)
			if(description.length > config.listing.description.minLength) descriptionCheck = true

		if(!error && descriptionCheck && price && categories) disabled = false

		this.setState({ disabled })
	}

	render() {

		const { error } = this.props

		return (
			<form onSubmit={this.props.onSubmit}>
				<div>
					<label htmlFor="price">{ text.alias.price } *</label>
					<Field id="price"
						name="price"
						component="input"
						type="number"
						min="12"
						max="30"/>
				</div>
				<div>
					<label htmlFor="description">{ text.alias.description } *</label>
					<Field id="description"
						name="description"
						component="input"
						type="text"
						maxLength="150"/>
				</div>
				<div>
					<label htmlFor="zipcode">{ text.alias.zipcode } *</label>
					<Field id="zipcode"
						name="zipcode"
						component="input"
						type="text"
						maxLength="6"/>
				</div>
				<div>
					<label htmlFor="categories">{ text.alias.categories } *</label>
					<Field id="categories"
						name="categories"
						valueField="_id"
						textField="text"
						component={MultiSelect}
						data={this.props.categoriesList}/>
				</div>
				<div>
					<label htmlFor="location">{ text.alias.location }</label>
					<Field id="location"
						name="location"
						valueField="_id"
						textField="text"
						component={Dropdown}
						data={this.props.locationsList}/>
				</div>
				<button disabled={this.state.disabled} type="submit">Opslaan</button>
				{
					error ?
						<div className="error">{ error.message }</div>
					: null
				}
			</form>
		)
	}
}

ListingForm = reduxForm({ form: 'listing' })(ListingForm)

const selector = formValueSelector('listing')

const mapStateToProps = (state) => {
	const { zipcode, price, description, categories } = selector(state, 'zipcode', 'price', 'description', 'categories')
	return {
		error: state.error,
		zipcode,
		price,
		description,
		categories
	}
}

export default connect(mapStateToProps, null)(ListingForm)
