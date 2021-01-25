const carModel = require('../models/car');

const postCar = async (req, res) => {
  try {
    const {branch, licensePlate, seats} = req.body;

    const foundCar = await carModel.findOne({licensePlate});

    if (foundCar)
      return res.status(400).send({msg: 'License plate already exists'});

    const newCar = new carModel({
      branch,
      licensePlate,
      seats,
    });

    const data = await newCar.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({err: 'Server error'});
  }
};

module.exports = {postCar};
