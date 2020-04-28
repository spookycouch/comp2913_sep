// A reference to Stripe.js
var stripe;

// Disable the button until we have Stripe set up on the page
document.querySelector(".submit-payment").disabled = true;


var handleAction = function(clientSecret) {
  stripe.handleCardAction(clientSecret).then(function(data) {

    if (data.error) {
      showError("Your card was not authenticated, please try again");

    } else if (data.paymentIntent.status === "requires_confirmation") {

      fetch("/pay/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          paymentIntentId: data.paymentIntent.id
        })
      })
        .then(function(result) {
          return result.json();
        })
        .then(function(json) {
          if (json.error) {
            showError(json.error);
          } else {
            orderComplete(clientSecret);
          }
        });
    }
  });
};

/*
 * Collect card details and pay for the order
 */

function sendPayment(){

  //activity ID is stored here
  var queryString = window.location.pathname.split("/");

  //csrf token
  var csrfToken = document.getElementsByName("_csrf")[0].value;

  var cardId = window.location.href.split("card=")[1];

  var orderData = {
    item: { 
      type : queryString[queryString.length -2],
      id: queryString[queryString.length -1] 
    },
    currency: "gbp",
    cardId: cardId
  };

  fetch("/pay/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(orderData)
  }).then(function(result) {
    return result.json();
  }).then(function(response) {

    if (response.error) {
      showError(response.error);

    } else if (response.requiresAction) {

    // Request authentication
    //handleAction(response.clientSecret);

    } else {
      orderComplete(response.clientSecret);
    }
  });
}


/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {

    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

    document.querySelector(".sr-payment-form").classList.add("hidden");
    document.querySelector("pre").textContent = paymentIntentJson;

    // CALL AJAX HERE TO PROCESS PAYMENT

    changeLoadingState(false);
  });
};

var showError = function(errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
