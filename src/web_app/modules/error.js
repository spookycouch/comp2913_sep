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