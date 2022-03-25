import express from 'express'
import db from '../db'
import ApiError from '../errors/api'

const priceListRouter = express.Router()

priceListRouter.get( '/', async ( req, res, next ) => {

	const list = await db( 'price_list' )
		.select( 'price_id', 'title', 'price' )

	res.send( {
		items : list
	} )

} )

priceListRouter.post( '/', async ( req, res, next ) => {

	const { price, title } = req.body

	if ( !title )
		return next( new ApiError( 400, 'Наименование - обязательный параметр' ) )

	if ( title.length > 255 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 255 символов' ) )

	const [ inserted_id ] = await db( 'price_list' )
		.insert( {
			price : !isNaN( Number( price ) ) && price >= 0 ? price : null,
			title
		} )

	res.send( {
		inserted_id : inserted_id
	} )

} )

priceListRouter.put( '/:price_id', async ( req, res, next ) => {

	const
		{ price, title } = req.body,
		price_id = req.params.price_id

	if ( !price_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	if ( title && title.length > 255 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 255 символов' ) )

	const query = db( 'price_list' )
		.where( {
			price_id
		} )

	if ( price && !isNaN( Number( price ) ) && price >= 0 )
		query.update( 'price', price )

	if ( title )
		query.update( 'title', title )

	await query

	res.sendStatus( 204 )

} )

priceListRouter.delete( '/:price_id', async ( req, res, next ) => {

	const
		price_id = Number( req.params.price_id )

	if ( !price_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	await db( 'price_list' )
		.delete()
		.where( {
			price_id
		} )

	res.sendStatus( 204 )

} )

export default priceListRouter