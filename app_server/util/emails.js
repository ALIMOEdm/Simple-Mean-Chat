var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '',
        pass: ''
    }
});

module.exports.registerConfirmEmail = function(user){
    var mailOptions = {
        from: 'Wolfram Inc',
        to: user.email,
        subject: 'Activate message',
        html: '<p>Пароль для активации: <b>'+user.confirmStr+'</b></p>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};