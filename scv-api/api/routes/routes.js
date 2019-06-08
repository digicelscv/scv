'use strict';
module.exports = function(app) {

//Reference controllers
var auth = require('../controllers/auth.js');
var user = require('../controllers/user.js');

//Set allowed API origin, headers and methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

//Define User routes
app.route('/user').get(user.login_required, user.get);
app.route('/user/:user_id').get(user.login_required, user.get_by_id);
app.route('/user').post(user.login_required, user.post);
app.route('/user/:user_id').put(user.login_required, user.put);
app.route('/user/:user_id').delete(user.login_required, user.delete);

//Define Authentication routes
app.route('/auth/register').post(auth.register);
app.route('/auth/confirm-email/:user_id').get(auth.confirm_email);  
app.route('/auth/sign-in').post(auth.sign_in);
app.route('/auth/forgot-password').get(auth.forgot_password);
app.route('/auth/change-password').post(auth.change_password);
app.route('/auth/reset-password').post(auth.reset_password);
}