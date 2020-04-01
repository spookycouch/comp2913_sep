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
*       document load function (on ready)
*/
$(document).ready(function() {
    // Variables 
    var hamburgerPressed = false; // Menu dropdown toggle
    var registertoggle = false;   // login / registration page toggle (for switching pages)
    var accountToggle = false;    // Account side-bar toggle
    var pageCount = 0;            // Registration current page


    /*
    *  For switching between pages of the selector item class
    */
    $('.selector__item').on('click', function(e) {
        $('.selector__item').removeClass('selector__item--selected');   // remove selected class for all items
        $(this).addClass('selector__item--selected');                   // add selected class to current selected item

        $('.selector__item').each(function(key, value) {
            var target = $(this).attr('target');
            $('#' + target).css('display', 'none');                     // Set all targets to be hidden
        });

        var target = $(this).attr('target');
        $('#' + target).css('display', 'flex');                         // Only show the selected target
    });


    /*
    *  Add shake affect to form inputs
    */
    if ($('.update-form__error')[0]) {                                      // Check that an error exists within the form
        errors = ['name', 'surname', 'email', 'phone', 'birth',
                    'address_1', 'address_2', 'city', 'zipcode', 
                    'current_password', 'password', 'confirm_password', 
                    'price', 'description', 'icon', 'image',
                    'cost', 'date', 'time', 'discount', 'duration',
                    'activity_id', 'amount', 'usr_email', 'rcpt_email'];

        $.each(errors, function(key, value) {
            if ($('#' + value + '-error')[0]) {                             // Find the error that exists
                $('#' + value).addClass('wobble-horizontal');               // Add the shake effect 
            }
        });
    }


    /*
    *  Automatically open the modal and apply shake affects on errors
    */
    if ($('.modal--open-auto')[0]) {                                        // Check if an error exists 
        errors = ['card_number', 'expire_date', 'cvv', 'type'];

        $('.modal--modal').css('display', 'flex');                          // Show the modal

        $.each(errors, function(key, value) {                               
            if ($('#' + value + '-error')[0]) {                             // Find the error that exists
                $('#' + value).addClass('wobble-horizontal');               // Add the shake effect
            }
        });
    }


    /*
    *  Set the default icon of the icon picker
    */
    if ($('.update-form__icon')[0]) {
        $('.update-form__icon--' + $('#icon').val().replace('-white', '')).addClass('update-form__icon--selected');
    }


    /*
    *  Icon selection on facilities form; change Icon on selection
    */
    $('.update-form__icon').on('click', function(e) {
        $('#icon').val($(this).attr('data_attr') + "-white");               // Set the input to the selected icon's value
        $('.update-form__icon').removeClass('update-form__icon--selected'); // Remove selected class for all icons (clear)
        $(this).addClass('update-form__icon--selected');                    // Apply selected class to the selected icon
    })


    /*
    *  Slick configuration (for carousel)
    */
    $(".reviews__carousel").slick({
        autoplay: true,
        autoplaySpeed: 3000, // Speed of automatically sliding 
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
        e.preventDefault();                                                 // Prevent from being submitted (and page reloading)
        hamburgerPressed = !hamburgerPressed;

        if (hamburgerPressed) {
            $('.hamburger').addClass('is-active');

            $('.header__dropdown').css('display', 'block').animate({        // Show the header (open)
                backgroundColor: 'rgba(0, 0, 0, .6)'
            })
            $('.dropdown__container').addClass('dropdown__container--open');

        } else {
            $('.hamburger').removeClass('is-active').css('position', 'static');

            $('.header__dropdown').animate({                                // Hide the header (close)
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }, function() {
                $('.header__dropdown').css('display', 'none');              // remove display property to hide
            });
            $('.dropdown__container').removeClass('dropdown__container--open');
        }
    });


    /*
    *  Transition from login to registration form (and vise-versa)
    */ 
    $('.half__form-transition-header, .half__bottom-link--transition').on('click', function(e) {
        registertoggle = !registertoggle

        if (registertoggle) {                                   // Show the registration form / Hide login form
            $('.login__half--login').css('display', 'none');
            $('.login__half--register').css('display', 'flex');
            $('.form-transition-header__text').text("Login");
        } else {                                                // Show the login form / Hide the registration form
            $('.login__half--login').css('display', 'flex');
            $('.login__half--register').css('display', 'none');
            $('.form-transition-header__text').text("Register");
        }
        
        e.preventDefault();                                     // Prevent form submission                  
    })  


    /*
    *  Scroll up function
    */ 
    $('.scroll-to-top').on('click', function(e) {
		$('html, body').animate({scrollTop: 0}, 500);   // Show the scroll-top button
		e.preventDefault();                             // Prevent the button from being submitted 
    });    



    /*
    *  Open the side bar on the accounts pages 
    */ 
    $('.account__side-open').on('click', function(e) {
        accountToggle = !accountToggle;

        if (accountToggle) {                                                // Open
            $('.account__side-bar').addClass('account__side-bar--open');
            $('.label__expand').text("Collapse");
        } else {                                                           // Closed
            $('.account__side-bar').removeClass('account__side-bar--open');
            $('.label__expand').text("Expand");
        }
    });


    /*
    *  Remove animation after animation complete (for shake animation)
    */  
    $('.login-form__input').on(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function() {
            $(this).removeClass("wobble-horizontal");
        }
    );


    /*
    *  Open all Modals (default class)
    */ 
    $(document).on('click', '.modal--open', function(e) {
        $('.modal--modal').css('display', 'flex');
    });


    /*
    *  Open only delete modals (for confirmation)
    */ 
    $('.modal--open-delete').on('click', function(e) {
        $('.modal--delete').css('display', 'flex');
    });


    /*
    *  Close all modals 
    */ 
    $('.modal--close').on('click', function(e) {
        $('.modal').fadeOut();
    });


    /*
    *  If they click off the modal (anywhere outside it), close it
    */ 
    $('.modal').on('click', function(e) {
        var target = $('.modal');

        if (e.target.className.split(" ")[0] == 'modal') {  // Check its not the modal itselef
            target.fadeOut();
        }
    });


    // #### Setting the URL of the delete modals so when pressed they redirect to the specific delete route ####
    /*
    *  URL of the delete-membership modal
    */ 
    $('.content__explore--delete-membership').on('click', function(e) {
        $('#delete-membership').attr('href', '/delete/memberships/' + this.id);
    });


    /*
    *  URL of the delete-payment modal
    */ 
    $('.content__explore--delete-payment').on('click', function(e) {
        $('#delete-payment').attr('href', '/delete/cards/' + this.id);
    });

    $('.form-title__book--delete-facility').on('click', function(e) {
        $('#delete-facility').attr('href', '/delete/facility/' + this.id);
    });

    $('.form-title__book--delete-activity').on('click', function(e) {
        $('#delete-activity').attr('href', '/delete/activity/' + this.id);
    });


    // #### Setting the contents of the book modals, such that they show the bookings ####
    /*
    *  Set the content of the 'My Bookings' modal 
    */ 
    $('.overview__option--qr-modal').on('click', function(e) {
        $('#sportName').text($(this).find('.sportName-value').text());
        $('#start_time').text($(this).find('.start_time-value').text());
        $('#duration').text($(this).find('.duration-value').text());
        $('#status').text($(this).find('.status-value').text());
        $('#qr').attr('src', $(this).attr('attr_qr'));
        $('#delete-booking').attr('href', '/delete/booking/' + $(this).attr('attr_id'));

    });


    /*
    *  Set the content of the booking modal (for a new booking)
    */ 
    $(document).on('click', '.item__book--book-modal', function(e) {
        $('#activity').text($(this).parent().parent().find('.activity-value').text());
        $('#start_time').text($(this).parent().parent().find('.start_time-value').attr('data_attr'));
        $('#duration').text($(this).parent().parent().find('.duration-value').text());
        $('#location').text($(this).parent().parent().find('.location-value').text());

        $('#book-activity').attr('href', '/payment/booking/' + this.id); // TODO: add router route
    });



    /*
    *  Function:   Register form (subform 1) Submit AJAX Request 
    *  Input:      Request Body
    *  Output:     Success/Error function
    */  
    $('#form-1').submit(function(e) {
        var errorIds = ['name-error', 'surname-error', 'email-error', 'password-error', 'confirm_password-error'];
        $.each(errorIds, function(key, value) { // Clear the errors each time the form is submitted
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
        $.each(errorIds, function(key, value) { // Clear the errors each time the form is submitted
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
        $.each(errorIds, function(key, value) { // Clear the errors each time the form is submitted 
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
                    combineForms(); // Combine all forms data and submit
                }
            },
            error: function(error) {
                alert(error);
            }   
        });

        e.preventDefault();
    });


    /*
    *  Function:   Call to subform 3 to submit all forms 
    */
    $('#form-4').submit(function(e) {
        $('#form-3').submit();
        e.preventDefault();
    });


    /*
    *  Function:   Return to the previous form
    *  Input:      The current page count
    *  Output:     The new page count 
    */
    $('.login-form__btn--return').on('click', function(e) {
        pageCount--;
        changePage(pageCount, "back", 2);
    });



    $(document).on('click', '.image__delete--facility', function(e) {
        facilityId = $(this).attr('facility_attr');

        $.ajax({
            url: '/ajax/delete/image/facility',
            type: 'POST',
            data: {
                'imageId': $(this).attr('image_attr'),
                'facilityId': facilityId
            },
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);

                var $newImages = $("<div id=\"image-container\"></div>")

                var row = ""
                $.each(data.results, function(key, value) {
                    row += "<div class=\"update-form__image\">";
                    row += "<span class=\"image__delete image__delete--facility \" image_attr=\"" + value.id + "\" facility_attr=\"" + facilityId + "\" ><h2>×</h2></span>";
                    row += "<img src=\"/uploads/" + value.id + "." + value.ext + "\" />";
                    row += "</div>";
                });
                $newImages.append(row);
                
                $('#image-container').replaceWith($newImages);

            },
            error: function(error) {
                alert(error);
            }
        });
    });


    $(document).on('click', '.image__delete--activity', function(e) {
        activityId = $(this).attr('activity_attr');

        $.ajax({
            url: '/ajax/delete/image/activity',
            type: 'POST',
            data: {
                'imageId': $(this).attr('image_attr'),
                'activityId': activityId
            },
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);

                var $newImages = $("<div id=\"image-container\"></div>")

                var row = ""
                $.each(data.results, function(key, value) {
                    row += "<div class=\"update-form__image\">";
                    row += "<span class=\"image__delete image__delete--activity \" image_attr=\"" + value.id + "\" activity_attr=\"" + activityId + "\" ><h2>×</h2></span>";
                    row += "<img src=\"/uploads/" + value.id + "." + value.ext + "\" />";
                    row += "</div>";
                });
                $newImages.append(row);
                
                $('#image-container').replaceWith($newImages);

            }, 
            error: function(error) {
                alert(error);
            }
        });
    });



    $('#card-select').on('change', function(e) {
        $.ajax({
            url: '/ajax/update/payment',
            type: 'POST',
            data: {cardId: $(this).val()},
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);

                console.log(data);

                var $payments = $("<div class=\"account__section account__section--full-width account__details\" id=\"payment-history\"></div>")

                if (data.results.length > 0) {
                    $payments.append(`
                        <div class="section__title">
                            <h2>Your Payment History</h2>
                        </div>
                    `);

                    var payment = "";
                    $.each(data.results, function(key, value) {
                        payment += `
                            <div class="details__content">
                                <div class="content__form-title content__form-title--top">
                                    <div class="form-title__title">
                                        <h2>Payment No. ${value.id}</h2>
                                    </div>
                    
                                    <div class="form-title__desc">
                                        ${value.activity_name}
                                    </div>

                                    <div class="form-title__book hvr-sweep-to-right">
                                        <a href="/user/account/payment/receipt?payment_id=${value.id}" target="_blank">
                                            <h3>Show Reciept</h3>
                                        </a>
                                    </div>
                                </div>

                                <div class="content__list">
                                    <div class="list__field">
                                        <div class="field__field">
                                            <img src="/img/icons/clock.png" />
                                            <h3>Purchase Date:</h3>
                                            <span>${value.purchase_date}</span>
                                        </div>

                                        <div class="field__field">
                                            <img src="/img/icons/discount.png" />
                                            <h3>Amount Cost:</h3>
                                            <span>£${value.amount}</span>
                                        </div>

                                        <div class="field__field">
                                            <img src="/img/icons/pay.png" />
                                            <h3>Payment Method:</h3>
                                            <span>${value.type} ending in ${value.number}</span>
                                        </div>
                                    </div>
                                </div>
                    
                                <div class="content__form-title content__form-title--side">
                                    <div class="form-title__title">
                                        <h2>Payment No. ${value.id}</h2>

                                    </div>
                    
                                    <div class="form-title__desc">
                                        ${value.activity_name}
                                    </div>

                                    <div class="form-title__book hvr-sweep-to-right">
                                        <a href="/user/account/payment/receipt?payment_id=${value.id}" target="_blank">
                                            <h3>Show Reciept</h3>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `
                    }); 

                    $payments.append(payment);
                }

                console.log($payments.html());

                $('#payment-history').replaceWith($payments);
            },
            error: function(error) {
                alert(error);
            }
        });
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


/*
    *  Function:   Change the current page of the form
    *  Input:      int count:        the current page the form is on
    *              string direction: 'prev' or 'next' for which page to go to
    *              int size:         how many pages are in the form 
    *  Output:     The new page count / the page the form is on
    */
function changePage(count, direction, size) {
    if (direction == "next") {
        $('#slide-' + count).addClass('half__slide--d-none');
        $('#slide-' + (count + 1)).removeClass('half__slide--d-none');
    } else {
        $('#slide-' + (count + 2)).addClass('half__slide--d-none');
        $('#slide-' + (count + 1)).removeClass('half__slide--d-none');
    }
}



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

    if (data.results.length > 0) {
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
    } else {
        $newTable.append(`
            <tr class="table__row">
                <td class="row__item row__item--none">No Activities Found on Selected Date</td>
            </tr>
        `)
    }

    $('.' + className + '--output').replaceWith($newTable);
}