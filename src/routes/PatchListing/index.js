import { injectReducer } from '../../store/reducers'

export default (store) => {

	const reducer = require('./reducer').default
	injectReducer(store, { key: 'patchlisting', reducer })

	return require('./PatchListing').default
}
