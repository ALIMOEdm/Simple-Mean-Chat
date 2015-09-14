module.exports = function(app, passport){
    require('./main')(app);
    require('./rooms')(app);
    require('./users')(app, passport);
};


