import React from 'react'
import ReactDropzone from 'react-dropzone'

const Dropzone = (props) => {

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

	console.log('...PROPS.INPUT', ...props.input)
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

export default Dropzone
