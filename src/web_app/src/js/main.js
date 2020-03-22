/*
*       document load function (on ready)
*/
$(document).ready(function() {
    // Variables 
    var hamburgerPressed = false;
    var registertoggle = false;
    var accountToggle = false;
    var pageCount = 0;


    if ($('.update-form__error')[0]) {
        errors = ['name', 'surname', 'email', 'phone', 
                    'address_1', 'address_2', 'city', 'zipcode', 
                    'current_password', 'password', 'confirm_password'];

        $.each(errors, function(key, value) {
            if ($('#' + value + '-error')[0]) {
                $('#' + value).addClass('wobble-horizontal');
            }
        });
    }


    /*
    *  Slick configuration (for carousel)
    */
    $(".reviews__carousel").slick({
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        customPaging : function(slider, i) {
            var thumb = $(slider.$slides[i]).data();
            return '<a>'+ (i + 1) +'</a>';;
        }
    });


    /*
    *  hamburger dropdown menu open and close effects
    */
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


    /*
    *  Transition from login to registration form (and vise-versa)
    */ 
    $('.half__form-transition-header, .half__bottom-link--transition').on('click', function(e) {
        registertoggle = !registertoggle

        if (registertoggle) {
            $('.login__half--login').css('display', 'none');
            $('.login__half--register').css('display', 'flex');
            $('.form-transition-header__text').text("Login");
        } else {
            $('.login__half--login').css('display', 'flex');
            $('.login__half--register').css('display', 'none');
            $('.form-transition-header__text').text("Register");
        }
        
        e.preventDefault();
    })


    /*
    *  Scroll up function
    */ 
    $('.scroll-to-top').on('click', function(e) {
		$('html, body').animate({scrollTop: 0}, 500);
		e.preventDefault();
    });    


    $('.account__side-open').on('click', function(e) {
        accountToggle = !accountToggle;

        if (accountToggle) {
            $('.account__side-bar').addClass('account__side-bar--open');
            $('.label__expand').text("Collapse");
        } else {
            $('.account__side-bar').removeClass('account__side-bar--open');
            $('.label__expand').text("Expand");
        }
    });

    /*
    *  Remove animation after animation complete
    */  
    $('.login-form__input').on(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function() {
            $(this).removeClass("wobble-horizontal");
        }
    );


    $(document).on('click', '.modal--open', function(e) {
        $('.modal--modal').css('display', 'flex');
    });

    $('.modal--open-delete').on('click', function(e) {
        $('.modal--delete').css('display', 'flex');
    });

    $('.modal--close').on('click', function(e) {
        $('.modal').fadeOut();
    });

    $('.modal').on('click', function(e) {
        var target = $('.modal');

        if (e.target.className.split(" ")[0] == 'modal') {
            target.fadeOut();
        }
    });


    $('.content__explore--delete-membership').on('click', function(e) {
        $('#delete-membership').attr('href', '/delete/memberships/' + this.id);
    });

    $('.content__explore--delete-payment').on('click', function(e) {
        $('#delete-payment').attr('href', '/delete/cards/' + this.id);
    });


    $('.overview__option--qr-modal').on('click', function(e) {
        $('#sportName').text($(this).find('.sportName-value').text());
        $('#start_time').text($(this).find('.start_time-value').text());
        $('#duration').text($(this).find('.duration-value').text());
        $('#status').text($(this).find('.status-value').text());
        $('#qr').attr('src', this.id);
    });


    $(document).on('click', '.item__book--book-modal', function(e) {
        $('#activity').text($(this).parent().parent().find('.activity-value').text());
        $('#start_time').text($(this).parent().parent().find('.start_time-value').attr('data_attr'));
        $('#duration').text($(this).parent().parent().find('.duration-value').text());
        $('#location').text($(this).parent().parent().find('.location-value').text());

        $('#book-activity').attr('href', this.id); // TODO: add router route
    });



    /*
    *  Function:   Register form (subform 1) Submit AJAX Request 
    *  Input:      Request Body
    *  Output:     Success/Error function
    */  
    $('#form-1').submit(function(e) {
        var errorIds = ['name-error', 'surname-error', 'email-error', 'password-error', 'confirm_password-error'];
        $.each(errorIds, function(key, value) {
            $('#' + value).text("");
            $('#' + value).addClass('d-none')
        });

        $.ajax({
            url: '/ajax/register/response-1',
            type: 'POST',
            data: $('#form-1').serialize(),
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);
                if (data.error) {
                    $.each(data.error, function(key, value) {
                        $('#' + value.path + '-error').text(value.message);
                        $('#' + value.path + '-error').removeClass('login-form__error--d-none');
                        $('#' + value.path).addClass('wobble-horizontal');
                    });
                } else {
                    pageCount++;
                    changePage(pageCount, "next", 2);
                }
            },
            error: function(error) {
                alert(error);
            }
        }); 

        e.preventDefault();
    }); 


    /*
    *  Function:   Register form (subform 2) Submit AJAX Request 
    *  Input:      Request Body
    *  Output:     Success/Error function
    */ 
    $('#form-2').submit(function(e) {
        var errorIds = ['birth-error', 'phone-error'];
        $.each(errorIds, function(key, value) {
            $('#' + value).text("");
            $('#' + value).addClass('d-none')
        });

        $.ajax({
            url: '/ajax/register/response-2',
            type: 'POST',
            data: $('#form-2').serialize(),
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);
                if (data.error) {
                    $.each(data.error, function(key, value) {
                        $('#' + value.path + '-error').text(value.message);
                        $('#' + value.path + '-error').removeClass('login-form__error--d-none');
                        $('#' + value.path).addClass('wobble-horizontal');
                    });
                } else {
                    pageCount++;
                    changePage(pageCount, "next", 2);
                }
            },
            error: function(error) {
                alert(error);
            }
        });

        e.preventDefault();
    });


    /*
    *  Function:   Register form (subform 3) Submit AJAX Request 
    *  Input:      Request Body
    *  Output:     Success/Error function
    */ 
    $('#form-3').submit(function(e) {
        var errorIds = ['address_1-error', 'address_1-error', 'city-error', 'zipcode-error'];
        $.each(errorIds, function(key, value) {
            $('#' + value).text("");
            $('#' + value).addClass('d-none')
        });

        $.ajax({
            url: '/ajax/register/response-3',
            type: 'POST',
            data: $('#form-3').serialize(),
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);
                if (data.error) {
                    $.each(data.error, function(key, value) {
                        $('#' + value.path + '-error').text(value.message);
                        $('#' + value.path + '-error').removeClass('login-form__error--d-none');
                        $('#' + value.path).addClass('wobble-horizontal');
                    });
                } else {
                    combineForms();
                }
            },
            error: function(error) {
                alert(error);
            }   
        });

        e.preventDefault();
    });


    $('#form-4').submit(function(e) {
        $('#form-3').submit();
        e.preventDefault();
    });

    $('.login-form__btn--return').on('click', function(e) {
        pageCount--;
        changePage(pageCount, "back", 2);
    });
});


