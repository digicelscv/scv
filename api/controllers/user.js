'use strict';

//Reference core node libraries
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var user = mongoose.model('user');

//Define GET User method
exports.get = function(req, res) {
  user.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

//Define GET User By ID method
exports.get_by_id = function(req, res) {
  user.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


//Define GET Customer By Name Wildcard method
exports.get_customer_by_name_wildcard = function(req, res) {
  user.find().and([
    {$or:[
      {first_name: /req.params.name_wildcard/},
      {last_name: /req.params.name_wildcard/},
      {middle_name: /req.params.name_wildcard/},
      {maiden_name: /req.params.name_wildcard/},
      {other_names: /req.params.name_wildcard/}
    ]},
    {user_type: 'customer'}
  ], function(err, customer) {
    if(err)
      res.end(err);
    res.json(customer)
  });
};

//Define POST User method
exports.post = function(req, res) {
  var new_user = new user(req.body);
  new_user.hash_password = bcrypt.hashSync(req.body.password, 10);
  new_user.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;         
    }
  });
};

//Define PUT User method
exports.put = function(req, res) {
  user.findOneAndUpdate({_id: req.params.user_id}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

//Define DELET User method
exports.delete = function(req, res) {
  user.remove({_id: req.params.user_id}, function(err, user) {
    if (err)
      res.send(err);
    res.json({
      message: 'User deleted!'
    });
  });
};

//Define Login Required method
exports.login_required = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
};