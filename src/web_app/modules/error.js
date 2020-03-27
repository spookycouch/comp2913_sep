var path = require('path');

const webname = ' The Edgy ';

/*
 *  Function:   Renders login page with errors
*/
exports.loginErrorPage = function(req, res, webname, err){

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
 *  Function:   Render employee registration page with errors
*/
exports.registerEmployeeErrorPage = function(req, res, webname, user, err) {

    user.getDetails(req.session.userId).then(function(result){
        res.render(path.join(__dirname + '/../views/pages/manager/employee_new.ejs'), {
            title: webname + "| Register | Employee",
            session: req.session,
            csrfToken: req.csrfToken(),
            error: err,
            form: req.body,
            user: result
        });
    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    })   
}


/*
 *  Function:   Renders new facility creation page with errors
*/
exports.newFacilityErrorPage = function(req, res, webname, user, icons, err) {

    user.getDetails(req.session.userId).then(function(result) {
        return res.render(path.join(__dirname + '/../views/pages/manager/facilities_new.ejs'), {
            title: webname + "| Facilities | New",
            session: req.session,
            csrfToken: req.csrfToken(),
            user: result,
            icons: icons,
            error: err
        });

    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    }); 
}


/*
 *  Function:   Render new activity creation page with errors
*/
exports.newActivityErrorPage = function(req, res, webname, user, facility, err) {
    user.getDetails(req.session.userId).then(function(result) {
        facility.getAllFacilities().then(function(facilities) {
            facility.getAllSports().then(function(sports) {
                return res.render(path.join(__dirname + '/../views/pages/manager/activities_new.ejs'), {
                    title: webname + "| Activities | New",
                    session: req.session,
                    csrfToken: req.csrfToken(),
                    user: result,
                    facilities: facilities,
                    sports: sports,
                    error: err
                });
            }).catch(function(err) {
                module.exports.defaultError(req, res, webname, err);
            });

        }).catch(function(err) {
            module.exports.defaultError(req, res, webname, err);
        });
    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    })
}


/*
 *  Function:   Render update login details page with errors
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
// TODO: IMPLEMENT ERRORS WITHIN THE MODAL - FOR SAM
 *  Function:  Render Create card payment option with errors 
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
                form: req.body,
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


exports.cashPaymentError = function(req, res, webname, user, facility, err) {
    user.getDetails(req.session.userId).then(function(result) {
        facility.getAllActivities().then(function(activities) {
            return res.render(path.join(__dirname + '/../views/pages/account/account-cash-payment.ejs'), {
                title: webname + "| Account | Payments | Cash",
                session: req.session,
                csrfToken: req.csrfToken(),
                user: result,
                activities: activities,
                error: err
            });

        }).catch(function(err) {

            module.exports.defaultError(req, res, webname, err);
        });
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