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
    //check id seat
    let foundedSeat = [];
    for (const e of seatID) {
      check = foundedTrip.seat.findIndex(
        (item) => item._id.toString() === e && item.status === 'avaiable'
      );
      foundedSeat.push(check);
    }

    const checkSeat = foundedSeat.some((item) => item === -1);
    if (checkSeat === true) return res.status(400).send({msg: 'Invalid seat'});

    //update trạng thái ghế
    let arraySeat = [];
    foundedSeat.forEach((e) => {
      foundedTrip.seat[e].userId = req.user._id;
      foundedTrip.seat[e].status = 'booked';
      arraySeat.push(foundedTrip.seat[e]);
    });

    await foundedTrip.save();

    //tạo ticket
    await ticketModel.create(
      [
        {
          user: req.user._id,
          trip: tripID,
          seat: arraySeat,
        },
      ],
      {session: session}
    );

    await session.commitTransaction();
    session.endSession();

    res.send({msg: 'success'});
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({err: 'Server error'});
  }
};

// const postBookTrip = async (req, res) => {
//   const {tripID, seatID} = req.body;

//   const session = await mongoose.startSession();
//   await session.startTransaction();

//   try {
//     const foundedTrip = await trip.findById(tripID).session(session);
//     if (!foundedTrip)
//       return res.status(400).send({msg: 'Invalid trip, Id is not exist'});

//     const foundedIndex = foundedTrip.seat.findIndex(
//       (item) => item._id.toString() === seatID && item.status === 'avaiable'
//     );
//     if (foundedIndex === -1)
//       return res.status(400).send({msg: 'Invalid seat, Id is not exist'});

//     //update trạng thái ghế
//     foundedTrip.seat[foundedIndex].userId = req.user._id;
//     foundedTrip.seat[foundedIndex].status = 'booked';

//     await foundedTrip.save();
//     console.log(req.user._id);
//     console.log('save seat');

//     //tạo ticket
//     await ticketModel.create(
//       [
//         {
//           user: req.user._id,
//           trip: tripID,
//           seat: [foundedTrip.seat[foundedIndex]],
//         },
//       ],
//       {session: session}
//     );

//     console.log('save ticket');

//     await session.commitTransaction();
//     session.endSession();

//     res.send({msg: 'success'});
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).send({err: 'Server error'});
//   }
// };

module.exports = {postBookTrip};
