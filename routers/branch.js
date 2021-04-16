const router = require('express').Router();
const {postBranch} = require('../controllers/branch');
const branchModel = require('../models/branch');

router.post('/branch', postBranch);

router.get('/branch', async (req, res) => {
  try {
    res.json({data: await branchModel.find()});
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

router.put('/branch/:id', async (req, res) => {
  try {
    const data = await branchModel.findByIdAndUpdate(req.params.id, req.body, {
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

router.delete('/branch/:id', async (req, res) => {
  try {
    const data = await branchModel.findByIdAndDelete(req.params.id);
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
