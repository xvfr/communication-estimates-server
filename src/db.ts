import knex from 'knex'

declare let process : {
	env : {
		DB_HOST : string,
		DB_PORT : number,
		DB_USER : string,
		DB_PASSWORD : string,
		DB_NAME : string
	}
}

const db = knex( {
	client : 'mysql',
	connection : {
		host : process.env.DB_HOST,
		port : process.env.DB_PORT || 3306,
		user : process.env.DB_USER,
		password : process.env.DB_PASSWORD,
		database : process.env.DB_NAME
	}
} )

export default db