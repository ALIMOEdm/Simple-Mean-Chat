module.exports = function(app){
    var mainCtrl = require('../app_server/controllers/main');
    app.route('/')
        .get(mainCtrl.index);
};