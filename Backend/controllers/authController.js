'use strict';
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { insertUser } = require('../models/userModel');
const { httpError } = require('../utils/errors');
const bcrypt = require("bcryptjs");

//Login Session
const login = (req, res, next) => {
  // TODO: add passport authenticate
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log('local params', err, user, info);
    if (err || !user) {
      next(httpError('Username / Password Incorrect', 400));
      return;
    }
    
    req.login(user, { session: false }, (err) => {
      if (err) {
        next(httpError('Login Error', 400));
        return;
      }
      const token = jwt.sign(user, 'secretissecret');
      return res.json({ user, token });
    });
  })(req, res, next);
};


//Register Session
const user_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const err = httpError("Register Invalid", 400);
      next(err);
      console.log(errors);
      return;
  }

  try {
    req.body.passwd = bcrypt.hashSync(req.body.passwd, 12);
    const user = req.body;
    const id = await insertUser(user);
    res.json({message: `Welcome to OOTD, ${user.username}!\nRegistered an account with User ID: ${id}`});

  } catch (e) {
    console.log("user_post error", e.message);
    const err = httpError("Error registering user", 400);
    next(err);
    return;
  }
}

module.exports = {
  login,
  user_post,
};