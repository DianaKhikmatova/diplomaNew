function auth() {
	var socket = io.connect('http://localhost:8081');
	// console.log(document.getElementById("email").value);
	
	socket.emit('authServer', { login: document.getElementById("email").value, 
		password: document.getElementById("password").value });
	
	//creation a listener for the event authClient
	socket.on('authClient', function (data) {
		console.log(data['isValid']);
		if (data['isValid']) {
			//console.log(data['isValid']['id']);
			//console.log(data['isValid']['role']);
			// alert(data['id']);
			console.log("success");
			if (data['isValid']['role'] === "user") {
				document.location.href = "./schemas.html";
			} else {
				document.location.href = "./admin.html";
			}
		} else {
			console.log("fail");
			alert('Something is not correct');
		}
	});
}

function exit() {
	var socket = io.connect('http://localhost:8081');
	socket.emit('exitServer');
}

