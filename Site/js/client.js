document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('elements');
	getImagesClient();
	initializeListeners();
},
false);

function collapse() {
	let div = event.target.parentNode.parentNode.childNodes[3].childNodes[1];
	let className = div.classList[0];
	console.log(className);
	if (className === 'display-visible') {
		console.log('collapse');
		div.classList.remove('display-visible');
		div.classList.add('display-none');
	} else {
		div.classList.remove('display-none');
		div.classList.add('display-visible');
	}
}

function initializeListeners() {

	interact(".interact-resizable")
    .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        // keep the edges inside the parent
        restrictEdges: {
        outer: 'parent',
        endOnly: true,
        },

        // minimum size
        restrictSize: {
        min: { width: 100, height: 50 },
        },

        inertia: true,
    })
    .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
    });
    

        interact('.interact-drag')
        .draggable({
            onmove: window.dragMoveListener,
            restrict: {
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
        })
        // target elements with the "draggable" class
        interact('.draggable')
        .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
        });
        function dragMoveListener (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        function allowDrop(event) {
        event.preventDefault();
    }

	$(document).keydown(function (e) {
        let currentZIndex = 0;
        for (let i = 0; i < selectElemets.length; i++) {
            switch (e.keyCode) {
                case 84:
                    if (selectElemets[i].resize) {
                        selectElemets[i].resize = false;
                        selectElemets[i].element.removeClass("rotatable");
                        selectElemets[i].element.addClass("interact-resizable");
                    } else {
                        selectElemets[i].resize = true;
                        selectElemets[i].element.removeClass("interact-resizable");
                    }
                    break;
                case 82:
                    if (selectElemets[i].rotate) {
                        selectElemets[i].rotate = false;
                        selectElemets[i].element.removeClass("interact-resizable");
                        selectElemets[i].element.addClass("rotatable");
                        rotate();
                    }
                    else {
                        selectElemets[i].rotate = true;
                        selectElemets[i].element.removeClass("rotatable");
                    }
                    break;
                case 46:
                    selectElemets[i].element.remove();
                    selectElemets.splice(i, 1);
                    i--;
                    break;
                case 67:
                    let elementCopy = selectElemets[i].element.clone();
                    elementCopy.removeClass('edit-border');
                    elementCopy.dblclick(select);
                    elementCopy.appendTo("#canvas");
                    break;
                case 221:
                    currentZIndex = selectElemets[i].zIndex;
                    currentZIndex = +currentZIndex + 1;
                    selectElemets[i].zIndex = currentZIndex;
                    selectElemets[i].element.css("z-index", currentZIndex);
                    break;
                case 219:
                    if (selectElemets[i].zIndex > 0) {
                        currentZIndex = selectElemets[i].zIndex;
                        currentZIndex = +currentZIndex - 1;
                        selectElemets[i].zIndex = currentZIndex;
                        selectElemets[i].element.css("z-index", currentZIndex);
                    }
                    break;
                default:
                    break;
            }
        }
    });

    counter = 0;

    let editElement = function (event) {
        let element = $(event.target);
        let rotateCounter = 0;
        let resizeCounter = 0;
        let innerClickCounter = 0;
        element.addClass('edit-border');
        element.dblclick(function () {
            if (innerClickCounter % 2 === 0) {
                element.removeClass('edit-border');
                innerClickCounter++;
            } else {
                element.addClass('edit-border');
                innerClickCounter++;
            }
        });
    };

    $(".drag").draggable({
        helper: 'clone',
        containment: 'frame',

        //When first dragged
        stop: function (ev, ui) {
            var pos = $(ui.helper).offset();
            objName = "#clonediv" + counter;
            $(objName).css({ "left": pos.left, "top": pos.top });
            $(objName).removeClass("drag");

            //When an existiung object is dragged
            $(objName).draggable({
                containment: 'parent',
                stop: function (ev, ui) {
                    var pos = $(ui.helper).offset();
                    console.log(pos);
                }
            });
        }
    });

    //Make element droppable
    $("#canvas").droppable({
        drop: function (ev, ui) {
            var element = $(ui.draggable).clone();
            //var element=$.extend({}, preElement);
            //var element=$(ui.draggable).clone();
            innerElement = element.children();
            if (($(innerElement).attr("tagName") === "SPAN")) {
                $(innerElement).dblclick(editText);
            }
            element.css("position", "absolute");
            element.addClass("interact-drag");
            counter++;
            element.dblclick(select);
            element.attr("id", globalCounter);
            element.css("z-index", 0)
            $(this).append(element);
            globalCounter++;
        }
    }, false);


    let editText = function () {
        let $el = $(this);
        let $input = $('<input/>').val($el.text());
        let top = $el.position().top;
        let left = $el.position().left;
        $input.css('width', '100px');
        $input.css("position", "absolute");
        $input.css("top", top);
        $input.css("left", left);
        $el.replaceWith($input);
        let save = function () {
            let $span = $('<span>').text($input.val());
            $span.addClass('simple-text');
            $span.addClass('draggable');
            $span.addClass('editable-text');
            $span.dblclick(editText);
            $input.css("position", "absolute");
            $span.css("top", top);
            $span.css("left", left);
            $input.replaceWith($span);
        };
        $input.one('blur', save).focus();
    }

    $(document).ready(function () {

    });

    $('.editable-text').dblclick(editText);

    function rotate() {
        let img = $('.rotatable');

        let offset = img.offset();
        let mouseDown = false;
        function mouse(evt) {
            if (mouseDown == true) {
                var center_x = (offset.left) + (img.width() / 2);
                var center_y = (offset.top) + (img.height() / 2);
                var mouse_x = evt.pageX;
                var mouse_y = evt.pageY;
                var radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
                var degree = (radians * (180 / Math.PI) * -1) + 90;
                img.css('-moz-transform', 'rotate(' + degree + 'deg)');
                img.css('-webkit-transform', 'rotate(' + degree + 'deg)');
                img.css('-o-transform', 'rotate(' + degree + 'deg)');
                img.css('-ms-transform', 'rotate(' + degree + 'deg)');
            }
        }
        img.mousedown(function (e) {
            mouseDown = true;
            $(document).mousemove(mouse);
        });
        $(document).mouseup(function (e) {
            mouseDown = false;
        });
        let rCount = 0;
        $(document).keydown(function (e) {
            if (e.keyCode === 82) {
                if (rCount % 2 !== 0) {
                    img = null;
                }
                rCount++;
            }
        });
        return;
    }
}

