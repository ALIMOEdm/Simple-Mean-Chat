var mongoose = require('mongoose');
var User = mongoose.model('User');
var Room = mongoose.model('Room');
var ChatMessage = mongoose.model('ChatMessage');

module.exports = function(io){
    io.on('connection', function (socket) {
        socket.on('socketAuth', function (name, fn) {
            if(!name.user || !name.user.email){
                console.log('socketAuth', 'non user or email');
            }else{
                var socket_id = socket.id;
                var email = name.user.email;
                console.log('socketAuth work');
                User.findOne({
                    email: email
                })
                    .populate('rooms')
                    .exec(function(err, user){
                    if(err){
                        console.log('socketAuth', 'user not found');
                    }
                    if(!user){
                        console.log('socketAuth', 'user not found');
                    }
                    var old_soket_id = user.socketId;
                    user.socketId = socket_id;

                    var rooms = user.rooms;
                    for(var j = 0; j < rooms.length; j++){
                        console.log(rooms[j]);
                        var temp = [];
                        for(var k = 0; k < rooms[j].users.length; k++){
                            if(rooms[j].users[k].socketId == old_soket_id || rooms[j].users[k]._id == user._id){
                                continue;
                            }
                            temp.push(rooms[j].users[k]);
                        }
                        rooms[j].users = temp;
                        rooms[j].users.push(user);
                        socket.join(rooms[j].uniq);
                        rooms[j].save(function(err, room){
                        });
                    }

                    user.save(function(err, user){
                        if(err){
                            console.log('socketAuth', 'user save error');
                        }

                        //user.populate('rooms', function(err, user){
                        //    var rooms = user.rooms;
                        //
                        //    if(rooms && rooms.length){
                        //        for(var i = 0, n = rooms.length; i < n; i++){
                        //            console.log('socketAuth', rooms[i].uniq);
                        //            socket.join(rooms[i].uniq);
                        //        }
                        //    }
                        //})

                    });
                });
            }
            console.log(socket.id);
            console.log(name);
            console.log(fn);

        });


        socket.on('comeToRoom', function (name, fn) {
            var socket_id = socket.id;
            var room_uniq = name.room;
            console.log('comeToRoom', room_uniq);
            User.findOne({
                socketId: socket_id
            })
                .populate('rooms')
                .exec(function(err, user){
                    if(err){
                        console.log(err.message);
                        return;
                    }
                    if(!user){
                        console.log('none user');
                        return;
                    }

                    var rooms = user.rooms;
                    var contains = false;
                    for(var j = 0; j < rooms.length; j++){
                        if(rooms[j].uniq == room_uniq){
                            contains = true;
                            break;
                        }
                    }

                    if(!contains){
                        Room.findOne({
                            uniq: room_uniq
                        }).exec(function(err, room){
                            if(err){
                                console.log(err.message);
                                return;
                            }
                            if(!room){
                                console.log('none room');
                                return;
                            }

                            room.addUser(user);
                            room.save();
                            user.addRoom(room);
                            user.save(function(err, user){
                                //socket.join(room_uniq);
                                socket.to(room_uniq).emit('new_user', { some: 'data' });
                            });
                        });
                    }
                    else{
                        socket.to(room_uniq).emit('new_user', { some: 'data' });
                    }
            });
        });

        //new user message
        socket.on('sendMessage', function(name, fn){
            console.log('sendMessage:', name.message_object);
            if(!name.message_object){
                console.log('sendMessage: !name.message_object');
                return;
            }
            var message = name.message_object;

            var new_message = new ChatMessage();

            new_message.message = message.message;

            User.findOne({
                email: message.email
            }).exec(function(err, user){
                if(err){
                    console.log('sendMessage: user err');
                    return;
                }

                if(!user){
                    console.log('sendMessage: user not user');
                    return;
                }

                Room.findOne({
                    uniq: message.room
                }).exec(function(err, room){
                    if(err || !room){
                        return;
                    }

                    new_message.from = user;
                    new_message.room = room;

                    new_message.save(function(err, mess){
                        if(err){
                            return err;
                        }
                        console.log('sendMessage: ', room.uniq);
                        if(room.users.length){
                            for(var i = 0; i < room.users.length; i++){
                                (function(){
                                     console.log(room.users[i]);
                                    //socket.in(room.uniq).emit('sendMessage', {message: mess});
                                    if(io.sockets.connected[room.users[i].socketId]) {
                                        mess.user = user.name;
                                        io.sockets.connected[room.users[i].socketId].emit('sendMessage', {message: mess});
                                    }
                                })();
                            }
                        }
                        //io.sockets.connected[socket.id].emit('sendMessage', {message: mess});
                    })
                });
            });
        });//end sendMessage

        socket.on('getRoomMessages', function(name, fn){
            if(!name.room){
                console.log('getRoomMessages: none room');
                return;
            }

            Room.findOne({
                uniq: name.room
            }).exec(function(err, room) {
                if (err || !room) {
                    console.log('getRoomMessages: find room error');
                    return;
                }

                var rom_id = room._id;

                ChatMessage.find({
                    room: rom_id
                })
                    .sort({
                        createdAt: -1
                    })
                    .exec(function(err, mess){
                        if(err){
                            console.log('getRoomMessages: find ChatMessage error');
                            return;
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

                        io.sockets.connected[socket.id].emit('getRoomMessages', {messages: mess});
                        console.log(mess);
                    });
            });

        });//end getRoomMessages
    });
};