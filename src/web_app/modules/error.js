var path = require('path');

const webname = ' The Edgy ';

/*
 *  Function:   Renders login page with errors
*/
exports.loginErrorPage = function (req, res, webname, err){

    // Render with error
    res.render(path.join(__dirname + '/../views/pages/login.ejs'),
    {
        title: webname + "| Login",
        error: err,
        form: req.body,
        csrfToken: req.csrfToken()
    });
}

/*
 *  Function:  Update user details
*/
exports.updateErrorPage = function(req, res, webname, user, err) {
    
    user.getDetails(req.session.userId).then(function(result) {

        // Render data
        res.render(path.join(__dirname + '/../views/pages/account/account-details.ejs'),
        {
            title: webname + "| Account | Details",
            session: req.session,
            user: result,
            error: err,
            csrfToken: req.csrfToken()
        });
        
    // Error
    }).catch(function(err) {
        
        module.exports.defaultError(req, res, webname, err);
    });
}

/*
 *  Function:  Update user details
*/
exports.cardPaymentErrorPage = function(req, res, webname, user, err) {
    
    user.getDetails(req.session.userId).then(function(result) {

        // Cards
        user.getCards(req.session.userId).then(function(cards){

            // Render
            res.render(path.join(__dirname + '/../views/pages/account/account-payment-details.ejs'),
            {
                title: webname + "| Account | Payment",
                session: req.session,
                user: result,
                cards: cards,
                error: err,
                csrfToken: req.csrfToken()
            });

        }).catch(function(err){

            module.exports.defaultError(req, res, webname, err);
        });
        
    // Error
    }).catch(function(err) {
        
        module.exports.defaultError(req, res, webname, err);
    });
}

/*
 *  Function:   Default redirect to error page with description
*/
exports.defaultError = function (req, res, webname, err){

    // Render with error
    res.render(path.join(__dirname + '/../views/pages/error.ejs'),
    {
        title: webname + "| Account | Payment",
        session: req.session,
        error: err,
        csrfToken: req.csrfToken()
    });
}