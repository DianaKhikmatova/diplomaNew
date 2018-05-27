function auth() {
	var socket = io.connect('http://localhost:8081');
	console.log(document.getElementById("email").value);
	
	socket.emit('authServer', { login: document.getElementById("email").value, 
		password: document.getElementById("password").value });
	
	//creation a listener for the event authClient
	socket.on('authClient', function (data) {
		if (data['isValid']) {
			console.log("success");
			document.location.href = "./schemas.html";
		} else {
			console.log("fail");
			//document.location.href = "./index.html";
		}
	});
}

function exit() {
	var socket = io.connect('http://localhost:8081');
	socket.emit('exitServer');
}

