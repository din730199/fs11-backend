const router = require('express').Router();
const carModel = require('../models/car');
const stationModel = require('../models/station');
const {Seat} = require('../models/seat');
const tripModel = require('../models/trip');
const auth = require('../utils/auth');
const {postBookTrip} = require('../controllers/trip');
const ticketModel = require('../models/ticket');

router.post('/trip', async (req, res) => {
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

router.get('/trip', async (req, res) => {
  let {departure, arrival, date} = req.query;
  date = date + ' 00:00:00';
  try {
    console.log(date);
    const foundTrips = await tripModel
      .find({
        departurePlace: departure,
        arrivalPlace: arrival,
        startedDate: date,
      })
      .populate('departurePlace arrivalPlace', '_id name province address');
    console.log(foundTrips);
    res.send(foundTrips);
  } catch (err) {
    res.status(500).send({err: 'Server error'});
  }
});

router.get('/trip/:id', async (req, res) => {
  const result = await tripModel
    .findById(req.params.id)
    .populate('departurePlace arrivalPlace', '_id name province address');
  res.send(result);
});

router.get('/all-trip', async (req, res) => {
  const result = await tripModel.find().populate('departurePlace arrivalPlace');
  res.send(result);
});

router.get('/all-ticket', async (req, res) => {
  const result = await ticketModel.find().populate('user trip');
  res.send(result);
});

router.get('/byId-ticket', auth(), async (req, res) => {
  const result = await ticketModel.find({user: req.user._id}).populate({
    path: 'trip user',
    populate: {
      path: 'departurePlace arrivalPlace',
      select: '-_id -__v ',
    },
    select: '-_id -__v -seat',
  });
  res.send(result);
});

router.delete('/trip/:id', async (req, res) => {
  try {
    const data = await tripModel.findByIdAndDelete(req.params.id);
    if (data) {
      res.json({
        msg: 'Delete thành công',
        status: 200,
      });
    } else {
      res.json({
        errors: [
          {
            msg: 'Delete thất bại',
          },
        ],
        status: 201,
      });
    }
  } catch (error) {
    res.json({
      errors: [
        {
          msg: 'Server errors',
        },
      ],
      status: 205,
    });
  }
});

router.post('/trip/booking', auth(), postBookTrip);

module.exports = router;
