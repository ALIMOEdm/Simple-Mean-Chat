//module.exports.index = function(req, res, next){
//    res.render('index', {title: 'Express'});
//};

module.exports = function(connection){
    return {
        index: function(req, res, next){
            connection.query('SELECT u.username, GROUP_CONCAT(m.message) FROM for_user as u LEFT JOIN messages as m on u.id=m.source_client_id GROUP BY u.id',
                function(err, rows, fields){
                    if(err){
                        console.log(err);
                    }
                    console.log('//////////////////');
                    console.log(rows);
                    console.log('//////////////////');
                    //console.log(fields);
                    //console.log('//////////////////');
            });
            res.render('index', {title: 'Express'});
        }
    }
};