const mongoose = require('mongoose');
const {seatSchema} = require('./seat');

var tripSchema = new mongoose.Schema(
  {
    departurePlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
    },
    arrivalPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
    },
    startedDate: Date,
    departureTime: Date,
    seat: [seatSchema],
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    price: Number,
  },
  {
    timestamps: true,
  }
);

//Export the model
const trip = mongoose.model('Trip', tripSchema);
module.exports = trip;
