const express = require('express');
const router = express.Router();
var user = require('../modules/user');
var facility = require('../modules/facility');
var db = require('../modules/db.js');
var payment = require('../modules/payment');
var error = require('../modules/error');

var stripe = require('stripe')('sk_test_6QysuydtyRi7yOTPx9c2dtBf000bOnLDIM');

// Website header
const webname = ' The Edgy ';

//the part of the url representing the payment for the activity
const activityPaymentPart = 'booking';

//the part of the url representing the payment for the membership
const membershipPaymentPart = 'membership';


 /*
  * Function returnes stripe API public key
 */
router.get("/stripe-key", function(req, res){
    res.send({ publishableKey: "pk_test_M2OkvXhkSGXf5hSxOXXFuJn400HaRqhZZc" });
});

 /*
  * Function returnes stripe API public key
 */
router.post("/setup-intent", async function(req, res){

    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        //getting the user object to update stripe cards.
        user.getDetails(req.session.userId).then(async function(userObj){

            //Creating a new stripe customer, if user did't have a stripe token.
            if(userObj.stripe_token == ''){
                const stripeCustomer = await stripe.customers.create({
                    email: userObj.email,
                    name: userObj.name,
                });

                stripeCustomerId = stripeCustomer.id;
                user.updateStripeToken(userObj.id, stripeCustomerId);


            }else{

                stripeCustomerId = userObj.stripe_token;
            }
            const intent =  await stripe.setupIntents.create({
                customer: stripeCustomerId,
                usage: "on_session"
            });
            res.send({clientSecret: intent.client_secret });
        });
    }
});

const calculatePrice = async function(item){
    // Replace this constant with a calculation of the order's amount
    // You should always calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client

    var amount = -1;

    try{
        if(item.type == membershipPaymentPart){
            if(item.id == 1){
                result = await facility.getMonthlyPricing();
                amount = result[0].amount;
    
            }else if(item.id == 2){
                result = await facility.getYearlyPricing();
                amount = result[0].amount;
    
            }else if(item.id == 3){
                result = await facility.getSportsPassPricing();
                amount = result[0].amount;
            }
        }else if(item.type == activityPaymentPart){
            console.log("activity");
            activities = await facility.getAllActivities();
            filter = activities.filter(activity => {
                return activity.id == item.id
            });
            console.log(filter);

            if(filter.length < 1){

                console.log("ERROR: Request with invalid activity id.");
                return -1;
            
            }else{

                let activity = filter[0];
                console.log("result");
                console.log(activity);
                amount = activity.cost;
            }
        }
        console.log(amount);
        //amount in cents
        return amount * 100;
    }catch(e){
        console.log(e.message);
        return -1;
    }
    
    
};


/*
 * Function is used to process payment, given the required parameters.
*/
router.post("/pay", async function(req, res){

    let {item, cardId} = req.body;
    console.log(item);
    console.log(cardId);
    var price = await calculatePrice(item);

    if(price < 1){
        //error occured
        res.send({ error: "Error in price processing" });
    }

    try {

        //userId is stored in the session.
        var userId = req.session.userId;

        var user = await db.getUserDetails(userId);

        var cards = await db.getUserCards(userId);

        var filter = cards.filter(card => {
            return card.id == cardId
            })

        if(filter.length < 1){
            res.send({ error: "No such card in a database" });
            console.log("ERROR: Request with invalid cardId.");
        }else{

            var card = filter[0];
            paymentMethodId = card.stripe_token;

        
            let intent;
            if (paymentMethodId) {
                
                console.log("START");
                // Create new PaymentIntent with a PaymentMethod ID from the client.
                intent = await stripe.paymentIntents.create({
                    amount: price,
                    currency: 'gbp',
                    payment_method_types: ['card'],
                    payment_method: paymentMethodId,
                    confirm: true,
                    customer: user.stripe_token,
                    
                    // If a mobile client passes `useStripeSdk`, set `use_stripe_sdk=true`
                    // to take advantage of new authentication features in mobile SDKs
                    use_stripe_sdk: true,
                    receipt_email: "sc18at@leeds.ac.uk"
                });

                console.log(intent);
            
            // After create, if the PaymentIntent's status is succeeded, fulfill the order.
            } 
            
            // Render response
            var result = generateResponse(userId, item, price, cardId, intent);
    
            // Return result
            res.send(result);
            
    
        }
    }catch (e) {
        console.log(e.message);
        // Handle "hard declines" e.g. insufficient funds, expired card, etc
        res.send({ error: e.message });
    }
    
});

/*
 * Function is used to decide on the action required in different cases of payment.
*/
const generateResponse = function(userId, item, price, cardId, intent){

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

            // ****** Membership payment ********
            if(item.type == membershipPaymentPart){
                payment.processMembershipPayment(item.id, userId, cardId).then(function(paymentId){

                    // Success redirect here
                    console.log("Membership Payment id received: " + paymentId);
                    return {status: true, body: paymentId};
    
                // Error catch
                }).catch(function(err){
                    
                    return {status: false, body: err};
                });
            }else if(item.type == activityPaymentPart){
                // ****** Booking payment ********
                payment.processBookingPayment(item.id, userId, cardId).then(function(paymentId){

                    // Success redirect here
                    console.log("Payment id received: " + paymentId);

                // Error catch
                }).catch(function(err){

                    error.defaultError(res, req, webname, err);
                });
            }

            return {status: true, clientSecret: intent.client_secret};
    }
};


module.exports = router;