function combineForms() {
    var $newForm = $("<form></form>").attr({method: "POST", action: "/user/register"});

    $('#form-1').find(":input:not(:submit, :button)").each(function() {
        $newForm.append($("<input type=\"hidden\" />")  
            .attr('name', this.name)   
            .val($(this).val())  
        );
    });

    $('#form-2').find(":input:not(:submit, :button)").each(function() {
        if (this.name != "_csrf") {
            $newForm.append($("<input type=\"hidden\" />")  
                .attr('name', this.name)   
                .val($(this).val())  
            );
        }
            
    });

    $('#form-3').find(":input:not(:submit, :button)").each(function() {
        if (this.name != "_csrf") {
            $newForm.append($("<input type=\"hidden\" />")  
                .attr('name', this.name)   
                .val($(this).val())  
            );
        }
    });

    $newForm.appendTo(document.body).submit();
}



function changePage(count, direction, size) {
    // if (count == 0)
    //     $('#btn-prev').addClass('d-none');

    // percent = (count * 100) / size;
    // $('.progress-bar').css("width", percent + '%');

    if (direction == "next") {
        $('#slide-' + count).addClass('half__slide--d-none');
        $('#slide-' + (count + 1)).removeClass('half__slide--d-none');
    } else {
        $('#slide-' + (count + 2)).addClass('half__slide--d-none');
        $('#slide-' + (count + 1)).removeClass('half__slide--d-none');
    }
}


/*
*    Scroll function
*/
$(window).scroll(function() {
    showScrollToggle();

    if ($(document).scrollTop() > 200){
        $('.header-spacing').addClass('header-spacing--scroll');
        $('.header').addClass('header--scroll');
    } else{
        $('.header-spacing').removeClass('header-spacing--scroll');
        $('.header').removeClass('header--scroll');
    }	
});


