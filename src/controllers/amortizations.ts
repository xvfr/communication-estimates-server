import express from 'express'
import db from '../db'
import ApiError from '../errors/api'
import contractorsRouter from './contractors'

const amortizationsRouter = express.Router()

amortizationsRouter.get( '/', async ( req, res, next ) => {

	const cars = await db( 'depreciation_calculations' )
		.select( 'depreciation_id', 'name', 'resource', 'purchase_price', 'capital_repair_cost', 'total_cost_current_repair', 'service_life', 'average_yearly_mileage', 'average_monthly_mileage', 'current_maintenance_cost', 'practical_cost', 'depreciation_price' )

	res.send( {
		items : cars
	} )

} )

// amortizationsRouter.get( '/:depreciation_id', async ( req, res, next ) => {
//
// 	const depreciation_id = Number( req.params.depreciation_id )
//
// 	if ( !( depreciation_id ) || depreciation_id < 1 )
// 		return next( new ApiError( 400, 'Identificator must be positive number' ) )
//
// 	const car = await db( 'depreciation_calculations' )
// 		.first( 'depreciation_id', 'name', 'resource', 'purchase_price', 'capital_repair_cost', 'total_cost_current_repair', 'service_life', 'average_yearly_mileage', 'average_monthly_mileage', 'current_maintenance_cost', 'practical_cost', 'depreciation_price' )
// 		.where( 'depreciation_id', req.params.depreciation_id )
//
// 	if ( !car )
// 		return next( new ApiError( 404, 'Not found amortization' ) )
//
// 	res.send( {
// 		items : car
// 	} )
//
// } )


