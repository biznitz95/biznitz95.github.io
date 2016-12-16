/* Make arrow move up and down */
$(document).ready(function () {
    $("#arrow1").hover(function (event) {

    });
});

/* Click on arrow to scroll down */
$(document).ready(function() {
    $("#arrow1").click(function(event){
        $('html, body').animate({scrollTop: '+=900px'}, 800);
    });
});