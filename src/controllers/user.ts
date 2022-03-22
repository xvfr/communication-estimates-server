import express from 'express'
import { randomBytes } from 'crypto'

import db from '../db'
import ApiError from '../errors/api'

const userRouter = express.Router()

userRouter.post( '/auth', async ( req, res, next ) => {

	if ( !req.body.username )
		return next( new ApiError( 400, 'Username must be passed' ) )

	if ( !req.body.password )
		return next( new ApiError( 400, 'Password must be passed' ) )

	const { username, password } = req.body

	const user = await db( 'users' )
		.first( 'user_id' )
		.where( {
			username,
			password
		} )

	if ( !user )
		return next( new ApiError( 401, 'Invalid username or password' ) )

	const token = randomBytes( 120 ).toString( 'hex' )

	res.send( { token, user_id : user.user_id } )

} )

export default userRouter