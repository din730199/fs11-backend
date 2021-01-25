const router = require('express').Router();
const {postCar} = require('../controllers/car');

router.post('/car', postCar);

module.exports = router;
