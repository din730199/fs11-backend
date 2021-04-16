const router = require('express').Router();
const {postCar} = require('../controllers/car');
const carModel = require('../models/car');

router.post('/car', postCar);

router.get('/car', async (req, res) => {
  try {
    res.json({data: await carModel.find().populate('branch')});
  } catch (error) {
    console.log(error);
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

router.put('/car/:id', async (req, res) => {
  try {
    const data = await carModel.findByIdAndUpdate(req.params.id, req.body, {
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
});

router.delete('/car/:id', async (req, res) => {
  try {
    const data = await carModel.findByIdAndDelete(req.params.id);
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

module.exports = router;
