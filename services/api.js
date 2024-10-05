const express = require("express");
const authRoutes = require('../routes/authRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const adminRoutes = require('../routes/adminRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const roomRoutes = require('../routes/roomRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/rooms', roomRoutes);

module.exports = router;