/*
*  Function:   Show Scroll toggle on scroll down
*  Input:      window location
*  Output:     Show / Hide scroll toggle
*/ 
function showScrollToggle() {
    var self = $(this),
		height = 250,
        top = self.scrollTop(),
        button = $('.scroll-to-top');
    displayTop = top;	
			
	if (displayTop > height){		
		if (!button.is(':visible')){
			button.css('bottom', '0%');
			button.show();
			button.animate({bottom: '5%'}, 300);
		}			
	} else{		
		button.fadeOut();
	}	
}




$(document).on('click', '.timetable__activity--day', function(e) {
    var selectedDate = $(this).text();

    updateActivityTimetable(selectedDate);
});

$('.timetable__activity--week').on('change', function(e) {
    var selectedDate = $(this).val();

    updateActivityTimetable(selectedDate);
});


$(document).on('click', '.timetable__facility--day', function(e) {
    var selectedDate = $(this).text();

    updateFacilityTimetable(selectedDate);
});


$('.timetable__facility--week').on('change', function(e) {
    var selectedDate = $(this).val();

    updateFacilityTimetable(selectedDate); 
});

function updateActivityTimetable(selectedDate) {
    $.ajax({
        url: '/ajax/activities/timetable',
        type: 'POST',
        data: {
            'date': selectedDate
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);
            replaceHeader('timetable__activity', selectedDate, data);
            replaceOutput('timetable__activity', data);
        },
        error: function(error) {
            alert(error);
        }
    });
}

function updateFacilityTimetable(selectedDate) {
    $.ajax ({
        url: '/ajax/facility/timetable',
        type: 'POST',
        data: {
            'id': $('.timetable__id').attr('id'),
            'date': selectedDate
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);
            replaceHeader('timetable__facility', selectedDate, data);
            replaceOutput('timetable__facility', data);
        },  
        error: function(error) {
            alert(error);
        }
    });
}


function replaceHeader(className, selectedDate, data) {
    currentDate = new Date(selectedDate);

    var week = new Array(); 
    currentDate.setDate((currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() == 0 ? -6 : 1)));
    for (var i = 0; i < 7; i++) {
        week.push(new Date(currentDate).toDateString()); 
        currentDate.setDate(currentDate.getDate() +1);
    }

    currentDate = new Date(selectedDate);
    var today = (currentDate.getDay() + (currentDate.getDay() == 0 ? 6 : -1));

    var $newTable = $("<table class=\"timetable__table timetable__table--border " + className + "\"></table>");

    var row = "<tr class=\"table__header\">";
    for (var i = 0; i < week.length; i++) {
        if (i == today) {
            row += "<th class=\"" + className + "--day header__item header__item--selected\">" + week[i] + "</th>";
        } else {
            row += "<th class=\"" + className + "--day header__item hvr-inset\">" + week[i] + "</th>";
        }
    }
    row += "</tr>"

    $newTable.append(row);

    $('.' + className).replaceWith($newTable);
}



function replaceOutput(className, data) {
    var $newTable = $("<table class=\"timetable__table " + className + "--output\"></table>");
    $newTable.append(`
        <tr class="table__header">
        <th class="header__item header__item--time">Time</th>
        <th class="header__item header__item--activity">Activity</th>
        <th class="header__item header__item--duration">Duration</th>
        <th class="header__item header__item--location">Location</th>
        <th class="header__item header__item--book"></th>
        </tr>
    `);

    $.each(data.results, function(key, value) {
        row = "<tr class=\"table__row\"><td class=\"row__item start_time-value\"  data_attr=\"" + value.start_time + "\">" + value.start_time.substr(value.start_time.length - 8) + "</td>";
        row += "<td class=\"row__item activity-value\">" + value.name_sport + "</td>";
        row += "<td class=\"row__item duration-value\">" + value.duration + " Minutes</td>";
        row += "<td class=\"row__item location-value\">" + value.facility_name + "</td>";
        row += "<td class=\"row__item\"><div id=\"" + value.id + "\" class=\"item__book item__book--book-modal hvr-sweep-to-right modal--open\"><h3>Book</h3></div></td></tr>";
        $newTable.append(row);
    });

    $('.' + className + '--output').replaceWith($newTable);
}