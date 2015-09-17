var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatMessageSchema = new Schema({
    message: String,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
});

mongoose.model('ChatMessage', ChatMessageSchema);