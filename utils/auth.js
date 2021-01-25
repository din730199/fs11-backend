const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const config = require('config');
//closure
module.exports = (roles) => async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = await jwt.verify(token, config.get('jwtSignature'));
    const allowRoles = roles || ['admin', 'user'];

    const foundUser = await userModel.findOne({
      _id: decoded._id,
      token: token,
      role: {$in: allowRoles},
    });
    if (!foundUser)
      return res.status(401).send({msg: 'You are not authozized'});

    req.user = foundUser;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({msg: 'You are not authozized1'});
  }
};
