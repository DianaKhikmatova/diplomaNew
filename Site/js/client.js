function addImage(id) {
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
		  socket.emit('addImageServer', { imageName: fileName, imageContent: source, libraryId: id});
	}
	socket.on('addImageClient', function(data) {
		showImages(id);
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

function showImages(id) {
	var socket = io.connect('http://localhost:8081');
	socket.emit('getImagesServer', {id: id} );		
	socket.on('getImagesClient', function (data, content) {
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
			image.src = content;
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

function createLibrary() { 
	let libraryName = document.getElementById('library-name').value;
	let libraryDescription = document.getElementById('library-description').value;
	var socket = io.connect('http://localhost:8081');
	socket.emit('addLibraryServer', { libraryName: libraryName, libraryDescription: libraryDescription });
	socket.on('addLibraryClient', function() {
		showLibraries();
	});
}


// BUG!!! -----------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
function showLibraries() {
	let selectedRow = 0;
	let socket = io.connect('http://localhost:8081');
	socket.emit('getLibraryServer');		
	socket.on('getLibraryClient', function (data) {
		let tbody = document.getElementById('libraries-table').getElementsByTagName("tbody")[0];
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
			let tdDescription = document.createElement('td');
			tdDescription.innerHTML = data[i]['description'];
			let tdEdit = document.createElement('td');
			tdEdit.innerHTML = "view / edit";
			tdEdit.classList.add('table-action');
			let tdDelete = document.createElement('td');
			tdDelete.innerHTML = "delete";
			tdDelete.classList.add('table-action');
			
			row.appendChild(tdId);
			row.appendChild(tdName);
			row.appendChild(tdDescription);
			row.appendChild(tdEdit);
			row.appendChild(tdDelete);

			tbody.appendChild(row);
		}	
		let rows = document.getElementById('libraries-table').rows;
		for (let i = 1; i < rows.length; i++) {
			rows[i].childNodes[3].addEventListener('click', function(e) {
				document.getElementById('image-container').style.visibility = 'visible';
				let tableRows = document.getElementById('libraries-table').rows;
				for (let i = 0; i < tableRows.length; i++) {
					if (i % 2 === 0) {
						tableRows[i].style.backgroundColor = '#fff';
					} else {
						tableRows[i].style.backgroundColor = '#f2f2f2';
					}
				}
				rows[i].style.backgroundColor = '#FCF3CF';
				selectedRow = rows[i].childNodes[0].innerHTML;
				showImages(rows[i].childNodes[0].innerHTML);
			}, false);
			rows[i].childNodes[4].addEventListener('click', function(e) {	
				// console.log(rows[i].childNodes[0].innerHTML);
				removeLibrary(e, rows[i].childNodes[0].innerHTML);	
			}, false);
		}
		document.getElementById('btnLoad').addEventListener('click', function () {
			addImage(selectedRow);
		}, false);			
	});
}

function removeLibrary(e, id) {
	let socket = io.connect('http://localhost:8081');
	socket.emit('removeLibraryServer', { id: id});
	socket.on('removeLibraryClient', function() {
		showLibraries();
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

function exit() {
	var socket = io.connect('http://localhost:8080');
	socket.emit('exitServer');
}