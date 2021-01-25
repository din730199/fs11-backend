const express = require('express');
const app = express();
const config = require('config');
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportStratery = require('passport-facebook-token');
const cors = require('cors');
const port = process.env.PORT || config.get('port');

const userModel = require('./models/user');

require('./db/connect');

passport.use(
  'fbToken',
  new passportStratery(
    {
      clientID: '471656110490812',
      clientSecret: 'd0a13df76bb78e1d40cb69757eedc00d',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const userEmail = profile.emails[0].value;
      const userAvatar = profile.photos[0].value;

      const foundedUser = await userModel.findOne({email: userEmail});
      let user = foundedUser;
      if (!foundedUser) {
        const newUser = new userModel({
          email: userEmail,
          role: 'user',
          avatar: userAvatar,
        });
        user = await newUser.save();
      }

      done(null, user);
    }
  )
);

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  cors({
    origin: 'http://localhost:5500',
    optionsSuccessStatus: 200,
  })
);

app.get('/', async (req, res) => {
  res.send('Wellcome');
});

app.use(require('./routers/trip'));
app.use(require('./routers/branch'));
app.use(require('./routers/car'));
app.use(require('./routers/station'));
app.use(require('./routers/auth'));
app.use(require('./routers/upload'));
app.post(
  '/login/facebook',
  passport.authenticate('fbToken', {session: false}),
  async (req, res) => {
    const token = await jwt.sign(
      {
        _id: req.user._id,
      },
      'vexerejwt'
    );
    req.user.token.push(token);
    await req.user.save();
    res.send(token);
  }
);

app.listen(port, () => {
  console.log('listening...', config.get('port'));
});
