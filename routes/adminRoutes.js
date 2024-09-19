const express = require('express');
const { getAllBookings } = require('../controllers/bookingController');
const verifyToken = require('../middleware/verifyTokenHandler');
const router = express.Router();

router.get('/bookings', verifyToken, getAllBookings);

module.exports = router;