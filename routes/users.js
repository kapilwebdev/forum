const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const _ = require('lodash');
const mongoose = require('mongoose');
const {authenticate} = require('../middleware/auth');
router.post('/register', (req, res) => {
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
      }).then((token) => {
        res.header('x-auth', token).send(user);
      }).catch((e) => {
        res.send(e);
      })
});

router.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  
  User.findUserByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});



router.get('/profile', authenticate, (req, res) => {
  res.send(req.user);
});

router.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.send('User logged out');
  }).catch((e) => {
    res.send('Unauthorized!!');
  });
});

module.exports = router;