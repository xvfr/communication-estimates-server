import express from 'express'
import db from '../db'
import ApiError from '../errors/api'

const equipmentsRouter = express.Router()

equipmentsRouter.get( '/', async ( req, res ) => {

	const equipments = await db( 'equipments' )
		.select('equipment_id', 'name')

	res.send( { items : equipments } )

} )

equipmentsRouter.post( '/', async ( req, res, next ) => {

	const { name } = req.body

	if ( !name )
		return next( new ApiError( 400, 'Наименование - обязательный параметр' ) )

	if ( name.length > 50 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 50 символов' ) )

	const [ inserted_id ] = await db( 'equipments' )
		.insert( {
			name
		} )

	res.send( {
		inserted_id
	} )

} )

equipmentsRouter.put( '/:equipment_id', async ( req, res, next ) => {

	const
		{ name } = req.body,
		equipment_id = req.params.equipment_id

	if ( !equipment_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	if ( !name )
		return next( new ApiError( 400, 'Необходимо наименование элемента' ) )

	if ( name.length > 50 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 50 символов' ) )

	await db( 'equipments' )
		.where( {
			equipment_id
		} )
		.update({
			name
		})

	res.sendStatus( 204 )

} )

equipmentsRouter.delete( '/:equipment_id', async ( req, res, next ) => {

	const
		equipment_id = Number( req.params.equipment_id )

	if ( !equipment_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	await db( 'equipments' )
		.delete()
		.where( {
			equipment_id
		} )

	res.sendStatus( 204 )

} )

export default equipmentsRouter