import { injectReducer } from '../../store/reducers'

export default (store) => {

	const reducer = require('./reducer').default
	injectReducer(store, { key: 'singlelisting', reducer })

	return require('./SingleListing').default
}
