import React from 'react'
import ReactMulti from 'react-widgets/lib/Multiselect'

const MultiSelect = ({ input, data, valueField, textField }) =>
	<ReactMulti {...input}
		onBlur={() => input.onBlur()}
		value={input.value || []} // requires value to be an array
		data={data}
		valueField={valueField}
		textField={textField}/>

export default MultiSelect
