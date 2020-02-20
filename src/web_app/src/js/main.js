$(document).ready(function() {
    var hamburgerPressed = false

    $('.hamburger').on('click', function(e) {
        e.preventDefault();
        hamburgerPressed = !hamburgerPressed;

        if (hamburgerPressed) 
            $('.hamburger').addClass('is-active');
        else
            $('.hamburger').removeClass('is-active');

    });
});