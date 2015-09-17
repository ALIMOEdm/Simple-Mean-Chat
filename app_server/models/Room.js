var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    users: [{
        socketId: String
    }],
    uniq: String
});

RoomSchema.methods.addUser = function(socketId){
    this.users.push(socketId);
};

RoomSchema.pre('save', function(next){
    if(this.uniq){
        return next();
    }
    this.uniq = Math.random().toString(36).substring(4) + Math.random().toString(36).substring(4);
    return next();
});

mongoose.model('Room', RoomSchema);