const express = require('express');
const { createOrder } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', createOrder);

module.exports = router;