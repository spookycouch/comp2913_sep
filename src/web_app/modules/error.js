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
        
    // Error -> logout
    }).catch(function(err) {
        res.redirect('/user/logout');
    });
}