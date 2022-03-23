import express from 'express'
import db from '../db'

const contractsRouter = express.Router()

contractsRouter.get( '/', async ( req, res, next ) => {

	const
		limit = Number( req.query.limit ) || 100,
		offset = Number( req.query.offset ) || 0

	// const items = await db( 'contracts' )
	// 	.select( 'contract_id', 'name', 'created_date' )
	// 	.limit( limit )
	// 	.offset( offset )

	const items = await db( 'contracts as c' )
		.select( 'c.contract_id', 'c.name', 'c.created_date', 'cu.name as customer_name', 'cu.customer_id as customer_id', 'co.name as contractor_name', 'co.contractor_id as contractor_id' )
		.leftJoin( 'contracts_customers as ccu', 'c.contract_id', 'ccu.contract_id' )
		.leftJoin( 'customers as cu', 'cu.customer_id', 'ccu.customer_id' )
		.leftJoin( 'contracts_contractors as cco', 'c.contract_id', 'cco.contract_id' )
		.leftJoin( 'contractors as co', 'co.contractor_id', 'cco.contractor_id' )
		.limit( limit )
		.offset( offset )

	interface Contractors {
		contractor_id : number,
		contractor_name : string
	}

	interface Customers {
		customer_id : number,
		customer_name : string
	}

	interface Contracts {
		contract_id : number,
		name : string,
		created_date : string,
		customers : Customers[]
		contractors : Contractors[]
	}

	let contracts : Contracts[] = []

	items.forEach( ( {
						 contract_id,
						 name,
						 created_date,
						 customer_id,
						 customer_name,
						 contractor_id,
						 contractor_name
					 } ) => {

		if ( !contracts.find( c => c.contract_id === contract_id ) )
			contracts.push( {
				contract_id,
				name,
				created_date,
				contractors : [],
				customers : []
			} )

		if ( customer_id ) {

			const index = contracts.findIndex( c => c.contract_id == contract_id )

			if ( index !== -1 && !contracts[ index ].customers.find( c => c.customer_id === customer_id ) )
				contracts[ index ].customers.push( {
					customer_id,
					customer_name
				} )

		}

		if ( contractor_id ) {

			const index = contracts.findIndex( c => c.contract_id == contract_id )

			if ( index !== -1 && !contracts[ index ].contractors.find( c => c.contractor_id === contractor_id ) )
				contracts[ index ].contractors.push( {
					contractor_id,
					contractor_name
				} )

		}

	} )

	res.send( {
		items : contracts
	} )

} )

export default contractsRouter
