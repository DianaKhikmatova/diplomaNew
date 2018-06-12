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
        debug: false
    });
}

Database.prototype.isValid = function(email, password, callback) {
    _pool.getConnection(function(err, connection){		
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
            let role = "user";
			connection.query("INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)", [userName, email, password, role], function(err, result) {
			// ...
            connection.release();
            if (err) throw err;
            callback(result.insertId);
            this.addNewUserLibrary(result.insertId);
			}.bind(this));			
    }.bind(this));
}

Database.prototype.addNewImage = function(imageName, imageContent, libraryId, callback) {
    _pool.getConnection(function(err, connection){		
			connection.query("INSERT INTO image (name, content, library_id) VALUES (?, ?, ?)", [imageName, imageContent, libraryId], function(err, result) {
                connection.release();
                if (err) throw err;
                callback(result.insertId);
			}.bind(this));			
    }.bind(this));
}

Database.prototype.addNewFunction = function(functionName, functionContent, libraryId, callback) {
    _pool.getConnection(function(err, connection){		
			connection.query("INSERT INTO function (name, content, library_id) VALUES (?, ?, ?)", [functionName, functionContent, libraryId], function(err, result) {
                connection.release();
                if (err) throw err;
                callback(result.insertId);
			}.bind(this));			
    }.bind(this));
}

Database.prototype.addNewFile = function(fileName, fileContent, userId, callback) {
    _pool.getConnection(function(err, connection){		
			connection.query("INSERT INTO file (name, content, id_user) VALUES (?, ?, ?)", [fileName, fileContent, userId], function(err, result) {
                connection.release();
                if (err) throw err;
                callback(result.insertId);
			}.bind(this));			
    }.bind(this));
}

Database.prototype.getTableImage = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"SELECT * FROM image WHERE library_id=?", [id], function(err, rows, fields) {
            connection.release();
            if (err) throw err;
            if (rows.length === 0) {
                callback(rows, '');
            } else {
                callback(rows, rows[0]['content']);
            }
        }.bind(this));
    }.bind(this));
}

Database.prototype.getUserLibrary = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"SELECT id FROM library WHERE id_user=?", [id], function(err, rows, fields) {
            connection.release();
            if (err) throw err;
            callback(rows);
        }.bind(this));
    }.bind(this));
}

Database.prototype.getTableFunction = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"SELECT * FROM function WHERE library_id=?", [id], function(err, rows, fields) {
            connection.release();
            if (err) throw err;
            if (rows.length === 0) {
                callback(rows, '');
            } else {
                callback(rows);
            }
        }.bind(this));
    }.bind(this));
}

Database.prototype.getTableFile = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"SELECT * FROM file WHERE id_user=?", [id], function(err, rows, fields) {
            connection.release();
            if (err) throw err;
            callback(rows);
        }.bind(this));
    }.bind(this));
}

Database.prototype.addNewLibrary = function(libraryName, descriptionName, callback) {
    _pool.getConnection(function(err, connection){		
			connection.query("INSERT INTO library (name, description) VALUES (?, ?)", [libraryName, descriptionName], function(err, result) {
                connection.release();
                if (err) throw err;
                callback(result.insertId);
			}.bind(this));			
    }.bind(this));
}

Database.prototype.addNewUserLibrary = function(user, callback) {
    _pool.getConnection(function(err, connection){		
            let libraryName = 'library';
            let descriptionName = 'user library';
			connection.query("INSERT INTO library (name, description, id_user) VALUES (?, ?, ?)", [libraryName, descriptionName, user], function(err, result) {
                connection.release();
                if (err) throw err;
                callback(result.insertId);
			}.bind(this));			
    }.bind(this));
}

Database.prototype.getTableLibrary = function(callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"SELECT * FROM library", function(err, rows, fields) {
            connection.release();
            if (err) throw err;
			callback(rows);
        }.bind(this));
    }.bind(this));
}

Database.prototype.getLibraries = function(callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"SELECT * FROM library", function(err, rows, fields) {
            connection.release();
            if (err) throw err;
			callback(rows);
        }.bind(this));
    }.bind(this));
}

Database.prototype.removeLibrary = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"DELETE FROM library WHERE id=?", id, function(err, rows, fields) {
            connection.release();
            if (err) throw err;
			callback(rows);
        }.bind(this));
    }.bind(this));
}

Database.prototype.removeImage = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"DELETE FROM image WHERE id=?", id, function(err, rows, fields) {
            connection.release();
            if (err) throw err;
			callback(rows);
        }.bind(this));
    }.bind(this));
}

Database.prototype.removeFunction = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"DELETE FROM function WHERE id=?", id, function(err, rows, fields) {
            connection.release();
            if (err) throw err;
			callback(rows);
        }.bind(this));
    }.bind(this));
}

Database.prototype.removeFile = function(id, callback) {
    _pool.getConnection(function(err, connection){		
        connection.query(
			"DELETE FROM file WHERE id=?", id, function(err, rows, fields) {
            connection.release();
            if (err) throw err;
			callback(rows);
        }.bind(this));
    }.bind(this));
}