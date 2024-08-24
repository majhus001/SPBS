const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  Phoneno: { type: String, required: true },
  Username: { type: String, required: true },
  password: { type: String, required: true }
});

const RegisterModel = mongoose.model('register', RegisterSchema);
module.exports = RegisterModel;
