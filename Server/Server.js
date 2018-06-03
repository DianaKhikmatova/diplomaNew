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
		
		//console.log("LoginServer");
		salt = data['login'];
		var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
		hash.update(data['password']);
		var value = hash.digest('hex');
		//console.log(value);
				
		db.prototype.isValid(data['login'], value, function(answ){
			//giving an answer to the client. This is the dictionary.
			//isValid actually is the answer. 
			socket.emit('authClient', { isValid: answ, id: answ['id'] });
			// console.log(answ['id']);
			if (answ) {
				//console.log("auth true");
				session.isAuth = true;
				session.login = data['login'];
			}
		//	console.log("auth end");
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
		salt = data['email'];
		let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
		hash.update(data['password']);
		let valuePassord = hash.digest('hex');
		
		db.prototype.addNewUser(data['userName'], data['email'], valuePassord, function(id){
			session = id;
			session.isAuth = true;
			socket.emit('addUserClient', {});
		});			
	});

	socket.on('addImageServer', function (data) {
		console.log(data['libraryId'] + " server");
		db.prototype.addNewImage(data['imageName'], data['imageContent'], data['libraryId'], function(answer){
			socket.emit('addImageClient', { imageName: data['imageName'], imageContent: data['imageContent'], libraryId: data['libraryId'] });
		});			
	});

	socket.on('getImagesServer', function (data) {
		console.log(data['id']);
		db.prototype.getTableImage(data['id'], function(data, content) {
			content = '' + content;
			socket.emit('getImagesClient', data, content);
		});
	});

	socket.on('addLibraryServer', function (data) {
		db.prototype.addNewLibrary(data['libraryName'], data['libraryDescription'], function(answer){
			socket.emit('addLibraryClient', { imageName: data['imageName'], imageContent: data['imageContent'] });
		});			
	});

	socket.on('getLibraryServer', function (data) {
		db.prototype.getTableLibrary(function(data) {
			// console.log(data[0]['name'], data[0]['description']);
			socket.emit('getLibraryClient', data);
		});
	});

	socket.on('removeLibraryServer', function (data) {
		db.prototype.removeLibrary(data['id'], function(answer) {
			socket.emit('removeLibraryClient', data);
		});
	});

	socket.on('removeImageServer', function (data) {
		db.prototype.removeImage(data['id'], function(answer) {
			socket.emit('removeImageClient');
		});
	});

});

