declare module Express {

	interface Request {

		token? : string,
		user_id? : number

	}

}