const mongoose = require('mongoose');
const {seatSchema} = require('./seat');

var ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
    seat: [seatSchema],
  },
  {
    timestamps: true,
  }
);

//Export the model
const trip = mongoose.model('Ticket', ticketSchema);
module.exports = trip;
