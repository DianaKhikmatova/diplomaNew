
document.addEventListener('DOMContentLoaded', function () {

    //document.getElementById("create-simple-schema-btn").addEventListener("click", createSimpleSchema(), false);
    $('body').on('click', '[data-editable]', function(){
        
        var $el = $(this);
                    
        var $input = $('<input/>').val( $el.text() );
        $el.replaceWith( $input );
        
        var save = function(){
          var $p = $('<p data-editable />').text( $input.val() );
          $input.replaceWith( $p );
        };
        
        /**
          We're defining the callback with `one`, because we know that
          the element will be gone just after that, and we don't want 
          any callbacks leftovers take memory. 
          Next time `p` turns into `input` this single callback 
          will be applied again.
        */
        $input.one('blur', save).focus();
        
      });
});

let blockQuantity = 0;

let selectedItem = "";
let selection = false;

function createSimpleSchema() {
    let root = document.createElement('div');

    let mainText = document.createElement('p');
    mainText.innerHTML = "Text " + blockQuantity;
    
    mainText.style.marginTop = "10px";
    mainText.style.marginLeft = "10px";
    mainText.addEventListener("dblclick", function(event) {
         let currentItem = event.target;
         let tempText = currentItem.innerHTML;
         let tempInput = document.createElement('input');
         tempInput.setAttribute('type', 'text');
         tempInput.setAttribute('value', tempText);
         tempInput.style.maxWidth = "100%";
         tempInput.style.border = "none";
         //tempInput.onFocus= this.blur();
         tempInput.addEventListener('keyup', function(event) {
             if(event.keyCode === 13) {
                let newValue = tempInput.value;
                let newText = document.createElement('p');
                newText.innerHTML = newValue;
                root.removeChild(tempInput);
                root.appendChild(newText);
             }
         },false);
         root.appendChild(tempInput);
         root.removeChild(currentItem);
    }, false);

    
    root.appendChild(mainText);
    
    root.id = "block" + (blockQuantity + 1);
    root.style.width = "100px";
    root.style.height = "50px"
    root.style.border = "1px solid black";
    root.style.margin = "0 auto";
    root.style.marginBottom = "20px";
    root.style.clear = "right";
    root.addEventListener("click", function (event) {
        if (selection === false) {
            if (event != null) {
                let item = event.target;
                item.style.backgroundColor = "pink";
                selection = true;
                selectedItem = item.id;
            }
         } else {
            if (event != null) {
                let item = event.target;
                item.style.backgroundColor = "transparent";
                selection = false;
                selectedItem = "";
            }
         }
    }, false);
    let container = document.getElementById("canvas");
    container.appendChild(root);

    blockQuantity += 1;
}

function removeItem() {
    let item = document.getElementById(selectedItem);
    item.parentNode.removeChild(item);
}


