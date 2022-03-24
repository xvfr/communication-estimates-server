import express from 'express'
import db from '../db'

const priceListRouter = express.Router()

priceListRouter.get( '/', async ( req, res, next ) => {

	const list = await db( 'price_list' )
		.select( 'price_id', 'title', 'price' )

	res.send( {
		items : list
	} )

} )

export default priceListRouter