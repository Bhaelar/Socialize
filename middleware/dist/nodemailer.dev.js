"use strict";

var nodemailer = require('nodemailer');

var googleOauth = require('./googleOauth');

var config = require('config'); // Send the email


function sendEmail(req, user, token) {
  var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.get('email'),
      //replace with your email
      clientId: config.get('ClientID'),
      clientSecret: config.get('Client_secret'),
      refreshToken: config.get('refresh_token'),
      accessToken: googleOauth
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: 'no-reply@socialize.com',
    to: user.email,
    subject: 'Account Verification Token',
    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp://' + req.headers.host + '/api/auth/confirmation/' + token.token + '.\n'
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    return console.log('Message sent: %s', info.messageId);
  });
}

module.exports.sendEmail = sendEmail;