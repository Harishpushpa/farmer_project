const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String },
  dob: { type: String },
  phone: { type: String },
  address: { type: String },
  cardNumber: { type: String },
  pincode: { type: String },
  areaOwned: { type: String }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
