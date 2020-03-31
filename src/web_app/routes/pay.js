const express = require('express');
const router = express.Router();
var payment = require('../modules/payment');
var error = require('../modules/error');

var stripe = require('stripe')('sk_test_6QysuydtyRi7yOTPx9c2dtBf000bOnLDIM');

// Website header
const webname = ' The Edgy ';

 /*
  * Function returnes stripe API public key
 */
router.get("/stripe-key", function(req, res){
    res.send({ publishableKey: "pk_test_M2OkvXhkSGXf5hSxOXXFuJn400HaRqhZZc" });
});

const calculateOrderAmount = function(items){
    // Replace this constant with a calculation of the order's amount
    // You should always calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1500;
};


/*
 * Function is used to process payment, given the required parameters.
*/
router.post("/pay", async function(req, res){
    const { paymentMethodId, paymentIntentId, items, currency, useStripeSdk } = req.body;

    //items are a collection of activity Id's
    const orderAmount = calculateOrderAmount(items);

    //userId is stored in the session.
    var userId = req.session.userId;

    try {
        let intent;
        if (paymentMethodId) {
        
            // Create new PaymentIntent with a PaymentMethod ID from the client.
        intent = await stripe.paymentIntents.create({
            amount: orderAmount,
            currency: currency,
            payment_method: paymentMethodId,
            confirmation_method: "manual",
            confirm: true,
            
            // If a mobile client passes `useStripeSdk`, set `use_stripe_sdk=true`
            // to take advantage of new authentication features in mobile SDKs
            use_stripe_sdk: useStripeSdk,
            receipt_email: "sc18at@leeds.ac.uk"
        });
        
        // After create, if the PaymentIntent's status is succeeded, fulfill the order.
        } else if (paymentIntentId) {
            
            // Confirm the PaymentIntent to finalize payment after handling a required action
            // on the client.
            intent = await stripe.paymentIntents.confirm(paymentIntentId);
            
            // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
        }
        
        // Render response
        var result = generateResponse(userId, intent);

        // Return result
        res.send(result);
        

    } catch (e) {

        // Handle "hard declines" e.g. insufficient funds, expired card, etc
        res.send({ error: e.message });
    }
});

/*
 * Function is used to decide on the action required in different cases of payment.
*/
const generateResponse = function(userId, intent){

    // Generate a response based on the intent's status
    switch (intent.status) {

        case "requires_action":
        case "requires_source_action":
            // Card requires authentication
            return {
                requiresAction: true,
                clientSecret: intent.client_secret
            };

        case "requires_payment_method":
        case "requires_source":
            // Card was not properly authenticated, suggest a new payment method
            return {
                error: "Your card was denied, please provide a new payment method"
            };


        ////////// Success

        case "succeeded":
            
            // Payment is complete, authentication not required
            console.log("💰 Payment received!");

            //activityId has to be passed from the front end, not done yet
            var activityId = 1;

            // Pick membership pricing with id 1, which is now Monthly swimming for 20 quid
            var pricingId = 1;

            //stripe's card ID can be used? placeholder for now
            var cardId = 1;
            
            // ****** Membership payment ********
            payment.processMembershipPayment(pricingId, userId, cardId).then(function(paymentId){

                // Success redirect here
                console.log("Membership Payment id received: " + paymentId);
                return {status: true, body: paymentId};

            // Error catch
            }).catch(function(err){
                
                return {status: false, body: err};
            });

            /*
                // ****** Booking payment ********
                payment.processBookingPayment(res, req, webname, activityId, userId, cardId).then(function(paymentId){

                    // Success redirect here
                    console.log("Payment id received: " + paymentId);

                // Error catch
                }).catch(function(err){

                    error.defaultError(res, req, webname, err);
                });
            */

            return { clientSecret: intent.client_secret };
    }
};


module.exports = router;