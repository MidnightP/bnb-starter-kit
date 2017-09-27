const fileReader = (file, readOptions, done) => {

	const { readAs, onProgress } = readOptions

	const fileReader = new FileReader()

	fileReader.onerror = event => {
		done(event)
	}

	fileReader.onprogress = event => {
		console.info('use this to measure and display progress', event.loaded)
		if(onProgress) onProgress(event)
	}

	fileReader.onloadend = event => {
		console.info('use this to measure total bytes received', event.total)
		done(event.target.result)
	}

	fileReader[readAs](file)
}

export default fileReader
