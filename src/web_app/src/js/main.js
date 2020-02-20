$(document).ready(function() {
    var hamburgerPressed = false

    $('.hamburger').on('click', function(e) {
        e.preventDefault();
        hamburgerPressed = !hamburgerPressed;

        if (hamburgerPressed) {
            $('.hamburger').addClass('is-active')

            $('.header__dropdown').css('display', 'block').animate({
                backgroundColor: 'rgba(0, 0, 0, .6)'
            })
            $('.dropdown__container').addClass('dropdown__container--open');

        } else {
            $('.hamburger').removeClass('is-active');
            $('.header__dropdown').animate({
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }, function() {
                $('.header__dropdown').css('display', 'none');
            });
            $('.dropdown__container').removeClass('dropdown__container--open');
        }


    });
});