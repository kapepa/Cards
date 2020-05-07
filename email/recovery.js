const nodemailer = require('nodemailer');
const variable = require("../var/index")

module.exports = function(email, token){
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
			subject: 'Recovery your account',
			html: `This refer on recovery accept toward account <a href="${variable.BASE_URL}/users/recovery/${token}" > Recovery password </a>`
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