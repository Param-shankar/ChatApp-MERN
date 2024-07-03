const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const userschema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique:true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    // require: true,
  },
}, {
    timestamps:true
});

userschema.methods.matchpw = async function(entredpw) {
  return (await bcrypt.compare(entredpw, this.password));
}
userschema.pre('save', async function (next) {
  if (!this.ismodified) {
    next;
  }
  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', userschema);

module.exports = {'usermodel':User};