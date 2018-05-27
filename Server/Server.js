// Setup basic express server
var http = require('http');
var app = http.createServer();
var io = require('socket.io').listen(app);
var db = require('./DB.js'); db();
var crypto = require('crypto');
var port = 8081;

// Session
var session = {}; //name of the user
session.isAuth = false; //authorized?

// Listening port
app.listen(port);
console.log('Server listens a port ' + port);

// Sockets
//define if there is any information
//writing the sockets
io.sockets.on('connection', function (socket) {
	//creating listener of authServer			
	socket.on('authServer', function (data) {
		
		console.log("LoginServer");
		salt = data['login'];
		var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
		hash.update(data['password']);
		var value = hash.digest('hex');
		console.log(value);
				
		db.prototype.isValid(data['login'], value, function(answ){
			//giving an answer to the client. This is the dictionary.
			//isValid actually is the answer. 
			socket.emit('authClient', { isValid: answ });
			console.log(answ);
			if (answ) {
				console.log("auth true");
				session.isAuth = true;
				session.login = data['login'];
			}
			console.log("auth end");
		});			
	});
	
	socket.on('exitServer', function () {
		// console.log("exit server");		
		if (session.isAuth)
			session.isAuth = false;
		if (session.login)
			session.login = null;
	});
	
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});

	socket.on('addUserServer', function (data) {
		salt = data['userName'];
		let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
		hash.update(data['password']);
		let valuePassord = hash.digest('hex');
		
		db.prototype.addNewUser(data['userName'], data['email'], valuePassord, function(id){
			session = id;
			session.isAuth = true;
			socket.emit('addUserClient', {});
		});			
	});
	
});

