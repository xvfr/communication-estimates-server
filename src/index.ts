// modules

import express, { NextFunction, Request, Response } from 'express'
import 'dotenv/config'

// errors

import ApiError from './errors/api'

// routers

import userRouter from './controllers/user'

// app

const app = express()

app.use( express.json() )

// check token

app.use( '/api', ( req, res, next ) => {

	const token = String( req.query[ 'token' ] )

	if ( !token )
		return next( new ApiError( 400, 'Token required' ) )

	// TODO : check token in db

	req.token = token
	next()

} )

// TODO : use partial router system

app.use( '/user', userRouter )

// status api

app.get( '/api/status', ( req, res ) => {
	res.send( { status : 'available' } )
} )

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