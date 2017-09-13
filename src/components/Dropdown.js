import React from 'react'
import ReactDropdownList from 'react-widgets/lib/DropdownList'

// TODO Why doesnt onChange pick up our value using the valueField prop?
// If it doesn't use it, then what is the prop for?
const Dropdown = ({ input, data, valueField, textField, placeholder, onChange }) => {

	if(input) onChange = input.onChange

	return (
		<ReactDropdownList
			placeholder={placeholder}
			data={data}
			valueField={valueField}
			textField={textField}
			onChange={(selection) => onChange(selection[valueField])} />
	)
}

export default Dropdown
