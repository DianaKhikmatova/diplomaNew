function addIllness() {
	var socket = io.connect('http://localhost:8080');
//	console.log(document.getElementById("illnessName").value + " client");
	//illness-name will be a parameter on the server
	socket.emit('addIllnessServer', { illnessName: document.getElementById("illnessName").value});
	
	socket.on('addIllnessClient', function() {
		alert("Added");
	});
}

function addImage() {
	var socket = io.connect('http://localhost:8081');
	let fr = "";    
	let fileName = "";       
	if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}   
	let input = document.getElementById('fileinput');
	if (!input) {
		alert("Um, couldn't find the fileinput element.");
	} else if (!input.files) {
		alert("This browser doesn't seem to support the `files` property of file inputs.");
	} else if (!input.files[0]) {
		alert("Please select a file before clicking 'Load'");               
	} else {
		let file = input.files[0];
		fr = new FileReader();
		fr.onload = receivedText;
		fr.readAsDataURL(file);
		fileName = input.value.replace(/.*[\/\\]/, '');
	}
	function receivedText() {
		  let source = fr.result;
		  socket.emit('addImageServer', { imageName: fileName, imageContent: source});
	}
	socket.on('addImageClient', function(data) {
		var image = document.createElement('img');
		var name = document.createElement('span');
		name.innerHTML = data['imageName'];    
		image.src = data['imageContent'];				
		image.width=100;
		image.height=100;
		image.alt="here should be some image";
		document.getElementById('image-container').appendChild(image);
		document.getElementById('image-container').appendChild(name);
	});
}

function addUser() {
	var socket = io.connect('http://localhost:8081');
	socket.emit('addUserServer', { userName: document.getElementById("user-name").value, password: document.getElementById("user-password").value, 
	email: document.getElementById("user-email").value});
	
	socket.on('addUserClient', function() {
		alert("You were register successful!");
		//document.location.href = "./main_spreader.html";
	});
}

function showImages() {
	var socket = io.connect('http://localhost:8081');
	socket.emit('getImagesServer', 'image');		
	socket.on('getImagesClient', function (data, content) {
		let images = data;
		var tbody = document.getElementById('images-table').getElementsByTagName("tbody")[0];
		for (let i = 0; i < images.length; i++) {
			// console.log(images[i]['id'], images[i]['name'], images[i]['content'], images['library']);
			let row = document.createElement('tr');
			row.id = images[i]['id'];
			let tdId = document.createElement('td');
			tdId.innerHTML = '' + images[i]['id'];
			let tdName = document.createElement('td');
			tdName.innerHTML = images[i]['name'];
			let tdContent = document.createElement('td');
			let image = document.createElement('img');
			image.src = content;
			image.width=100;
			image.height=100;
			image.alt="here should be some image";
			tdContent.appendChild(image);
			let tdLibrary = document.createElement('td');
			tdLibrary.innerHTML = images[i]['library'];
			let tdDelete = document.createElement('td');
			tdDelete.innerHTML = "delete";

			//console.log(tdContent.childNodes[0]);

			row.appendChild(tdId);
			row.appendChild(tdName);
			row.appendChild(tdContent);
			row.appendChild(tdLibrary);
			row.appendChild(tdDelete);

			tbody.appendChild(row);
			// let id = illnesses[i]['id']; name = illnesses[i]['name'];
			// addRow(id, name, i);
		}		
	});
}

function addPreparation() {
	var socket = io.connect('http://localhost:8080');
	console.log(document.getElementById("preparationName").value + " client");
	//illness-name will be a parameter on the server
	socket.emit('addPreparationServer', { preparationName: document.getElementById("preparationName").value });
	
	socket.on('addPreparationClient', function() {
		alert("Added");
	});
}

