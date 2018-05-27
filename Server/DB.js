var mysql = require("mysql");   

module.exports = Database;
var _pool; 

//constructor
function Database() {
	_pool = mysql.createPool({
        connectionLimit : 100,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sketch',
        debug: true
    });
}

Database.prototype.isValid = function(email, password, callback) {
    _pool.getConnection(function(err, connection){		
        	console.log("password: " + password);
			//checking existing if email and password
			connection.query("SELECT * FROM user WHERE email=? AND password=?", [email, password], function(err, rows, fields) {
			// ...
            connection.release();
            if (err) throw err;
			callback(rows[0]); // return
			}.bind(this));
    }.bind(this));
}

Database.prototype.addNewUser = function(userName, email, password, callback) {
    _pool.getConnection(function(err, connection){		
        	console.log(userName + " user");
            console.log(password + " db");
            let role = "user";
			connection.query("INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)", [userName, email, password, role], function(err, result) {
			// ...
            connection.release();
            if (err) throw err;
			callback(result.insertId);
			}.bind(this));			
    }.bind(this));
}