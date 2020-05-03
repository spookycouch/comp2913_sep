
var membershipToggle = false; // Membership selected toggle
var cardToggle = false;
var paymentCount = 0;         // Payment current page
var optionId = 0;


$(document).ready(function() {
    //Display the default card

    if ($('#refresh-membership-auto')[0]) {
        displayMembership($('.membership__sport').val());
    }    


    $('.membership__sport').on('change', function(e) {
        displayMembership($(this).val());
    });


    $('.payment__card').on('change', function(e) {
        displayCard($(this).val());
    });


    $('.details__card--selectable').on('click', function(e) {
        membershipToggle = !membershipToggle;

        if (membershipToggle) 
            enableButton();
        else 
            disableButton();
        
        e.preventDefault();
    });


    $('#card-select.details__card--selectable').on('click', function(e) {

        cardToggle = !cardToggle;

        if (cardToggle) {
            enablePayment();
        } else {
            disablePayment();
        }  
    });


    $('.inline__button--next').on('click', function(e) {
        e.preventDefault();

        disableButton();

        paymentCount++;
        changePage(paymentCount, "next", 2);

        $('.total__content').removeClass('total__content--d-none');
        $('.total__total--default').addClass('total__total--d-none');
        $('.total__total--order').removeClass('total__total--d-none');
    });


    $('#membership-next').on('click', function(e) {
        e.preventDefault();
        window.history.pushState({option: optionId}, '', '?option=' + optionId);
    })

    $('#booking-next').on('click', function(e) {
        e.preventDefault();
        window.history.pushState({page: 2}, '', '?page=2');
    });


    $('.edit__slide').on('click', function(e) {
        disableButton();
        disablePayment();
        $('.total__content').addClass('total__content--d-none');
        $('.total__payment').addClass('total__payment--d-none');
        $('.total__total--default').removeClass('total__total--d-none');
        $('.total__total--order').addClass('total__total--d-none');
        $('.total__pay').addClass('total__pay--d-none');

        target = $(this).attr('target_slide');
        paymentCount = Number(target) - 1;
        changePage(paymentCount, "prev", 2);
    })
});


function disableButton() {
    membershipToggle = false;
    $('.details__card').removeClass('details__card--selected');
    $('.inline__button--disabled').removeClass('inline__button--d-none');
    $('.inline__button--next').addClass('inline__button--d-none');
}

function enableButton() {
    membershipToggle = true;
    $('.details__card').addClass('details__card--selected');
    $('.inline__button--disabled').addClass('inline__button--d-none');
    $('.inline__button--next').removeClass('inline__button--d-none');
}


function enablePayment() {
    cardToggle = true;
    $('.total__payment').removeClass('total__payment--d-none');
    $('.total__pay').removeClass('total__pay--d-none');
}

function disablePayment() {
    cardToggle = false;
    $('.total__payment').addClass('total__payment--d-none');
    $('.total__pay').addClass('total__pay--d-none');
}


function displayCard(cardId) {

    disableButton();
    disablePayment();

    $.ajax({
        url: '/ajax/get/card',
        method: 'POST',
        data: {
            'cardId': cardId
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);

            if (data.error) {
                // do something when there is an erorr

                console.log(data.error);
            } else {
                console.log(data.results);

                $('#card-type, #order-payment').text(data.results.type + " ending in " + data.results.number);
                $('#card-expire').text(data.results.expire_date);
            }
        },
        error: function(error){
            alert(error);
        }
    });
}


function displayMembership(pricingId) {
    disableButton();

    // get the sport description, price, name, saving etc and display this information

    $.ajax({
        url: '/ajax/get/pricing',
        method: 'POST',
        data: {
            'pricingId': pricingId
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);

            if (data.error) {
                $('.details__card--selectable').addClass('details__card--d-none');
                $('.details__card--empty').removeClass('details__card--d-none');

                console.log(data.error);
            } else {
                updateMembershipDetails(data.results, paymentCount);
                optionId = data.results.id;
            }
        },
        error: function(error) {
            alert(error);
        }
    });
}



function updateMembershipDetails(data) {
    $('.details__card--empty').addClass('details__card--d-none');
    $('.details__card--selectable').removeClass('details__card--d-none');

    $price = $("<div></div>").attr({id: "membership-price", class: "content__price"});

    var title = "";

    if (data.type == 1) {
        title = "Monthly " + data.name + " Membership";
        $price.append("<p>Billed at £" + data.amount + " per month</p>");
        $('#order-plan, #order-total').text("£" + data.amount + " p/m");
    } else if (data.type == 2) {
        title = "Annual " + data.name + " Membership";
        $price.append("<p>Billed at £" + data.monthly + " annually</p>");
        $price.append("<p>- £" + data.savings + " for annual savings</p>");
        $price.append("<p>Total billed at £" + data.amount + " annually</p>");
        $('#order-plan').text("£" + data.monthly + " p/y");
        $('#order-savings').text("£" + data.savings);
        $('#order-total').text("£" + data.amount + " p/y");

    } else {
        title = "Annual Sports Pass Membership"
        $price.append("<p>Billed at £" + data.amount + " annually</p>");
        $('#order-plan, #order-total').text("£" + data.amount + " p/y");
    }

    $('#item-title').text(title);
    $('#membership-type').text(title);
    $('#order-type').text(title);



    $('#membership-description').text(data.description);
    
    $price.append("<p class=\"price__last\">Option to renew automatically</p>");
    $('#membership-price').replaceWith($price);
} 
