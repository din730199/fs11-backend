const branchModel = require('../models/branch');
const postBranch = async (req, res) => {
  try {
    const foundedBranch = await branchModel.findOne({code: req.body.code});

    if (foundedBranch)
      return res.status(400).send({msg: 'Branch already exists'});

    const newBranch = new branchModel({
      name: req.body.name,
      hotline: req.body.hotline,
      address: req.body.address,
      code: req.body.code,
    });
    const data = await newBranch.save();

    res.send(data);
  } catch (error) {
    res.status(500).send({err: 'Server error'});
  }
};

module.exports = {postBranch};
