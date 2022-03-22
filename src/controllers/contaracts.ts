import express from 'express'
import db from '../db'

const contractsRouter = express.Router()

contractsRouter.get( '/', async ( req, res, next ) => {

	const
		limit = Number( req.query.limit ) || 100,
		offset = Number( req.query.offset ) || 0

	const items = await db( 'contracts' )
		.select( 'contract_id', 'name', 'created_date' )
		.limit( limit )
		.offset( offset )

	res.send( {
		items
	} )

} )

export default contractsRouter