amortizationsRouter.post( '/', async ( req, res, next ) => {

	const {
		name,
		resource,
		purchase_price,
		capital_repair_cost,
		total_cost_current_repair,
		service_life,
		average_yearly_mileage,
		average_monthly_mileage,
		current_maintenance_cost,
		practical_cost,
		depreciation_price
	} = req.body

	if ( !name )
		return next( new ApiError( 400, 'Наименование - обязательный параметр' ) )

	if ( name.length > 50 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 50 символов' ) )

	if ( !resource )
		return next( new ApiError( 400, 'Ресурс пробега - обязательный параметр' ) )

	if ( isNaN( Number( resource ) ) || resource <= 0 )
		return next( new ApiError( 400, 'Ресурс пробега может быть только положительным числом' ) )

	if ( !purchase_price )
		return next( new ApiError( 400, 'Стоимость покупки - обязательный параметр' ) )

	if ( isNaN( Number( purchase_price ) ) || purchase_price <= 0 )
		return next( new ApiError( 400, 'Стоимость покупки может быть только положительным числом' ) )

	if ( !capital_repair_cost )
		return next( new ApiError( 400, 'Стоимость кап. ремонта - обязательный параметр' ) )

	if ( isNaN( Number( capital_repair_cost ) ) || capital_repair_cost < 0 )
		return next( new ApiError( 400, 'Стоимость кап. ремонта может быть только положительным числом или равно нулю' ) )

	if ( !total_cost_current_repair )
		return next( new ApiError( 400, 'Суммарная стоимость текущего ремонта - обязательный параметр' ) )

	if ( isNaN( Number( total_cost_current_repair ) ) || total_cost_current_repair < 0 )
		return next( new ApiError( 400, 'Суммарная стоимость текущего ремонта может быть только положительным числом или равно нулю' ) )

	if ( !service_life )
		return next( new ApiError( 400, 'Срок эксплуатации - обязательный параметр' ) )

	if ( isNaN( Number( service_life ) ) || service_life <= 0 )
		return next( new ApiError( 400, 'Срок эксплуатации может быть только положительным числом' ) )

	if ( !average_yearly_mileage )
		return next( new ApiError( 400, 'Среднегодовой пробег - обязательный параметр' ) )

	if ( isNaN( Number( average_yearly_mileage ) ) || average_yearly_mileage < 0 )
		return next( new ApiError( 400, 'Среднегодовой пробег может быть только положительным числом или равно нулю' ) )

	if ( !average_monthly_mileage )
		return next( new ApiError( 400, 'Среднемесячный пробег - обязательный параметр' ) )

	if ( isNaN( Number( average_monthly_mileage ) ) || average_monthly_mileage < 0 )
		return next( new ApiError( 400, 'Среднемесячный пробег может быть только положительным числом или равно нулю' ) )

	if ( !current_maintenance_cost )
		return next( new ApiError( 400, 'Стоимость текущего ремонта и ТО - обязательный параметр' ) )

	if ( isNaN( Number( current_maintenance_cost ) ) || current_maintenance_cost < 0 )
		return next( new ApiError( 400, 'Стоимость текущего ремонта и ТО может быть только положительным числом или равно нулю' ) )

	if ( !practical_cost )
		return next( new ApiError( 400, 'Практическая стоимость - обязательный параметр' ) )

	if ( isNaN( Number( practical_cost ) ) || practical_cost < 0 )
		return next( new ApiError( 400, 'Практическая стоимость может быть только положительным числом или равно нулю' ) )

	if ( !depreciation_price )
		return next( new ApiError( 400, 'Амортизация - обязательный параметр' ) )

	if ( isNaN( Number( depreciation_price ) ) )
		return next( new ApiError( 400, 'Амортизация может быть только числом' ) )

	try {

		const [ inserted_id ] = await db( 'depreciation_calculations' )
			.insert( {
				name,
				resource,
				purchase_price,
				capital_repair_cost,
				total_cost_current_repair,
				service_life,
				average_yearly_mileage,
				average_monthly_mileage,
				current_maintenance_cost,
				practical_cost,
				depreciation_price
			} )

		res.send( {
			inserted_id
		} )

	} catch {
		return next( new ApiError( 400, 'Произошла ошибка при занесении данных в базу, перепроверьте введенные данные и попробуйте снова' ) )
	}

} )

amortizationsRouter.put( '/:depreciation_id', async ( req, res, next ) => {

	const {
			name,
			resource,
			purchase_price,
			capital_repair_cost,
			total_cost_current_repair,
			service_life,
			average_yearly_mileage,
			average_monthly_mileage,
			current_maintenance_cost,
			practical_cost,
			depreciation_price
		} = req.body,
		depreciation_id = req.params.depreciation_id

	if ( !depreciation_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	const query = db( 'depreciation_calculations' )
		.where( {
			depreciation_id
		} )

	if ( name && name.length > 50 )
		return next( new ApiError( 400, 'Наименование не может быть длиннее 50 символов' ) )

	if ( resource && ( isNaN( Number( resource ) ) || resource <= 0 ) )
		return next( new ApiError( 400, 'Ресурс пробега может быть только положительным числом' ) )

	if ( purchase_price && ( isNaN( Number( purchase_price ) ) || purchase_price <= 0 ) )
		return next( new ApiError( 400, 'Стоимость покупки может быть только положительным числом' ) )

	if ( capital_repair_cost && ( isNaN( Number( capital_repair_cost ) ) || capital_repair_cost < 0 ) )
		return next( new ApiError( 400, 'Стоимость кап. ремонта может быть только положительным числом или равно нулю' ) )

	if ( total_cost_current_repair && ( isNaN( Number( total_cost_current_repair ) ) || total_cost_current_repair < 0 ) )
		return next( new ApiError( 400, 'Суммарная стоимость текущего ремонта может быть только положительным числом или равно нулю' ) )

	if ( service_life && ( isNaN( Number( service_life ) ) || service_life <= 0 ) )
		return next( new ApiError( 400, 'Срок эксплуатации может быть только положительным числом' ) )

	if ( average_yearly_mileage && ( isNaN( Number( average_yearly_mileage ) ) || average_yearly_mileage < 0 ) )
		return next( new ApiError( 400, 'Среднегодовой пробег может быть только положительным числом или равно нулю' ) )

	if ( average_monthly_mileage && ( isNaN( Number( average_monthly_mileage ) ) || average_monthly_mileage < 0 ) )
		return next( new ApiError( 400, 'Среднемесячный пробег может быть только положительным числом или равно нулю' ) )

	if ( current_maintenance_cost && ( isNaN( Number( current_maintenance_cost ) ) || current_maintenance_cost < 0 ) )
		return next( new ApiError( 400, 'Стоимость текущего ремонта и ТО может быть только положительным числом или равно нулю' ) )

	if ( practical_cost && ( isNaN( Number( practical_cost ) ) || practical_cost < 0 ) )
		return next( new ApiError( 400, 'Практическая стоимость может быть только положительным числом или равно нулю' ) )

	if ( depreciation_price && ( isNaN( Number( depreciation_price ) ) ) )
		return next( new ApiError( 400, 'Амортизация может быть только числом' ) )

	if ( name )
		query.update( 'name', name )

	if ( resource )
		query.update( 'resource', resource )

	if ( purchase_price )
		query.update( 'purchase_price', purchase_price )

	if ( capital_repair_cost )
		query.update( 'capital_repair_cost', capital_repair_cost )

	if ( total_cost_current_repair )
		query.update( 'total_cost_current_repair', total_cost_current_repair )

	if ( service_life )
		query.update( 'service_life', service_life )

	if ( average_yearly_mileage )
		query.update( 'average_yearly_mileage', average_yearly_mileage )

	if ( average_monthly_mileage )
		query.update( 'average_monthly_mileage', average_monthly_mileage )

	if ( current_maintenance_cost )
		query.update( 'current_maintenance_cost', current_maintenance_cost )

	if ( practical_cost )
		query.update( 'practical_cost', practical_cost )

	if ( depreciation_price )
		query.update( 'depreciation_price', depreciation_price )

	try {
		await query
	} catch ( e ) {
		console.log( e )
		return next( new ApiError( 400, 'Произошла ошибка при занесении данных в базу, перепроверьте введенные данные и попробуйте снова' ) )
	}

	res.sendStatus( 204 )

} )

amortizationsRouter.delete( '/:depreciation_id', async ( req, res, next ) => {

	const
		depreciation_id = Number( req.params.depreciation_id )

	if ( !depreciation_id )
		return next( new ApiError( 400, 'Необходим идентификатор элемента' ) )

	await db( 'depreciation_calculations' )
		.delete()
		.where( {
			depreciation_id
		} )

	res.sendStatus( 204 )

} )

export default amortizationsRouter