function getImagesClient() {
	let socket = io.connect('http://localhost:8081');
	socket.emit('getLibrariesUserServer');		
	socket.on('getLibraryUserClient', function (data) {
		let container = document.getElementById('elements');
		for (let i = 0; i < data.length; i++) {
			let libraryContainer = document.createElement('div');
			libraryContainer.classList.add('library-container');
			libraryContainer.id = data[i]['id'];
			let libraryHeader = document.createElement('div');
			libraryHeader.classList.add('library-header');
			libraryHeader.addEventListener('click', function() {
				collapse();
			}, false);
			let libraryName = document.createElement('p');
			libraryName.innerHTML = data[i]['name'];
			libraryHeader.appendChild(libraryName);
			libraryContainer.appendChild(libraryHeader);
			container.appendChild(libraryContainer);
		}
		let containers = document.getElementById('elements').childNodes;
		// Need to be fixed
		for (let i = 3; i < containers.length; i++) {
			//console.log(containers[i].id);
			socket.emit('getImagesServer', {id: containers[i].id});
			let div = document.createElement('div');
			let c = 0;
			socket.on('getImagesClient' + containers[i].id, function (data, content) {
				//console.log(data.length);
				for (let j = 0; j < data.length; j++) {
					let imageContainer = document.createElement('img');
					// imageContainer.width = 60;
					// imageContainer.height = 60;
					imageContainer.src = data[j]['content'];
					//imageContainer.style.background = 'url("' + data[j]['content'] + '") no-repeat';
					div.appendChild(imageContainer);
					imageContainer.classList.add("drag");
					imageContainer.classList.add("img-container");
					imageContainer.classList.add("ui-draggable");
					imageContainer.id = data[j]['id'] + 'image';
				}
				// div.id = imgsArray[i];
				// div.style.background = 'url("img/' + imgsArray[i] + '") no-repeat';
				// document.getElementById("elements").appendChild(div);
				initializeListeners();
			});

			div.classList.add('display-visible');
			document.getElementById(containers[i].id).appendChild(div);

			socket.emit('getFunctionsServer', {id: containers[i].id});
			socket.on('getFunctionsClient' + containers[i].id, function (data, content) {
				console.log(data.length);
				for (let j = 0; j < data.length; j++) {
					let button = document.createElement('input');
					button.setAttribute('type', 'button');
					button.setAttribute('value', data[j]['name']);
					button.classList.add('button');
					button.classList.add('function-button');
					button.addEventListener('click', function() {
						window.localStorage.setItem('functionContent', data[j]['content']);
						goTo('./function.html');
					}, false);
					button.id = data[j]['id'] + 'function';
					//button.setAttribute('value', 'button');
					document.getElementById(containers[i].id).appendChild(button);
				}
				
			});
		}	
	});
}

