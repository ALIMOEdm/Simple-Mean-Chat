module.exports = function(app, connection){
    var mainCtrl = require('../app_server/controllers/main')(connection);
    app.route('/')
        .get(mainCtrl.index);
};