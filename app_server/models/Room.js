var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    }
});

mongoose.model('Room', RoomSchema);