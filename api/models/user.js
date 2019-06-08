'use strict';

//Reference core node libraries
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var schema = mongoose.Schema;

//Declare model
var user_schema = new schema({
    first_name: {type: String},
    last_name: {type: String},
    middle_name: {type: String},
    maiden_name: {type: String},
    other_names: {type: String},
    company_name: {type: String},
    email: {type: String, unique: true},
    hash_password: {type: String},
    user_type: {type: String},
    address_line_1: {type: String},
    address_line_2: {type: String},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    zip_code: {type: String},
    phone_number: {type: String},
    reset_password_token: {type: String},
    reset_password_expires: {type: Date},
    email_confirmed: {type: Boolean}
});

//Define Compare Password method
user_schema.methods.compare_password = function(password){
	return bcrypt.compareSync(password, this.hash_password);
}

//Export model
module.exports = mongoose.model('user', user_schema);