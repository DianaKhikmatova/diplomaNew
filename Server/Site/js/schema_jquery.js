const blockWidth = 180;
const blockMargin = 15;

let blockQuantity = 0;
let relationQuantity = 0;

let selectedItem = "";
let selection = false;

let objectsArray = [];
function GraphicalObject(renderedObject, ancestor, level, position, type) {
    this.renderedObject = renderedObject;
    this.ancestor = ancestor;
    this.inheritors = [];
    this.level = level;
    this.position = position;
    this.type = type;
    this.relationAncestorObjects = [];
    this.relationInheritObjects = [];
    this.selected = false;
    this.idName = 'type-' +  level + '-' + position;
    this.pushInheritor = function(inheritor) {
        return this.inheritors.push(inheritor);
    };
    this.pushRelationInheritObject = function(relationIheritObject) {
        return this.relationInheritObjects.push(relationIheritObject);
    };
    this.pushRelationAncestorObject = function(relationAncestorObject) {
        return this.relationAncestorObjects.push(relationAncestorObject);
    };
    this.removeRelationAncestorObject = function(relationAncestorObject) {
        for (let i = 0; i < this.relationAncestorObjects; i++) {
            if (this.relationAncestorObjects[i] === relationAncestorObject) {
                console.log(this.relationAncestorObjects.splice(i, 1));
            }
        }
        return this.relationAncestorObjects;
    };
    // this.removeRelationInheritorObject = function(relationAncestorObject) {
    //     for (let i = 0; i < this.relationAncestorObjects; i++) {
    //         if (this.relationAncestorObjects[i] === relationAncestorObject) {
    //             console.log(this.relationAncestorObjects.splice(i, 1));
    //             //this.relationAncestorObjects.splice(i, 1);
    //         }
    //     }
    //     return this.relationAncestorObjects;
    // };
    this.clearRelationAncestorObjects = function() {
        return this.relationAncestorObjects.splice(0, this.relationAncestorObjects.length);
    };
    this.clearRelationInheritorObjects = function() {
        return this.relationInheritObjects.splice(0, this.relationInheritObjects.length);
    };
    this.getInheritorsLength = function() {
        return this.inheritors.length;
    };
    this.decreaseLevel = function() {
        return this.level--;
    }
}

