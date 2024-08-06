const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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');

function MailSend(mailOptions, callback) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		service: 'gmail',
		auth: {
			name: 'ACW Card',
			user: 'ariescircle.acw@gmail.com',
			pass: 'vfmedlbcqztyezft'
		}
	});
	transporter.sendMail(mailOptions, (error, response) => {
		callback(error, response);
	});
}


// function MailSend(mailOptions, callback) {
// 	var msg = mailOptions;
// 	msg.from = {
// 		name: 'ACW Card',
// 		email: 'info@acwcircle.com',
// 	},
// 		sgMail
// 			.send(msg)
// 			.then((response) => {
// 				console.log('======== response ======', response);
// 				callback(null, response);
// 			})
// 			.catch((error) => {
// 				console.log('-=-=-=-=-=-error=-=-=-', error);
// 				callback(error, null);
// 			})
// }

module.exports = {
	MailSend: MailSend
};
