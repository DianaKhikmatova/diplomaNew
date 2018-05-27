$(document).ready(function(){
	var upperSlider = jQuery('.upper-slide');
	upperSlider.resizable({
		maxWidth: 1200,
		resize: function(event, ui) {
			upperSlider.css("height", '');
		}
	});
});

