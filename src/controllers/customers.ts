import express from 'express'
import db from '../db'
import ApiError from '../errors/api'

const customersRouter = express.Router()

customersRouter.get( '/', async ( req, res ) => {

	const contractsCount = db( 'contracts_customers as cc' )
		.count( 'cc.contract_id' )
		.where( 'cc.customer_id', db.raw( '`c`.`customer_id`' ) )
		.as( 'contracts_count' )

	const customers = await db( 'customers as c' )
		.select( 'c.customer_id', 'c.name', contractsCount )

	res.send( { items : customers } )

} )

customersRouter.post( '/', async ( req, res, next ) => {

	const { name } = req.body

	if ( !name )
		return next( new ApiError( 400, 'Наименование - обязательный параметр' ) )

	if ( name.length > 75 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 75 символов' ) )

	const [ inserted_id ] = await db( 'customers' )
		.insert( {
			name
		} )

	res.send( {
		inserted_id
	} )

} )

customersRouter.put( '/:customer_id', async ( req, res, next ) => {

	const
		{ name } = req.body,
		customer_id = req.params.customer_id

	if ( !customer_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	if ( !name )
		return next( new ApiError( 400, 'Необходимо наименование элемента' ) )

	if ( name.length > 75 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 75 символов' ) )

	await db( 'customers' )
		.where( {
			customer_id
		} )
		.update({
			name
		})

	res.sendStatus( 204 )

} )

customersRouter.delete( '/:customer_id', async ( req, res, next ) => {

	const
		customer_id = Number( req.params.customer_id )

	if ( !customer_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	await db( 'customers' )
		.delete()
		.where( {
			customer_id
		} )

	res.sendStatus( 204 )

} )

export default customersRouter