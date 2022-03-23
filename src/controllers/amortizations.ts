import express from 'express'
import db from '../db'
import ApiError from '../errors/api'

const amortizationsRouter = express.Router()

amortizationsRouter.get( '/', async ( req, res, next ) => {

	const cars = await db( 'depreciation_calculations' )
		.select( 'depreciation_id', 'name', 'resource', 'purchase_price', 'capital_repair_cost', 'total_cost_current_repair', 'service_life', 'average_yearly_mileage', 'average_monthly_mileage', 'current_maintenance_cost', 'practical_cost', 'depreciation_price' )

	res.send( {
		items : cars
	} )

} )

amortizationsRouter.get( '/:depreciation_id', async ( req, res, next ) => {

	const depreciation_id = Number( req.params.depreciation_id )

	if ( !( depreciation_id ) || depreciation_id < 1 )
		return next( new ApiError( 400, 'Identificator must be positive number' ) )

	const car = await db( 'depreciation_calculations' )
		.first( 'depreciation_id', 'name', 'resource', 'purchase_price', 'capital_repair_cost', 'total_cost_current_repair', 'service_life', 'average_yearly_mileage', 'average_monthly_mileage', 'current_maintenance_cost', 'practical_cost', 'depreciation_price' )
		.where( 'depreciation_id', req.params.depreciation_id )

	if ( !car )
		return next( new ApiError( 404, 'Not found amortization' ) )

	res.send( {
		items : car
	} )

} )

export default amortizationsRouter