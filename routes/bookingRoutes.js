const express = require('express');
const { bookRoom } = require('../controllers/bookingController');
const router = express.Router();

router.post('/book', bookRoom);

module.exports = router;