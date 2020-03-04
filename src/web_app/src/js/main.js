$(document).ready(function() {
    var hamburgerPressed = false;
    var registertoggle = false;

    // slick configuration
    $(".reviews__carousel").slick({
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        customPaging : function(slider, i) {
            var thumb = $(slider.$slides[i]).data();
            return '<a>'+ (i + 1) +'</a>';;
        }
        
        // responsive: [{ 
        //     breakpoint: 500,
        //     settings: {
        //         dots: false,
        //         arrows: false,
        //         infinite: false,
        //         slidesToShow: 2,
        //         slidesToScroll: 2
        //     } 
        // }]
    });


    // hamburger dropdown menu open and close effects
    $('.hamburger').on('click', function(e) {
        e.preventDefault();
        hamburgerPressed = !hamburgerPressed;

        if (hamburgerPressed) {
            $('.hamburger').addClass('is-active');

            $('.header__dropdown').css('display', 'block').animate({
                backgroundColor: 'rgba(0, 0, 0, .6)'
            })
            $('.dropdown__container').addClass('dropdown__container--open');

        } else {
            $('.hamburger').removeClass('is-active').css('position', 'static');

            $('.header__dropdown').animate({
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }, function() {
                $('.header__dropdown').css('display', 'none');
            });
            $('.dropdown__container').removeClass('dropdown__container--open');
        }
    });



    $('.half__form-transition-header').on('click', function(e) {

        return;

        // $('#half-2').removeClass('login__half--background');
        // $('#half-2').addClass('login__half--form');

        // $('#half-1').removeClass('login__half--form');
        // $('#half-1').addClass('login__half--background');
        registertoggle = !registertoggle

        if (registertoggle) {
            $('.login__half--login').css('display', 'none');
            $('.login__half--register').css('display', 'flex');
            $(this).find('.form-transition-header__text').text("Login");
        } else {
            $('.login__half--login').css('display', 'flex');
            $('.login__half--register').css('display', 'none');
            $(this).find('.form-transition-header__text').text("Register");

        }
        
        // e.preventDefault();
    })
});