const router = require('express').Router();
const {postStation, deleteStation} = require('../controllers/station');

router.post('/station', postStation);

router.delete('/station', deleteStation);

module.exports = router;
