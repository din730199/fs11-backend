const mongoose = require('mongoose');

var stationSchema = new mongoose.Schema({
  name: String,
  address: String,
  province: String,
  code: String,
});

//Export the model
module.exports = mongoose.model('Station', stationSchema);
