const mongoose = require('mongoose');

var seatSchema = new mongoose.Schema({
  name: String,
  status: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

//Export the model
const Seat = mongoose.model('Seat', seatSchema);
module.exports = {Seat, seatSchema};
