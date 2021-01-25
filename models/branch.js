const mongoose = require('mongoose');

var branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hotline: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model('Branch', branchSchema);
