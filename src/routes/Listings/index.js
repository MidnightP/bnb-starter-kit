import { injectReducer } from '../../store/reducers'

export default (store) => {

	const reducer = require('./reducer').default
	injectReducer(store, { key: 'listings', reducer })

	return require('./Listings').default
}
