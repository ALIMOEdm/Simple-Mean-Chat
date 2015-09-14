var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize the user object based on a pre-serialized token
// which is the user id
passport.deserializeUser(function(id, done) {
    User.findOne({
        _id: id
    }, '-salt -hashed_password', function(err, user) {
        done(err, user);
    });
});

passport.use({
            usernameField: 'email',
            passwordField: 'password'
        },new LocalStrategy(
            function(email, password, done){
                User.findOne({email: email}, function(err, user){
                    if(err){
                        return done(err);
                    }

                    if(!user){
                        return done(null, false, {message: 'incorrect email'});
                    }

                    if(!user.validPassword(password)){
                        return done(null, false, {message: 'incorrect password'});
                    }

                    return done(null, user);
                })
            }
        )
);