function goTo(url) {
	document.location.href = url;
}

function save() {
	let name = document.getElementById('version-name').value;
	let content = document.getElementById('canvas').innerHTML;
	var socket = io.connect('http://localhost:8081');
	if (name !== "") {
		socket.emit('addFileServer', { fileName: name, fileContent: content, userId: window.localStorage.getItem('id')});
	socket.on('addFileClient', function(data) {
		console.log(data);
	});
	} else {
		alert('Enter file name first');
	}

}

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

function addFunction(id) {
	var socket = io.connect('http://localhost:8081');
	let fr = "";    
	let fileName = "";       
	if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}   
	let input = document.getElementById('fileinput-function');
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
		fr.readAsText(file);
		fileName = input.value.replace(/.*[\/\\]/, '');
	}
	function receivedText() {
		  let source = fr.result;
		  socket.emit('addFunctionServer', { functionName: fileName, functionContent: source, libraryId: id});
	}
	socket.on('addFunctionClient', function(data) {
		showFunctions(id);
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

function showFunctions(id) {
	var socket = io.connect('http://localhost:8081');
	socket.emit('getFunctionsServer', {id: id} );		
	socket.on('getFunctionsClient' + id, function (data, content) {
		var tbody = document.getElementById('functions-table').getElementsByTagName("tbody")[0];
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
			// let tdContent = document.createElement('td');
			// tdContent.innerHTML = data[i]['content'].sl;
			let tdDelete = document.createElement('td');
			tdDelete.innerHTML = "delete";
			tdDelete.classList.add('table-action');

			row.appendChild(tdId);
			row.appendChild(tdName);
			// row.appendChild(tdContent);
			row.appendChild(tdDelete);

			tbody.appendChild(row);
		}	
		let rows = document.getElementById('functions-table').rows;
		for (let i = 1; i < rows.length; i++) {			
			rows[i].childNodes[2].addEventListener('click', function(e) {
				removeFunction(e, rows[i].childNodes[0].innerHTML, id);	
			}, false);
		}	
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

function createLibrary() { 
	let libraryName = document.getElementById('library-name').value;
	let libraryDescription = document.getElementById('library-description').value;
	var socket = io.connect('http://localhost:8081');
	socket.emit('addLibraryServer', { libraryName: libraryName, libraryDescription: libraryDescription });
	socket.on('addLibraryClient', function() {
		showLibraries();
	});
}

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
				showFunctions(rows[i].childNodes[0].innerHTML)
			}, false);
			rows[i].childNodes[4].addEventListener('click', function(e) {	
				// console.log(rows[i].childNodes[0].innerHTML);
				removeLibrary(e, rows[i].childNodes[0].innerHTML);	
			}, false);
		}
		document.getElementById('btnLoad').addEventListener('click', function () {
			addImage(selectedRow);
		}, false);	
		document.getElementById('load-function').addEventListener('click', function () {
			addFunction(selectedRow);
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

function removeFunction(e, id, library_id) {
	let socket = io.connect('http://localhost:8081');
	socket.emit('removeFunctionServer', { id: id});
	socket.on('removeFunctionClient', function() {
		showFunctions(library_id);
	});		
}

function exit() {
	var socket = io.connect('http://localhost:8080');
	socket.emit('exitServer');
}