document.addEventListener('DOMContentLoaded', function () {

    $('.pop-up-background').hide();


    //document.getElementById("create-simple-schema-btn").addEventListener("click", createSimpleSchema(), false);
    $('body').on('dblclick', '[data-editable]', function(){
        
        let $el = $(this);
                    
        let $input = $('<input/>').val( $el.text() );
        $input.css('width', '95%');
        $input.css('margin-top', '10px');
        $el.replaceWith( $input );
        
        let save = function(){
            let $p = $('<p data-editable />').text( $input.val() );
            $p.addClass('simple-text');
            $input.replaceWith( $p );
        };
        
        $input.one('blur', save).focus();
        
    });

    $('#add-item').click(function(){
        addClassBlock();
    });

    $('#remove-item').click(function(){
        removeItem();
    });

    $('#add-child').click(function(){
        showPopUp();
    });

    $('#cancel-creation').click(function(){
        closePopUp();
    });

    $('#create-block').click(function(){
        closePopUp();
        addClassBlock();
    });

    function removeItem() {
        let item = $('#' + selectedItem);
        let itemAncestor = null;
        let itemObject = null;
        for (let i = 0; i < objectsArray.length; i++) {
            if (objectsArray[i].renderedObject.attr('id') === selectedItem) {
                itemObject = objectsArray[i];
                if (objectsArray[i].ancestor !== null) {
                    itemAncestor = objectsArray[i].ancestor;
                    let itemAncestorId = itemAncestor.attr('id');
                    for (let i = 0; i < objectsArray.length; i++) {
                        if (objectsArray[i].renderedObject.attr('id') === itemAncestorId) {
                            itemAncestor = objectsArray[i];
                        }
                    }
                }
            }
        }
        if (itemAncestor !== null && item.inheritors !== undefined) {
            for(let i = 0; i < itemAncestor.inheritors.length; i++) {
                if (itemAncestor.inheritors[i].renderedObject.attr('id') === itemObject.renderedObject.attr('id')) {
                    itemAncestor.inheritors.pop(i);
                }
            }
        }
        // for (let i = 0; i < itemObject.inheritors.length; i++) {
        //     console.log(itemObject.inheritors[i].level);
        //     itemObject.inheritors[i].decreaseLevel();
        //     console.log(itemObject.inheritors[i].level);
        //     itemObject.inheritors[i].renderedObject.css('top', '' + itemObject.inheritors[i].level * 100 + 'px');
        // }
        for (let i = 0; i < objectsArray.length; i++) {
            if (objectsArray[i] === itemObject) {
                objectsArray.splice(i, 1);
            }
        }
        item.remove();
        selectedItem = "";
    }

    function addClassBlock() {

        let block = $("<div></div>");
        block.addClass('simple-block');
        block.addClass('draggable');
        block.attr('id', "block" + (blockQuantity + 1));
        block.click(function (event) {
            if (event !== null) {
                let item = event.target;
                for (let i = 0; i < objectsArray.length; i++) {
                    if (objectsArray[i].renderedObject.attr('id') === item.id && objectsArray[i].selected === false) {
                        objectsArray[i].renderedObject.removeClass('default-block');
                        objectsArray[i].renderedObject.addClass('selected-block');
                        objectsArray[i].selected = true;
                        selectedItem = item.id;
                    } else {
                        objectsArray[i].renderedObject.removeClass('selected-block');
                        objectsArray[i].renderedObject.addClass('default-block');
                        if (objectsArray[i].renderedObject.attr('id') === item.id && objectsArray[i].selected === true) {
                            selectedItem = "";
                        } 
                        objectsArray[i].selected = false;
                    }
                }
            }
        })

        block.contextmenu(function (event) {
            showContextMenu(event);
        });

        let mainText = $("<p data-editable></p>");
        mainText.text("Text-" + blockQuantity);
        mainText.addClass('simple-text');
        block.append(mainText);
        let blockObject = null;
        let ancestorObject = null;
        if (selectedItem === "") {
            blockObject = new GraphicalObject(block, null, 0, 1, 'block');
            let itemsWithCurrentLevel = findByLevel(blockObject.level, objectsArray);
            changePositionOfSiblings(blockObject, objectsArray, itemsWithCurrentLevel.length + 1);
        } else {
            let ancestor = $("#" + selectedItem);
            for (let i = 0; i < objectsArray.length; i++) {
                if (objectsArray[i].renderedObject.attr('id') === selectedItem) {
                    ancestorObject = objectsArray[i];
                }
            }
            blockObject = new GraphicalObject(block, ancestor, ancestorObject.level + 1, 1, 'block');
            blockObject.ancestor.children(".simple-text").text(blockObject.ancestor.children().text() + " Parent of " + blockObject.renderedObject.attr('id'));   
            ancestorObject.pushInheritor(blockObject); 
            let itemsWithCurrentLevel = findByLevel(blockObject.level, objectsArray);
            changePositionOfSiblings(blockObject, objectsArray, itemsWithCurrentLevel.length + 1);
        }

        block.css('top', blockObject.level * 100 + 'px');
        objectsArray.push(blockObject);
        $("#canvas").append(block);
        if (selectedItem !== "") {
            drawRelation(blockObject.renderedObject, ancestorObject.renderedObject);
        }
        blockQuantity += 1;
    }

    
    function showPopUp() {
        $('.pop-up-background').show();
    } 

    function closePopUp() {
        $('.pop-up-background').hide();
    } 

    function changePositionOfSiblings(object, objectsArray, itemsQuantity) {
        let canvasWidth = getWidth($("#canvas"));
        let totalItemsWidth = blockWidth * itemsQuantity + blockMargin * (itemsQuantity - 1);
        let shift = canvasWidth / 2 - totalItemsWidth / 2;
        if (itemsQuantity === 1) {
            object.renderedObject.css('left', shift + 'px');
        } else {
            shift -= blockMargin;
        for (let i = 0; i < objectsArray.length; i++) {
            if (objectsArray[i].level === object.level) {
                objectsArray[i].renderedObject.css('left', shift + 'px');
                shift += blockWidth + blockMargin * 2;
                let objectAncestor = objectsArray[i].ancestor;
                for (let j = 0; j < objectsArray[i].relationAncestorObjects.length; j++) {
                    $("#" + objectsArray[i].relationAncestorObjects[j].id).remove();
                }
                drawRelation(objectsArray[i].renderedObject, objectAncestor);
            }
            object.renderedObject.css('left', shift  + 'px');  
        }
    }
    }
});

