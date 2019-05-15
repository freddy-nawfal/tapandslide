const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({

  // Base user info 

  username:{
    type: String,
    required: true,
    unique: true 
  },
  passwordHash: { 
    type: String, 
    required: false 
  },

  stats: {
    wins: {
      type: Number,
      default: 0
    },
    loses: {
      type: Number,
      default: 0
    },
    elo: {
      type: Number,
      default: 0
    }
  }

}, {usePushEach: true});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(12));
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
