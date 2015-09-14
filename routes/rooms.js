var roomCtrl = require('../app_server/controllers/rooms')();

module.exports = function(app){
    app.route('/room')
        .post(roomCtrl.create)
        .get(roomCtrl.getAll);
};
