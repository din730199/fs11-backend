const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const auth = require('../utils/auth');
const config = require('config');
const sgMail = require('@sendgrid/mail');
const sgAPIKey = config.get('sgAPIKey');
sgMail.setApiKey(sgAPIKey);

router.post('/signUp', async (req, res) => {
  const {username, password, email, phone} = req.body;
  try {
    const foundUser = await userModel.findOne().or([{username}, {email}]);
    if (foundUser) return res.status(400).send({msg: 'User already exists'});

    const newUser = new userModel({
      username,
      password,
      email,
      phone,
      role: 'user',
    });

    let result = await newUser.save();

    result = result.toObject();
    delete result.password;

    sgMail
      .send({
        from: 'hieu@covergo.com',
        to: result.email,
        subject: 'Wellcome to Vexere',
        html: "<h1 style='color:red'>Wellcome</h1>",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({err: 'Server error'});
  }
});

router.post('/signIn', async (req, res) => {
  const {email, password} = req.body;
  try {
    //check user
    const foundUser = await userModel.findOne({email});
    if (!foundUser) return res.status(401).json({msg: 'Wrong email'});

    //check password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(401).json({msg: 'Wrong password'});

    //generate token
    const token = await jwt.sign(
      {
        _id: foundUser._id,
      },
      'vexerejwt'
    );

    //save token vao user
    foundUser.token.push(token);
    await foundUser.save();

    // result = foundUser.toObject();
    // delete result.password;
    res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).send({err: 'Server error'});
  }
});

router.get('/me', auth(), async (req, res) => {
  const result = req.user.toJson();
  res.send(result);
});

router.post('/logOut', auth(), async (req, res) => {
  try {
    const index = req.user.token.findIndex((token) => token === req.token);
    req.user.token.splice(index, 1);

    await req.user.save();
    res.send({msg: 'Success'});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
