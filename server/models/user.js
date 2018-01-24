const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  nikeName: {
    type: String
  }

});

UserSchema.statics.findByEmail = function (email, password) {
  var Users = this;
  return Users.findOne({email}).then((user) => {
    console.log('find user');
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          console.log('password correct');
          resolve(user);
        }
        else {
          reject('Password incorrect!');
        }
      });
    });
  });

}

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } 
  else {
    next();
  }
});

var Users = mongoose.model('Users', UserSchema);

module.exports = {Users}