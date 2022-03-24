import express from 'express'
import db from '../db'

const customersRouter = express.Router()

customersRouter.get( '/', async ( req, res, next ) => {

	const contractsCount = db( 'contracts_customers as cc' )
		.count( 'cc.contract_id' )
		.where( 'cc.customer_id', db.raw( '`c`.`customer_id`' ) )
		.as( 'contracts_count' )

	const customers = await db( 'customers as c' )
		.select( 'c.customer_id', 'c.name', contractsCount )

	res.send( { items : customers } )

} )

// customersRouter.get( '/:customer_id', async ( req, res, next ) => {
//
//
//
// 	res.send()
//
// } )

export default customersRouter