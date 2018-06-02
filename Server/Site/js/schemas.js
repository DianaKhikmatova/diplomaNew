let globalCounter = 0;

let selectElemets = [];

let findElement = function (array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].element.attr("id") === element.attr("id")) {
            return i;
        }
    }
    return -1;
}

let select = function (event) {
    let element = $(event.target);
    let index = findElement(selectElemets, element);
    if (index === -1) {
        selectElemets.push({ "element": element, "rotate": false, "resize": false, "zIndex": element.css("z-index")});
        console.log(element.css('z-index'));
        element.addClass('edit-border');
    } else {
        selectElemets.splice(index, 1);
        element.removeClass('edit-border');
    }
}

document.addEventListener('DOMContentLoaded', function () {

    let imgsArray = ["1.svg", "2.svg", "3.svg", "4.svg", "5.svg"];
    for (let i = 0; i < imgsArray.length; i++) {
        let div = document.createElement("div");
        div.classList.add("drag");
        div.classList.add("img-container");
        div.classList.add("ui-draggable");
        div.id = imgsArray[i];
        div.style.background = 'url("img/' + imgsArray[i] + '") no-repeat';
        document.getElementById("elements").appendChild(div);
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
});