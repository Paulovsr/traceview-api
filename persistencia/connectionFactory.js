var mysql  = require('mysql');

function createDBConnection(){
		return mysql.createConnection({
			host: 'us-cdbr-iron-east-01.cleardb.net',
			user: 'bd3826c3135d5b',
			password: '2c01fb8a',
			database: 'heroku_976b0daff2b760e'
		});
}

module.exports = function() {
	return createDBConnection;
}
