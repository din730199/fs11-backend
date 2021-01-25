const router = require('express').Router();
const {now} = require('mongoose');
const {diskStorage} = require('multer');
const multer = require('multer');
const auth = require('../utils/auth');

const upload = multer({
  storage: diskStorage({
    destination: 'images',
    filename(req, file, done) {
      const name = Date.now() + '-' + file.originalname;
      done(null, name);
    },
  }),
});

router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send();
});

router.post(
  '/upload/avatar',
  auth(),
  upload.single('file'),
  async (req, res) => {
    const {path} = req.file;
    req.user.avatar = path;
    const result = await req.user.save();
    res.send(result);
  }
);

module.exports = router;
