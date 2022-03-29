import express from 'express'
import db from '../db'
import ApiError from '../errors/api'

const contractorsRouter = express.Router()

contractorsRouter.get( '/', async ( req, res ) => {

	const contractsCount = db( 'contracts_contractors as cc' )
		.count( 'cc.contract_id' )
		.where( 'cc.contractor_id', db.raw( '`c`.`contractor_id`' ) )
		.as( 'contracts_count' )

	const contractors = await db( 'contractors as c' )
		.select( 'c.contractor_id', 'c.name', contractsCount )

	res.send( { items : contractors } )

} )

contractorsRouter.post( '/', async ( req, res, next ) => {

	const { name } = req.body

	if ( !name )
		return next( new ApiError( 400, 'Наименование - обязательный параметр' ) )

	if ( name.length > 75 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 75 символов' ) )

	const [ inserted_id ] = await db( 'contractors' )
		.insert( {
			name
		} )

	res.send( {
		inserted_id
	} )

} )

contractorsRouter.put( '/:contractor_id', async ( req, res, next ) => {

	const
		{ name } = req.body,
		contractor_id = req.params.contractor_id

	if ( !contractor_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	if ( !name )
		return next( new ApiError( 400, 'Необходимо наименование элемента' ) )

	if ( name.length > 75 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 75 символов' ) )

	await db( 'contractors' )
		.where( {
			contractor_id
		} )
		.update( {
			name
		} )

	res.sendStatus( 204 )

} )

contractorsRouter.delete( '/:contractor_id', async ( req, res, next ) => {

	const
		contractor_id = Number( req.params.contractor_id )

	if ( !contractor_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	await db( 'contractors' )
		.delete()
		.where( {
			contractor_id
		} )

	res.sendStatus( 204 )

} )


export default contractorsRouter