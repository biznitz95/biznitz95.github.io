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

/* Variables for strings and messages */
var hello = 'Welcome to my Website!';
var paragraph1 = "My name is Bizet Rodriguez \nTake a look around!";
var response = null;

hide(document.querySelectorAll(".container"));

/* Add the inner text here */
document.getElementsByTagName('button')[0].addEventListener('click', function(r) {
	if(document.getElementsByTagName('input')[0].value == 0) {
		alert("Please enter your name :)");
	}
	else {
		hide(document.querySelectorAll(".user"));
		show(document.querySelectorAll(".container"))
		getName(document.getElementsByTagName('input')[0].value);
	}
});

function getName(name) {
	document.getElementById('headerText').innerText = "Hello, " + name + ", welcome to my website!";
	document.getElementById('paragraph1').innerText = paragraph1;
}

function hide (elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = 'none';
  }
}

function show (elements, specifiedDisplay) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = specifiedDisplay || 'block';
  }
  endOfMyPage();
}

function endOfMyPage() {
	alert("More to come soon!");
}
