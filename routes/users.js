
var passport = require('passport');

module.exports = function(app, passport){
    var userCtrl = require('../app_server/controllers/user')(passport);

    app.get('/auth/user/me', userCtrl.me);
    app.post('/auth/user/register', userCtrl.create);
    app.post('/auth/user/login', userCtrl.login);
    app.get('/auth/user/logout', userCtrl.logout);
    app.get('/auth/user/loggedin', userCtrl.loggedin);
    app.post('/auth/user/activate', userCtrl.activateUser);
    app.post('/auth/user/resendactivateemail', userCtrl.resendActivateEmail);
};
