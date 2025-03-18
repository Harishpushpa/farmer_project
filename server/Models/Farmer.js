const mongoose = require("mongoose");

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  cropType: { type: String, required: true },
  quantityAvailable: { type: Number, required: true },
  expectedPrice: { type: Number, required: true },
  datePublished: { type: Date, default: Date.now }
});

module.exports = mongoose.model("farmer", FarmerSchema);
