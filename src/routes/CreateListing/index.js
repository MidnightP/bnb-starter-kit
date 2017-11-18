import { injectReducer } from '../../store/reducers'

export default (store) => {

	const reducer = require('./reducer').default
	injectReducer(store, { key: 'createlisting', reducer })

	return require('./CreateListing').default
}
