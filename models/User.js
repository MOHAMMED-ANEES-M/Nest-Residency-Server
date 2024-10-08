const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin', required: true }
});

module.exports = mongoose.model('User', UserSchema);