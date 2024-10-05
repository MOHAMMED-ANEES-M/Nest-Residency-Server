const express = require('express');
const {
  getAllBookings,
  cancelBooking,
  bookRoom,
  getBookingById,
} = require('../controllers/bookingController');
const verifyToken = require('../middleware/verifyTokenHandler');
const { addRoom, updateRoomPrice } = require('../controllers/roomController');

const router = express.Router();

router.use(verifyToken);

router.post('/book-room', bookRoom);
router.get('/bookings', getAllBookings);
router.put('/cancel-booking/:id', cancelBooking);
router.get('/booking/:id', getBookingById);
router.post('/add-room', addRoom);
router.put('/update-price', updateRoomPrice);

module.exports = router;