import express from 'express'
import db from '../db'
import ApiError from '../errors/api'

const expenditureItemsRouter = express.Router()

expenditureItemsRouter.get( '/', async ( req, res ) => {

	const expenditure_items = await db( 'expenditure_items' )
		.select( 'expenditure_item_id', 'name', 'measurement_unit', 'price' )

	res.send( { items : expenditure_items } )

} )

expenditureItemsRouter.post( '/', async ( req, res, next ) => {

	const { name, measurement_unit, price } = req.body

	if ( !name )
		return next( new ApiError( 400, 'Наименование - обязательный параметр' ) )

	if ( !measurement_unit )
		return next( new ApiError( 400, 'Единицы измерения - обязательный параметр' ) )

	if ( !price || isNaN( Number( price ) ) )
		return next( new ApiError( 400, 'Стоимость - обязательный параметр' ) )

	if ( name.length > 50 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 50 символов' ) )

	if ( measurement_unit.length > 50 )
		return next( new ApiError( 400, 'Единицы измерения не могут быть длиннее 25 символов' ) )

	if ( price < 0 )
		return next( new ApiError( 400, 'Стоимость не может быть отрицательной' ) )

	const [ inserted_id ] = await db( 'expenditure_items' )
		.insert( {
			name,
			measurement_unit,
			price
		} )

	res.send( {
		inserted_id
	} )

} )

expenditureItemsRouter.put( '/:expenditure_item_id', async ( req, res, next ) => {

	const
		{ name, measurement_unit, price } = req.body,
		expenditure_item_id = req.params.expenditure_item_id

	if ( !expenditure_item_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	if ( !name && !measurement_unit && !price )
		return next( new ApiError( 400, 'Необходимо наименование, единицы измерения или стоимость!' ) )

	if ( name && name.length > 50 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 50 символов' ) )

	if ( measurement_unit && measurement_unit.length > 50 )
		return next( new ApiError( 400, 'Единицы измерения не могут быть длиннее 25 символов' ) )

	if ( price && price < 0 )
		return next( new ApiError( 400, 'Стоимость не может быть отрицательной' ) )

	const query = db( 'expenditure_items' )
		.where( {
			expenditure_item_id
		} )

	if ( name )
		query.update( 'name', name )

	if ( measurement_unit )
		query.update( 'measurement_unit', measurement_unit )

	if ( price )
		query.update( 'price', price )

	await query

	res.sendStatus( 204 )

} )

expenditureItemsRouter.delete( '/:expenditure_item_id', async ( req, res, next ) => {

	const
		expenditure_item_id = Number( req.params.expenditure_item_id )

	if ( !expenditure_item_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	await db( 'expenditure_items' )
		.delete()
		.where( { expenditure_item_id } )

	res.sendStatus( 204 )

} )

export default expenditureItemsRouter