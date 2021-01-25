const router = require('express').Router();
const {postBranch} = require('../controllers/branch');

router.post('/branch', postBranch);

module.exports = router;
