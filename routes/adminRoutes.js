const express = require('express');
const { getAllBookings, cancelBooking, bookRoom, getBookingById } = require('../controllers/bookingController');
const verifyToken = require('../middleware/verifyTokenHandler');
const { addRoom } = require('../controllers/roomController');
const router = express.Router();

router.post('/book-room', bookRoom);
router.get('/bookings', verifyToken, getAllBookings);
router.put('/cancel-booking/:id', verifyToken, cancelBooking);
router.get('/booking/:id', getBookingById);
router.post('/add-room', addRoom);

module.exports = router;