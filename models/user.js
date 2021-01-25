const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
    },
    token: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJson = function () {
  const user = this.toObject();
  delete user.password;
  delete user.token;
  return user;
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

//Export the model
module.exports = mongoose.model('User', userSchema);
