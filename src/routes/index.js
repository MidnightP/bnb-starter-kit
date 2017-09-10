import React from 'react'
import { Route } from 'react-router-dom'

import SignIn from './SignIn'
import SignUp from './SignUp'
import Listings from './Listings'
import SingleListing from './SingleListing'
import PatchListing from './PatchListing'
import CreateListing from './CreateListing'

export default (store) => (
	<div>
		<Route exact path='/' component={ Listings(store) } />

		<Route path='/signin' component={ SignIn(store) } />
		<Route path='/signup' component={ SignUp(store) } />

		<Route path='/listings/:_id'        component={ SingleListing(store) } />
		<Route path='/listings/:_id/update' component={ PatchListing(store) } />
		<Route path='/listings/create'      component={ CreateListing(store) } />
	</div>
)
