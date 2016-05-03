'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/config');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};


/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {

  var search = req.query.search
  var query = {}
  if(search){
    var name = new RegExp(req.query.name, 'i')
    query = {name:name}
  }


  User.find(query, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.relevance = 0;

  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });

};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.update = function(req, res, next) {
   var userId = req.user._id;
   var role = req.user.role;

   console.log(req.body)

   if(userId != req.body._id && role != 'admin')
     return res.send(403);

   User.findById(req.body._id, '-salt -hashedPassword', function (err, user) {
      user.name = req.body.name;
      user.image = req.body.image;
      // user.
      // user.name = "4Real";
      // user.role = "admin"
      if(role == "admin")
        user.role = req.body.role;
      console.log(user)
      user.save(function(err){
        if(err) return res.send(403);
        res.json(200, user);
      })
   });
};


/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};


function handleError(res, err) {
  return res.send(500, err);
}


