const express = require('express');
const { getAllBookings, cancelBooking, bookRoom } = require('../controllers/bookingController');
const verifyToken = require('../middleware/verifyTokenHandler');
const router = express.Router();

router.post('/book-room', bookRoom);
router.get('/bookings', verifyToken, getAllBookings);
router.put('/cancel-booking/:id', verifyToken, cancelBooking);

module.exports = router;