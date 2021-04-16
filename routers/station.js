const router = require('express').Router();
const {
  postStation,
  deleteStation,
  getAllStation,
  getStationById,
  update,
} = require('../controllers/station');

router.post('/station', postStation);

router.delete('/station', deleteStation);

router.get('/station', getAllStation);

router.put('/station/:id', update);

router.get('/station/:id', getStationById);

module.exports = router;
