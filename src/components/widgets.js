import React from 'react'
import ReactMulti from 'react-widgets/lib/Multiselect'
import ReactDropdownList from 'react-widgets/lib/DropdownList'
import ReactDropzone from 'react-dropzone'

import 'react-widgets/dist/css/react-widgets.css'

export const MultiSelect = ({ input, data, valueField, textField }) =>
	<ReactMulti {...input}
		onBlur={() => input.onBlur()}
		value={input.value || []} // requires value to be an array
		data={data}
		valueField={valueField}
		textField={textField}/>

export const Dropdown = ({ input, data, valueField, textField, placeholder }) => {
	console.log('DATA', data)
	console.log('INPUT', input)
	console.log('TEXTFIELD', textField)
	console.log('VALUEFIELD', valueField)
	return (
		<ReactDropdownList {...input}
			placeholder={placeholder}
			data={data}
			valueField={valueField}
			textField={textField}
			// TODO Why doesnt onChange pick up our value using the valueField prop?
			onChange={(selection) => input.onChange(selection[valueField])} />
	)
}

export const Dropzone = (props) => {

	const { onChange, value } = props.input

	const onDrop = (accepted, rejected) => {
		if(rejected.length > 0) return console.error('Dropzone rejected:', rejected)
		const files = accepted.map(a => ({
			preview: a.preview,
			name: a.name,
			type: a.type,
			size: a.size
		}))
		onChange(files)
	}

	const dropZone =
		<ReactDropzone { ...props.input }
			accept="image/jpeg, image/png"
			multiple={false}
			onDrop={ onDrop }>
			<div>
				Click here or drop a file...
			</div>
		</ReactDropzone>

	const droppedZone =
		<div>
			<button onClick={ onChange }>x Remove</button>
			{
				value ? Object.keys(value).map(i =>
					<div key={value[i].name + "-" + i}>
						<span>{ value[i].name }</span>
						<img alt={value[i].name} className="dropzone-preview" src={value[i].preview} />
					</div>
				) : null
			}
		</div>

	return value ? droppedZone: dropZone
}