function drawRelation(blockObject, ancestorObject) {
    let blockPosition = blockObject.position();
    let ancestorPosition, ancestorHeight;
    let blockHeight = blockObject.innerHeight();
    if (ancestorObject !== null) {
        ancestorPosition = ancestorObject.position();
        ancestorHeight = ancestorObject.innerHeight();
    }
    

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let svgNS = svg.namespaceURI;
    let lineColor = blockObject.css('border-color');

    let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    let line = document.createElementNS(svgNS,'line');

    let lineLeft = 0;
    let lineTop = ancestorPosition.top + ancestorHeight + parseInt(blockObject.css('margin-top').slice(0, -2));

    if (ancestorPosition.left <= blockPosition.left) {
        lineLeft = ancestorPosition.left + getWidth(blockObject) / 2 + parseInt(blockObject.css('margin-top').slice(0, -2) * 2);
    } else {
        lineLeft = blockPosition.left + getWidth(blockObject) / 2 + parseInt(blockObject.css('margin-top').slice(0, -2) * 2);
    }

    line.setAttribute('y1', 0);
    //console.log(an.top);
    line.setAttribute('y2', blockPosition.top - ancestorPosition.top - ancestorHeight);
    if (ancestorPosition.left <= blockPosition.left) {
        line.setAttribute('x1', 0);
        line.setAttribute('x2', blockPosition.left - (ancestorPosition.left + getWidth(blockObject) / 2) + getWidth(blockObject) / 2);
    } else {
        line.setAttribute('x1', ancestorPosition.left - (blockPosition.left + getWidth(blockObject) / 2) + getWidth(blockObject) / 2);
        line.setAttribute('x2', 0);
    }
    // console.log('x1 ' + line.getAttribute('x1'));
    // console.log('x2 ' + line.getAttribute('x2'));
    // console.log('xy1 ' + line.getAttribute('y1'));
    // console.log('y2 ' + line.getAttribute('y2'));
    line.setAttribute('stroke', lineColor);
    line.setAttribute('srtoke-width', 3);
    figure = line;
    svg1.setAttribute('height', Math.abs(figure.getAttribute('y2') - figure.getAttribute('y1')));
    svg1.setAttribute('width', Math.abs(figure.getAttribute('x2') - figure.getAttribute('x1') + 2));
    
    svg1.style.top = lineTop;
    svg1.style.left = lineLeft;
    svg1.appendChild(line);
    svg1.addEventListener('dblclick', function(event) {
        removeRelation(event);
    }, false);
    svg1.addEventListener('contextmenu' , function (event) {
        showContextMenu(event);
    }, false);
    svg1.classList.add('draggable');

    let block = null;
    let ancestor = null;
    for (let i = 0; i < objectsArray.length; i++) {
        if (objectsArray[i].renderedObject.attr('id') === blockObject.attr('id')) {
            block = objectsArray[i];
        }
        if (objectsArray[i].renderedObject.attr('id') === ancestorObject.attr('id')) {
            ancestor = objectsArray[i];
        }
    }
    block.pushRelationAncestorObject(svg1);
    if (!ancestor.inheritors.includes(block)) {
        ancestor.pushInheritor(block);        
    }
    ancestor.pushRelationInheritObject(svg1);

    svg1.id = 'line' + relationQuantity;
    document.getElementById('canvas').appendChild(svg1);
    relationQuantity++;
}


function getWidth(object) {
    let widthInString = object.css('width');
    return parseInt(widthInString.slice(0, -2));
}

function findByLevel(level, objectsArray) {
    let objectsWithCurrentLevelArray = [];
    for (let i = 0; i < objectsArray.length; i++) {
        if (objectsArray[i].level === level) {
            objectsWithCurrentLevelArray.push(objectsArray[i]);
        }
    }
    return objectsWithCurrentLevelArray;
}



function showContextMenu(event) {
    if (event !== null) {
        let item = event.target;
        let contextMenu =  $("<div></div>");
        contextMenu.addClass('context-menu');
        let currentObject = $('#' + item.getAttribute('id')); 
        contextMenu.css('top', currentObject.position().top + blockMargin);
        contextMenu.css('left', currentObject.position().left + currentObject.width() - 20);
        let contextMenuContent = $("<ul></ul>");
        let contextmenuItem1 =  $("<li />").text('Text 1');
        let contextmenuItem2 =  $("<li />").text('Text 2');
        let contextmenuItem3 =  $("<li />").text('Text 3');
        contextmenuItem1.click(function(event) {
            removeContextMenu(event);
        });
        contextmenuItem2.click(function(event) {
            removeContextMenu(event);
        });
        contextmenuItem3.click(function(event) {
            removeContextMenu(event);
        });
        contextMenu.append(contextmenuItem1);
        contextMenu.append(contextmenuItem2);
        contextMenu.append(contextmenuItem3);
        $("#canvas").append(contextMenu);
    }
}


function removeContextMenu(event) {
    if (event !== null) {
        $(".context-menu").remove();
    }
}

function removeRelation(event) {
    if (event.target !== null) {
        $("#" + event.target.id).remove();
    }
}
