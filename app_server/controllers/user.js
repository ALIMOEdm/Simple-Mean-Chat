var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var _und = require("underscore");
var emails = require('../util/emails');
//var passport = require('passport');

module.exports = function(passport){
    return {
        me: function(req, res, next){

            console.log(req.user);
            console.log(req.isAuthenticated());
            //check, contains user or not
            if(!req.user || !req.user.hasOwnProperty('_id'))
                return res.send('');

            //try find user by id
            User.findOne({
                _id: req.user._id
            }).exec(function(err, user){
                if(err || !user){
                    return res.send('');
                }

                //if find
                var dbUser = user.toJSON();
                var id = req.user._id;

                delete dbUser._id;
                delete req.user._id;

                //compare user data what come us from client and data from database
                var eq = _und.isEqual(dbUser, req.user);
                //if equals, return client user
                if(eq){
                    eq.user._id = id;
                    return res.json(req.user);
                }

                //return token
                var token = user.generateJWT();
                res.json({ token: token });
            })
        },
        create: function(req, res, next){
            //create new user
            var user = new User(req.body);

            //provider as local
            user.provider = 'local';

            //check correct input data
            req.assert('name', 'You must enter a username').notEmpty();
            req.assert('email', 'You must enter a email').notEmpty();
            req.assert('password', 'Password must be between 8-20 characters long').len(4, 20);
            req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

            var errors = req.validationErrors();
            if(errors){
                return res.status(400).send(errors);
            }

            //add role to user
            user.roles = ['authenticated'];
            user.setPassword(req.body.password);
            user.setConfirmString();

            //and save him
            user.save(function(err, user){
                if(err){
                    return res.status(400).send({msg: err.message});
                }

                req.logIn(user, function(err){
                    if(err){
                        return next(err);
                    }

                    emails.registerConfirmEmail(user);

                    var token = user.generateJWT();
                    res.json({
                        token: token,
                        redirect: req.body.redirect
                    });
                });

                res.status(200);
            });
        },

        activateUser: function(req, res, next){
            var conf_str = req.body.conf_str;
            if(!req.user || !req.user._id){
                return res.status(400).json(
                    {
                        msg: 'User is not authorized',
                        redirect_reject: req.body.redirect_reject
                    });
            }

            User.findOne({
                _id: req.user._id
            }).exec(function(err, user){
                if(err || !user){
                    return res.status(400).json({msg: err.message});
                }

                user.activateUser(conf_str);

                user.save(function(err, user){
                    if(err){
                        return res.status(400).send({msg: err.message});
                    }

                    return res.json({
                        token: user.generateJWT(),
                        redirect: req.body.redirect
                    });

                    //res.status(200);
                });

            });
        },
        resendActivateEmail: function(req, res, next){
            console.log(req.user);
            if(!req.user || !req.user._id){
                //console.log('resendActivateEmail in if', req.user.hasOwnProperty('_id'), req.user._id);
                return res.status(400).json(
                    {
                        msg: 'User is not authorized',
                        redirect_reject: req.body.redirect_reject
                    });
            }
            User.findOne({
                _id: req.user._id
            }).exec(function(err, user){
                if(err || !user){
                    return res.status(400).json({msg: err.message});
                }

                emails.registerConfirmEmail(user);
                return res.status(200).json({state: 1});
            });
        },
        login: function(req, res, next){
            //emails.registerConfirmEmail();
            if(!req.body.email || !req.body.password){
                return res.status(400).json({msg: 'Please fill out all fields'});
            }

            User.findOne({
                email: req.body.email
            }).exec(function(err, user){
                if(err){
                   return res.status(400).json({msg: err.message});
                }
                if(user){
                    if(!user.validPassword(req.body.password)){
                        return res.status(400).json({msg: 'Password is not correct'});
                    }
                    req.logIn(user, function(err) {
                        if (err) { return next(err); }
                        return res.json({
                            token: user.generateJWT(),
                            redirect: req.body.redirect
                        });
                    });
                }else{
                    return res.status(401).json({msg: 'This email is not find'});
                }
            });


        },
        logout: function(req, res, next){
            req.logout();
            res.redirect('/');
        },
        // AngularJS route to check for authentication
        loggedin: function(req, res, next){
            if(!req.isAuthenticated()){
                return res.send('');
            }

            User.findOne({
                _id: req.user._id
            }).exec(function(err, user){
                res.send(user ? user : '');
            });
        }
    }
};