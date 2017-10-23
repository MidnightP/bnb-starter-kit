import React, { Component } from 'react'
import ReactDropzone from 'react-dropzone'

import fileReader from '../lib/fileReader'

class Dropzone extends Component {

	constructor() {
		super()
		this.state = {
			files: [],
			readFiles: []
		}
	}

	// NOTE readAs can be 'readAsArrayBuffer', 'readAsBinaryString', 'readAsDataURL' or 'readAsText'
	onDrop(accepted, rejected) {
		if(rejected.length > 0) return console.error('Dropzone rejected:', rejected)

		const { multiple, input, readAs, maxSize } = this.props
		const { files, readFiles } = this.state
		const { onChange } = input

		const onProgress = (event) => {
			// NOTE e.g. do something with event.loaded
		}

		const readOptions = {
			readAs,
			onProgress,
			maxSize
		}

		const newFile = accepted[readFiles.length]

		fileReader(newFile, readOptions, (err, outPut) => {
			if(err && process.env.NODE_ENV !== 'production') console.error("ONERROR", err)

			const updatedReadFiles = [].concat(readFiles, outPut)

			this.setState({
				files: [].concat(files, accepted),
				readFiles: updatedReadFiles
			})

			console.log("ONCHANGE ONCHANGE");

			if(multiple) return onChange(updatedReadFiles)
			onChange(updatedReadFiles[0])
		})
	}

	emptyDropzone() {
		this.setState({
			files: [],
			readFiles: []
		})
		// this.props.input.onChange()
	}

	render() {
		const { files } = this.state
		const { input, multiple, maxSize } = this.props
		const { value } = input

		const dropZone =
			<ReactDropzone accept="image/jpeg, image/png"
				multiple={ multiple }
				onDrop={ this.onDrop.bind(this) }>
				<div>
					Click here or drop a file (maxSize: {`${maxSize}`}MB)...
				</div>
			</ReactDropzone>

		const droppedZone =
			<div>
				<button onClick={ this.emptyDropzone.bind(this) }>x Remove</button>
				{
					value ? files.map((file, i) =>

						<div key={ file.name + "-" + i }>
							<span>{ file.name }</span>
							<img className="dropzone-preview" alt={`${file.name} img unavailable`} src={file.preview} />
						</div>

					) : null
				}
			</div>

		return value ? droppedZone : dropZone
	}
}

export default Dropzone
