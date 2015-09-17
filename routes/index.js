module.exports = function(app, passport, connection){
    require('./main')(app, connection);
    require('./rooms')(app);
    require('./users')(app, passport);
};


