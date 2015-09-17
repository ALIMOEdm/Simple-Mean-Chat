var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var _und = require("underscore");


var validateUniqueEmail = function(value, callback) {
    var User = mongoose.model('User');
    User.find({
        $and: [{
            email: value
        }, {
            _id: {
                $ne: this._id
            }
        }]
    }, function(err, user) {
        callback(err || user.length === 0);
    });
};


var UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
        validate: [validateUniqueEmail, 'E-mail address is already in-use']
    },
    hash: String,
    roles: {
        type: Array,
        default: ['authenticated', 'anonymous']
    },
    provider: {
        type: String,
        default: 'local'
    },
    activate: {
        type: Boolean,
        default: 0
    },
    confirmStr: String,
    socketId: String,
    rooms: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Room'
    }],
    salt: String
});

UserSchema.methods.addRoom = function(room){
    this.rooms.push(room);
};

UserSchema.methods.activateUser = function(confStr){
    if(confStr === this.confirmStr){
        this.activate = 1;
        this.confirmStr = '';
    }
};

UserSchema.methods.isActivate = function(){
    return this.activate;
};

UserSchema.methods.setConfirmString = function(){
    this.confirmStr = Math.random().toString(36).substring(4);
    return this.confirmStr;
};

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.methods.generateJWT = function(addProperties){
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    var source = {
        _id: this._id,
        name: this.name,
        email: this.email,
        roles: this.roles,
        activate: this.activate,
        exp: parseInt(exp.getTime() / 1000)
    };

    source = _und.extend(source, addProperties);

    return jwt.sign(source, 'SECRET');
};

mongoose.model('User', UserSchema);