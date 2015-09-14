var mongoose = require('mongoose'),
    Room = mongoose.model('Room');

module.exports = function(){
    return {
        create: function(req, res, next){
            var room = new Room(req.body);
            room.save(function(err, room){
                if(err){
                    return next(err);
                }

                res.send(room);
            });
        },

        getAll: function(req, res, next){
            Room.find(function(err, rooms){
                if(err){
                    return next(err);
                }

                res.send(rooms);
            });
        }
    }
};