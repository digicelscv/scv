'use strict';

//Reference core node libraries
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var path = require('path');
var async = require('async');
var crypto = require('crypto');
var _ = require('lodash');

//Reference data models
var user = mongoose.model('user');

//Set mail server configuration
const nodemailer = require('nodemailer');
var email = 'digicelscv@gmail.com';
var pass = 'Pass.3280416';
var smtp_transport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: email,
		pass: pass
	}
});

//Define email sender method
async function send_email(to, subject, html) {
	var result = await smtp_transport.sendMail({
		from: email,
		to: to,
		subject: subject,
		html: html
	});
}
  
//Set PWA domain
var domain = 'http://localhost'

//Define User Registration method
exports.register = function(req, res) {
	var new_user = new user(req.body);

	//Check if user exists
	user.count({email: new_user.email}, function(err, count) {
    if(err){
			res.end("Error # E00001: We can't create your account at this time. Please try later.");
		}
		if(count > 0){
			return res.status(400).send({
				message: "The email address is already registered! Are you trying to Sign In? "
			});
		} else {

			//Attempt to save user
			new_user.hash_password = bcrypt.hashSync(req.body.password, 10);
			new_user.save(function(err, user) {
				if (err) {
					return res.status(400).send({
						message: "Error # E00002: We can't create your account at this time. Please try later."
					});
				} else {
					user.hash_password = undefined;

					//Attempt to send Confirm Email email
					send_email(
						new_user.email,
						'Welcome to Digicel SCV',
						`<h3>Dear ${new_user.first_name},</h3>
						<p>Welcome to Digicel Single Customer View (SCV)</p>
						<p>Please click <a href="${domain}/auth/confirm-email/${new_user._id}">here</a> to confirm your email.</p><br>
						<p>Regards,<br />Digicel Customer Service Team</p>`	
					);
					res.redirect('/confirm-email.html');	
				}
			});
		}
  });	
};

//Define Email Confirmation method
exports.confirm_email = function(req, res) {
	user.findOneAndUpdate(
		{_id: req.params.user_id}, 
		{email_confirmed: true}, function(err, user) {
		if (err)
			res.send(err);
		res.redirect('/email-confirmed.html');
	});
};

//Define Sign In method
exports.sign_in = function(req, res) {
	user.findOne({
		email: req.body.email
	}, function(err, user) {
		if (err) throw err;
		if (!user || !user.compare_password(req.body.password)) {
			return res.status(401).json({
				message: 'Invalid email or password!'
			});
		}
		if (!user.email_confirmed) {
			return res.status(403).json({
				message: 'Please confirm your email before logging in!'
			});
		}

		//Compile and return JWT token
		return res.json({
			token: jwt.sign({
				email: user.email,
				fullName: user.fullName,
				_id: user._id
			}, 'RESTfulAPI'),
			_id: user._id,
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
			middle_name: user.middle_name,
			maiden_name: user.maiden_name,
			other_names: user.other_names,
			company_name: user.company_name
		});
	});
};

//Define Forgot Password method
exports.forgot_password = function(req, res) {
	async.waterfall([
		function(done) {
			user.findOne({
				email: req.body.email
			}).exec(function(err, user) {
				if (user) {
					done(err, user);
				} else {
					done('Please confirm you entered the correct email address!');
				}
			});
		},
		function(user, done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				done(err, user, token);
			});
		},
		function(user, token, done) {
			user.findByIdAndUpdate({
				_id: user._id
			}, {
				reset_password_token: token,
				reset_password_expires: Date.now() + 86400000
			}, {
				upsert: true,
				new: true
			}).exec(function(err, new_user) {
				done(err, token, new_user);
			});
		},

		//Attempt to send forgot password email
		function(token, user, done) {
			send_email(
				user.email,
				'Forgot Password',
				`<h3>Dear ${user.first_name}$,</h3>
        <p>We received a request to reset your password.<br/>
            If you did not request your password to be reset, please ignore this message.<br />
            If you requested your password to be reset, click <a href="${domain}/auth/reset-password?token=${token}">here</a> to reset your password.</p>
        <br>
        <p>Regards,<br /> The Digicel Customer Service Team</p>`
			);
			res.redirect('/password-reset-email.html');
		}
	], function(err) {
		return res.status(422).json({
			message: err
		});
	});
};

//Define Change Password method
exports.change_password = function(req, res, next) {
	user.findById(req.body.user_id, function(err, user) {
		if (err) {
			res.send(err);
		} else {
			if (!user.compare_password(req.body.old_password)) {
				return res.status(401).json({
					message: 'Old password incorrect!'
				});
			}
			user.hash_password = bcrypt.hashSync(req.body.confirmedNewPassword, 10);
			user.save(function(err, user) {
				send_email(
					user.email,
					'Password Changed',
					`<h3>Dear ${user.first_name}$,</h3>
					<p>Your password has been successfully changed!</p>
					<br>
					<p>Regards,<br />Digicel Customer Service Team</p>`
				);
			});
			res.redirect('/password-changed.html');
		}
	});
};

//Define Reset Password method
exports.reset_password = function(req, res, next) {
	user.findOne({
		reset_password_token: req.body.token,
		reset_password_expires: {
			$gt: Date.now()
		}
	}).exec(function(err, user) {
		if (!err && user) {
			if (req.body.new_password === req.body.verify_password) {
				user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
				user.reset_password_token = undefined;
				user.reset_password_expires = undefined;
				user.save(function(err) {
					if (err) {
						return res.status(422).send({
							message: err
						});
					} else {
						send_email(
							user.email,
							'Password Successfully Reset',
							`<h3>Dear ${user.first_name}$,</h3>
							<p>Your password has been successfully reset. No further action is required.</p>
							<br>
							<p>Regards,<br />Digicel Customer Service Team</p>`
						);
						res.redirect('/password-reset.html');
					}
				});
			} else {
				return res.status(422).send({
					message: 'Passwords do not match!'
				});
			}
		} else {
			return res.status(400).send({
				message: 'Password reset token is invalid or has expired!'
			});
		}
	});
};