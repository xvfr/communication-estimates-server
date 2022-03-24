import express from 'express'
import db from '../db'

const contractorsRouter = express.Router()

contractorsRouter.get( '/', async ( req, res, next ) => {

	const contractsCount = db( 'contracts_contractors as cc' )
		.count( 'cc.contract_id' )
		.where( 'cc.contractor_id', db.raw( '`c`.`contractor_id`' ) )
		.as( 'contracts_count' )

	const customers = await db( 'contractors as c' )
		.select( 'c.contractor_id', 'c.name', contractsCount )

	res.send( { items : customers } )

} )

// customersRouter.get( '/:customer_id', async ( req, res, next ) => {
//
//
//
// 	res.send()
//
// } )

export default contractorsRouter