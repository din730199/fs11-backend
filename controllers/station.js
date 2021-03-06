const stationModel = require('../models/station');

const postStation = async (req, res) => {
  try {
    const {name, province, address, code} = req.body;

    const foundStation = await stationModel.findOne({code: code});

    if (foundStation)
      return res.status(400).send({msg: 'Station already exists'});

    const newStation = new stationModel({
      name,
      province,
      address,
      code,
    });

    const data = await newStation.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({err: 'Server error'});
  }
};

const deleteStation = async (req, res) => {
  try {
    const {id} = req.query;
    const result = await stationModel.findByIdAndDelete(id);
    res.json(result);
  } catch (error) {
    res.status(500).send({err: 'Server error'});
  }
};

const update = async (req, res) => {
  try {
    const data = await stationModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (data) {
      res.json({
        msg: 'Update thành công',
        status: 200,
      });
    } else {
      res.json({
        errors: [
          {
            msg: 'Update thất bại',
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
};

const getAllStation = async (req, res) => {
  try {
    const result = await stationModel.find();
    res.json(result);
  } catch (error) {
    res.status(500).send({err: 'Server error'});
  }
};

const getStationById = async (req, res) => {
  try {
    const {id} = req.params;
    const result = await stationModel.findById(id);
    res.json(result);
  } catch (error) {
    res.status(500).send({err: 'Server error'});
  }
};

module.exports = {
  postStation,
  deleteStation,
  getAllStation,
  getStationById,
  update,
};
