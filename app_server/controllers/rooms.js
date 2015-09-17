var mongoose = require('mongoose'),
    Room = mongoose.model('Room');
var User = mongoose.model('User');
var ChatMessage = mongoose.model('ChatMessage');

module.exports = function(){
    return {
        create: function(req, res, next){
            if(!req.user || !req.user._id){
                //console.log(err);
                return res.status(400).send({msg: 'Need authorization'});
            }

            var room = new Room(req.body);

            room.addUser(req.user);
            User.findOne({
                _id: req.user._id
            }).exec(function(err, user){
                if(err){
                    console.log(err);
                    return res.status(400).send({msg: 'error'});
                }
                if(!user){
                    console.log(err);
                    return res.status(400).send({msg: 'User not found'});
                }

                user.addRoom(room);
                room.save(function(err, room){
                    if(err){
                        console.log(err);
                        return res.status(400).send({msg: 'error'});
                    }

                    res.send(room);
                });

                user.save();

            });
        },

        getAll: function(req, res, next){
            if(!req.user || !req.user._id){
                //console.log(err);
                return res.status(400).send({msg: 'Need authorization'});
            }

            User.findOne({
                _id: req.user._id
            })
                .populate('rooms')
                .exec(function(err, user){
                    if(err){
                        console.log(err);
                        return res.status(400).send({msg: 'error'});
                    }
                    if(!user){
                        console.log(err);
                        return res.status(400).send({msg: 'User not found'});
                    }
                    console.log(user);

                    res.send(user.rooms);
                });

            //Room.find(function(err, rooms){
            //    if(err){
            //        return next(err);
            //    }
            //
            //    res.send(rooms);
            //});
        },
        getMessages: function(req, res, next){
            var room = req.room;

            ChatMessage.find({
                room: room._id
            })
                .sort({
                    createdAt: -1
                })
                .populate('from')
                .exec(function(err, mess){
                    if(err){
                        console.log('getMessages: find ChatMessage error');
                        return next(err);
                    }

                    mess.sort(function (a, b) {
                        if (a.createdAt > b.createdAt) {
                            return 1;
                        }
                        if (a.createdAt < b.createdAt) {
                            return -1;
                        }
                        // a должно быть равным b
                        return 0;
                    });

                    //io.sockets.connected[socket.id].emit('getRoomMessages', {messages: mess});
                    res.send({messages: mess});
                    console.log(mess);
                });
        }
    }
};