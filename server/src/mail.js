const constants = require('./constants');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: constants.GMAIL_ACCOUNT,
        pass: constants.GMAIL_PASSWORD
    }
});


exports.sendEmail = async (email, token) => {
    let url = `${constants.REACT_SERVER}/changepassword?email=${email}&token=${token}`
    var mailOptions = {
        from: constants.GMAIL_ACCOUNT,
        to: email,
        subject: 'Password reset',
        html: `<p>Click <a href="${url}">here</a> to reset your password in Social Cat.</p>`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}