const express = require('express');
const { bookRoom, checkAvailability, getBookingById } = require('../controllers/bookingController');
const router = express.Router();

router.post('/book-room', bookRoom);
router.post('/check-availability', checkAvailability);
router.get('/booking/:id', getBookingById);

module.exports = router;