const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initiate payment
exports.createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    receipt: crypto.randomBytes(10).toString('hex'),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Razorpay error', error });
  }
});


// Verify the payment
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(order_id + "|" + payment_id);
  const digest = shasum.digest('hex');

  if (digest === signature) {
    try {
      // Payment is verified successfully, capture the payment
      const captureResponse = await razorpay.payments.capture(payment_id, req.body.amount);
      res.json({
        success: true,
        message: 'Payment verified and captured successfully',
        data: captureResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Payment capture failed',
        error,
      });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});
