const nodemailer = require('nodemailer');
const variable = require("../var/index")

module.exports = function(email){
	return new Promise((resolve, reject) => {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: variable.EMAIL_SENDER,
				pass: variable.EMAIL_PASS
			}
		});
	
		const mailOptions = {
			from: variable.EMAIL_SENDER,
			to: email,
			subject: 'Success registration',
			text: 'Congratulation you success registration account '+ email
		};
	
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				reject(error);
			} else {
				resolve('Email sent: ' + info.response);
			}
		});
	})
}