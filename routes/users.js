const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const _ = require('lodash');
const mongoose = require('mongoose');

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

module.exports = router;