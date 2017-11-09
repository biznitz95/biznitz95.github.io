/* Click on arrow to scroll down */
$(document).ready(function() {
    $("#arrow1").click(function(event){
        $('html, body').animate({scrollTop: '+=900px'}, 800);
    });
});

var isOpen = false;
/* Open the Menu */
$(document).ready(function() {
    $("#innerMenu").click(function(event){
		if(!isOpen) {
			$("#menu").animate({
				width: '200px'
			});
			$("#menu").animate({
				height: '400px'
			});
			$("#menu").animate({
				opacity: '1'
			});
			isOpen = true;
		}
		else {
			$("#menu").animate({
				width: '100px'
			});
			$("#menu").animate({
				height: '100px'
			});
			$("#menu").animate({
				opacity: '.6'
			});
			isOpen = false;
		}
    });
});

/* Make arrow move up and down */
$(document).ready(function() {
	loop();
});

function loop() {
	$("#arrow1").animate({
		top: '-=20px'
	});
	$("#arrow1").animate({
		top: '+=20px'
	});
	loop();
}
