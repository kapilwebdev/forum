const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');



const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trip: true,
        minlength:1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
          } 
    },
    password: {
        type: String,
        required: true,
        minlength:6
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
});


const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err){
                return false;
            }
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByCredentials = (username, callback) => {
   User.findOne({username}, callback);
}

module.exports.comparePassword = (password, userPassword, callback) =>{
    bcrypt.compare(password, userPassword, callback);
}