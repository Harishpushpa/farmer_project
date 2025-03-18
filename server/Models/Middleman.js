const mongoose = require("mongoose");

const MiddlemanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        return /^[1-9][0-9]{5}$/.test(v); // Ensures exactly 6 digits, first digit not zero
      },
      message: props => `${props.value} is not a valid 6-digit pincode!`
    }
  },
  cropType: { type: String, required: true },
  priceOffered: { type: Number, required: true },
  qualityNeeded: { type: String, required: true },
  datePublished: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Middleman", MiddlemanSchema);
