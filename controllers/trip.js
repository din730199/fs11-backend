const trip = require('../models/trip');
const ticketModel = require('../models/ticket');
const mongoose = require('mongoose');

const postBookTrip = async (req, res) => {
  const {tripID, seatID} = req.body;

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const foundedTrip = await trip.findById(tripID).session(session);
    if (!foundedTrip)
      return res.status(400).send({msg: 'Invalid trip, Id is not exist'});

    const foundedIndex = foundedTrip.seat.findIndex(
      (item) => item._id.toString() === seatID && item.status === 'avaiable'
    );
    if (foundedIndex === -1)
      return res.status(400).send({msg: 'Invalid seat, Id is not exist'});

    //update trạng thái ghế
    foundedTrip.seat[foundedIndex].userId = req.user._id;
    foundedTrip.seat[foundedIndex].status = 'booked';

    await foundedTrip.save();
    console.log(req.user._id);
    console.log('save seat');

    //tạo ticket
    await ticketModel.create(
      [
        {
          user: req.user._id,
          trip: tripID,
          seat: [foundedTrip.seat[foundedIndex]],
        },
      ],
      {session: session}
    );

    console.log('save ticket');

    await session.commitTransaction();
    session.endSession();

    res.send({msg: 'success'});
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({err: 'Server error'});
  }
};

module.exports = {postBookTrip};