function addIll() {
	var socket = io.connect('http://localhost:8080');
	console.log(document.getElementById("illName").value + " client");
	//illness-name will be a parameter on the server
	socket.emit('addIllServer', { illName: document.getElementById("illName").value, illPassword: document.getElementById("illPassword").value, 
	illEmail: document.getElementById("illEmail").value, illAge: document.getElementById("illAge").value, illAddress: document.getElementById("illAddress").value, 
	illProfession: document.getElementById("illProfession").value});
	
	socket.on('addIllClient', function(id) {
		socket.emit('addKitServer', id);	
		socket.on('addKitClient', function(id, id_kit) {		
			alert("Added");
		});
	});
}

function getTables() {
	getTable();
	getTable2();
	getTable3();
}

function getTable() {
	var socket = io.connect('http://localhost:8080');
	socket.emit('getTableServer', 'illness');		
	socket.on('getTableClient', function (data) {
		var illnesses = data;
		for (i = 0; i < illnesses.length; i++) {
			var id = illnesses[i]['id']; name = illnesses[i]['name'];
			addRow(id, name, i);
		}		
	});
}

function addRow(id, name, i){
    var tbody = document.getElementById('table').getElementsByTagName("tbody")[0];
	var row = document.createElement("TR")
    var td1 = document.createElement("TD")
	td1.id = '1 ' + i;
    td1.appendChild(document.createTextNode(id));
    var td2 = document.createElement("TD")
	td2.id = '2 ' + i;
    td2.appendChild (document.createTextNode(name));

	row.appendChild(td1);
    row.appendChild(td2);
    tbody.appendChild(row);
}

function getTable2() {
	var socket = io.connect('http://localhost:8080');
	socket.emit('getTable2Server', 'preparation');		
	socket.on('getTable2Client', function (data) {
		var preps = data;
		for (i = 0; i < preps.length; i++) {
			var id = preps[i]['id']; name = preps[i]['name'];
			addRow2(id, name, i);
		}		
	});
}

function addRow2(id, name, i){
    var tbody = document.getElementById('table2').getElementsByTagName("tbody")[0];
	var row = document.createElement("TR")
    var td1 = document.createElement("TD")
	td1.id = '1 ' + i;
    td1.appendChild(document.createTextNode(id));
    var td2 = document.createElement("TD")
	td2.id = '2 ' + i;
    td2.appendChild (document.createTextNode(name));

	row.appendChild(td1);
    row.appendChild(td2);
    tbody.appendChild(row);
}

function getTable3() {
	var socket = io.connect('http://localhost:8080');
	socket.emit('getTable3Server', 'illness');		
	socket.on('getTable3Client', function (data) {
		console.log(data);
		for (i = 0; i < data.length; i++) {
			addRow3(data[i]['id'], data[i]['name'], data[i]['email'], data[i]['age'], data[i]['address'], data[i]['profession'], i);
		}		
	});
}

function addRow3(id, name, email, age, address, profession, i){
    var tbody = document.getElementById('table3').getElementsByTagName("tbody")[0];
	var row = document.createElement("TR")
    var td1 = document.createElement("TD")
	td1.id = '1 ' + i;
    td1.appendChild(document.createTextNode(id));
    var td2 = document.createElement("TD")
	td2.id = '2 ' + i;
    td2.appendChild (document.createTextNode(name));
	var td3 = document.createElement("TD")
	td3.id = '3 ' + i;
    td3.appendChild(document.createTextNode(email));
	 var td5 = document.createElement("TD")
	td5.id = '5 ' + i;
    td5.appendChild(document.createTextNode(age));
	 var td6 = document.createElement("TD")
	td6.id = '6 ' + i;
    td6.appendChild(document.createTextNode(address));
	 var td7 = document.createElement("TD")
	td7.id = '7 ' + i;
    td7.appendChild(document.createTextNode(profession));
	row.appendChild(td1);
    row.appendChild(td2);
	row.appendChild(td3);
	row.appendChild(td5);
    row.appendChild(td6);
	row.appendChild(td7);
    tbody.appendChild(row);
}

function exit() {
	var socket = io.connect('http://localhost:8080');
	socket.emit('exitServer');
}