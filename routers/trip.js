const router = require('express').Router();
const carModel = require('../models/car');
const stationModel = require('../models/station');
const {Seat} = require('../models/seat');
const tripModel = require('../models/trip');
const auth = require('../utils/auth');
const {postBookTrip} = require('../controllers/trip');

router.post('/trip', auth(['admin']), async (req, res) => {
  try {
    let {
      departurePlace,
      arrivalPlace,
      startedDate,
      departureTime,
      carId,
      price,
    } = req.body;

    startedDate = startedDate + ' 00:00:00';

    //checkStation
    const foundedStation = await stationModel
      .find()
      .or([{_id: departurePlace}, {_id: arrivalPlace}]);

    if (foundedStation.length !== 2) {
      return res.status(400).send({msg: 'Invalid station'});
    }

    //checkCar
    const foundedCar = await carModel.findById(carId);
    if (!foundedCar) return res.status(400).send({msg: 'Invalid car'});

    const seatArr = [...new Array(foundedCar.seats)].map((_, index) => {
      return new Seat({
        name: index + 1,
        status: 'avaiable',
      });
    });

    const newTrip = new tripModel({
      departurePlace,
      arrivalPlace,
      startedDate,
      departureTime,
      seat: seatArr,
      carId,
      price,
    });

    const data = await newTrip.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({err: 'Server error'});
  }
});

router.get('/trip', auth(), async (req, res) => {
  let {departure, arrival, date} = req.query;
  date = date + ' 00:00:00';
  try {
    const foundTrips = await tripModel
      .find({
        departurePlace: departure,
        arrivalPlace: arrival,
        startedDate: date,
      })
      .populate('departurePlace arrivalPlace', '_id name province address');
    res.send(foundTrips);
  } catch (err) {
    res.status(500).send({err: 'Server error'});
  }
});

router.post('/all-trip', auth(), async (req, res) => {
  const result = await tripModel.find();
  res.send(result);
});

router.post('/trip/booking', auth(), postBookTrip);

module.exports = router;
