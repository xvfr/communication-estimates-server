// modules

import express, { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'

// imports

import db from './db'

// errors

import ApiError from './errors/api'

// routers

import userRouter from './controllers/user'
import contractsRouter from './controllers/contaracts'
import amortizationsRouter from './controllers/amortizations'
import customersRouter from './controllers/customers'
import contractorsRouter from './controllers/contractors'

// app

const app = express()

app.use( express.json() )

// temporary

app.use( cors() )

// check token

app.use( '/api/user', userRouter )

// token must be passed

app.use( '/api', async ( req, res, next ) => {

	const token = req.headers.authorization

	if ( !token )
		return next( new ApiError( 400, 'Token must be passed' ) )

	const user = await db( 'tokens' )
		.first( 'user_id' )
		.where( {
			token
		} )

	if ( !user )
		return next( new ApiError( 403, 'Invalid token' ) )

	req.token = token
	req.user_id = user.user_id
	next()

} )

// status api

app.get( '/api/status', ( req, res ) => {
	res.send( { status : 'available', user_id : req.user_id } )
} )

// routes

app.use( '/api/contracts', contractsRouter )
app.use( '/api/amortizations', amortizationsRouter )
app.use( '/api/customers', customersRouter )
app.use( '/api/contractors', contractorsRouter )

// errors middleware

//noinspection JSUnusedLocalSymbols
app.use( ( err : ApiError, req : Request, res : Response, next : NextFunction ) => {
	res.status( err.status || 500 )
	res.send( { error : err.message } )
} )

app.use( ( req, res ) => {
	res.status( 404 )
	res.send( { error : 'Not found' } )
} )

// start server

app.listen( process.env.PORT )