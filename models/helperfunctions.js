const { MailSend } = require('../mailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');


function Capitalize(text) {
	const capitalizedText = (text && text.length > 0) ? (text.charAt(0).toUpperCase() + text.slice(1)) : text;
	return capitalizedText;
}

function UpperCase(text) {
	const alteredText = (text && text.length > 0) ? text.toUpperCase() : text;
	return alteredText;
}

function LowerCase(text) {
	const alteredText = (text && text.length > 0) ? text.toLowerCase() : text;
	return alteredText;
}

function CreateSlug(text) {
	var slug = text;
	slug = slug.replace(/[^\w\-]+/g, "-");
	slug = slug.toLowerCase();
	return slug
}

function generatePassword() {
	var length = 8,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		password = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		password += charset.charAt(Math.floor(Math.random() * n));
	}
	return password;
}

function SendEnquiryEmail(data) {
	const filePath1 = path.join(__dirname, "./email/enquiry.html");
	const source1 = fs.readFileSync(filePath1, 'utf-8').toString();
	const template1 = handlebars.compile(source1);
	const replacements1 = {
		name: data.firstname ? helperFunction.Capitalize(data.firstname) : '' + ' ' + data.lastname,
		email: data.email,
		phonenumber: data.phonenumber,
		message: data.message ? helperFunction.Capitalize(data.message) : '---',
	};
	const htmlToSend1 = template1(replacements1);
	var mailOptions1 = {
		// to: 'rahul@acwcircle.com ',
		to: 'info@acwcircle.com,aravind@acwcircle.com,hr@acwcircle.com',
		subject: "we have received new enquiry from ACWcard",
		html: htmlToSend1,
	};
	MailSend(mailOptions1, function (error, response) {
	});
}
module.exports = {
	Capitalize: Capitalize,
	UpperCase: UpperCase,
	LowerCase: LowerCase,
	CreateSlug: CreateSlug,
	generatePassword: generatePassword,
	SendEnquiryEmail: SendEnquiryEmail
};
