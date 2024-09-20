const express = require("express");
const authRoutes = require('../routes/authRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const adminRoutes = require('../routes/adminRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;