const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

router.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.status(400).send(err);
        } 
        res.status(200).send(user);
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;    

    User.getUserByCredentials(username, (err, user) => {
        if(err){
            res.status(400).send('Something went wrong', err);
        } if(!user){
            res.send('User not found');
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err){
                throw err;
            } if(!isMatch){
                res.send('Password didnot match!!');
            }

            const token = jwt.sign({_id: user._id}, config.secret);
            
            res.header('x-auth', token).send(user);

        });
    });
});

module.exports = router;