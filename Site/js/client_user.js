let libId = 0;
document.addEventListener('DOMContentLoaded', function () {
	// document.getElementById('user-body').addEventListener('load', function () { 
	// 	console.log('body');
	// 	showImages(window.localStorage.getItem('id'));
	// }, false);
	getUserLibrary(window.localStorage.getItem('id'));	
	document.getElementById('btnLoad-user').addEventListener('click', function() {
		addImage(libId);
	}, false);
}, false);

function getUserLibrary(id) {
	var socket = io.connect('http://localhost:8081');
	socket.emit('getUserLibraryServer', {id: id} );		
	socket.on('getUserLibraryClient', function (data, content) {
		console.log(data);
		libId =  data[0]['id'];
		showImages(libId);
		showFiles(window.localStorage.getItem('id'));
	});
}

function addImage(id) {
	var socket = io.connect('http://localhost:8081');
	let fr = "";    
	let fileName = "";       
	if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}   
	let input = document.getElementById('fileinput-user');
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
		  socket.emit('addImageServer', { imageName: fileName, imageContent: source, libraryId: id});
	}
	socket.on('addImageClient', function(data) {
		showImages(id);
	});
}


function showImages(id) {
	var socket = io.connect('http://localhost:8081');
	socket.emit('getImagesServer', {id: id} );		
	socket.on('getImagesClient' + id, function (data, content) {
		let images = data;
		var tbody = document.getElementById('images-table').getElementsByTagName("tbody")[0];
		while (tbody.hasChildNodes()) {
			tbody.removeChild(tbody.lastChild);
		}
		for (let i = 0; i < images.length; i++) {
			let row = document.createElement('tr');
			row.id = images[i]['id'];
			let tdId = document.createElement('td');
			tdId.innerHTML = '' + images[i]['id'];
			let tdName = document.createElement('td');
			tdName.innerHTML = images[i]['name'];
			let tdContent = document.createElement('td');
			let image = document.createElement('img');
			image.src = images[i]['content'];
			image.width=70;
			image.height=70;
			image.alt="here should be some image";
			tdContent.appendChild(image);
			let tdDelete = document.createElement('td');
			tdDelete.innerHTML = "delete";
			tdDelete.classList.add('table-action');

			row.appendChild(tdId);
			row.appendChild(tdName);
			row.appendChild(tdContent);
			row.appendChild(tdDelete);

			tbody.appendChild(row);
		}	
		let rows = document.getElementById('images-table').rows;
		for (let i = 1; i < rows.length; i++) {				
			rows[i].childNodes[3].addEventListener('click', function(e) {	
				// console.log(rows[i].childNodes[0].innerHTML);
				removeImage(e, rows[i].childNodes[0].innerHTML, id);	
			}, false);
		}	
	});
}

function removeImage(e, id, library_id) {
	let socket = io.connect('http://localhost:8081');
	let currentRow = e.target.parentNode;
	socket.emit('removeImageServer', { id: id});
	socket.on('removeImageClient', function() {
		showImages(library_id);
	});		
}

function showFiles(id) {
	var socket = io.connect('http://localhost:8081');
	socket.emit('getFilesServer', {id: id} );		
	socket.on('getFilesClient' + id, function (data, content) {
		var tbody = document.getElementById('files-table').getElementsByTagName("tbody")[0];
		while (tbody.hasChildNodes()) {
			tbody.removeChild(tbody.lastChild);
		}
		for (let i = 0; i < data.length; i++) {
			let row = document.createElement('tr');
			row.id = data[i]['id'];
			let tdId = document.createElement('td');
			tdId.innerHTML = '' + data[i]['id'];
			let tdName = document.createElement('td');
			tdName.innerHTML = data[i]['name'];
			tdName.classList.add('table-action');
			tdName.addEventListener('click', function() {
				window.localStorage.setItem('state', data[i]['content']);
				document.location.href = "./schemas.html";
			}, false);
			let tdDelete = document.createElement('td');
			tdDelete.innerHTML = "delete";
			tdDelete.classList.add('table-action');

			row.appendChild(tdId);
			row.appendChild(tdName);
			row.appendChild(tdDelete);

			tbody.appendChild(row);
		}	
		let rows = document.getElementById('files-table').rows;
		for (let i = 1; i < rows.length; i++) {			
			rows[i].childNodes[2].addEventListener('click', function(e) {
				removeFile(e, rows[i].childNodes[0].innerHTML, id);	
			}, false);
		}	
	});
}

function removeFile(e, id, user_id) {
	let socket = io.connect('http://localhost:8081');
	let currentRow = e.target.parentNode;
	socket.emit('removeFileServer', { id: id});
	socket.on('removeFileClient', function() {
		showFiles(user_id);
	});		
}

function exit() {
	var socket = io.connect('http://localhost:8080');
	socket.emit('exitServer');
}
