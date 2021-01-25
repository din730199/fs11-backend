const mongoose = require('mongoose');

var carSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    licensePlate: {
      type: String,
    },
    seats: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model('Car', carSchema);
