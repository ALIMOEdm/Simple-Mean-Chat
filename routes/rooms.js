var roomCtrl = require('../app_server/controllers/rooms')();
var mongoose = require('mongoose');
var Room = mongoose.model('Room');

module.exports = function(app){
    app.route('/room')
        .post(roomCtrl.create)
        .get(roomCtrl.getAll);
    app.route('/chat/room/:room/messages')
        .get(roomCtrl.getMessages);

    app.param('room', function(req, res, next, uniq){
        var query = Room.findOne({
            uniq: uniq
        });

        query.exec(function(err, room){
            if(err){
                console.log(err);
                return res.status(400).send({msg: 'error'});
            }
            if(!room){
                return res.status(400).send({msg: 'Can not find post'});
            }

            req.room = room;

            return next();
        });
    });
};
