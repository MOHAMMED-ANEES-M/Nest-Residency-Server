const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendBookingConfirmationEmail } = require('../services/emailService');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const hmac_sha256 = (data, key) => {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  return hmac.digest('hex');
};

// Initiate payment
exports.createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  console.log('payment order body', req.body);
  
  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: crypto.randomBytes(10).toString('hex'),
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log('order', order);
    res.json(order);
  } catch (error) {
    console.log('order error', error);
    res.status(500).json({ message: 'Razorpay error', error });
  }
});


// Verify the payment and create booking
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorId, paymentId, signature, amount, roomData, guestDetails } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const generated_signature = hmac_sha256(razorId + "|" + paymentId, key_secret);
  if (generated_signature === signature) {
    try {
      const amountInINR = amount / 100;
      const payment = new Payment({
        orderId: razorId,
        paymentId,
        amount: amountInINR,
        paymentStatus: 'captured',
      });
      const savedPayment = await payment.save();

      const booking = new Booking({
        roomNumber: roomData.roomNumber,
        roomType: roomData.roomType,
        checkInDate: roomData.checkInDate,
        checkOutDate: roomData.checkOutDate,
        fname: guestDetails.fname,
        lname: guestDetails.lname,
        phone: guestDetails.phone,
        email: guestDetails.email,
        paymentId: savedPayment._id,
        bookingMode: 'Online',
      });
      const savedBooking = await booking.save();

      await sendBookingConfirmationEmail(
        guestDetails.email,
        `${guestDetails.fname} ${guestDetails.lname}`,
        roomData.roomId,
        roomData.roomType,
        roomData.checkInDate,
        roomData.checkOutDate,
        amountInINR,
        savedPayment.paymentId,
        process.env.APP_NAME
      );

      res.json({
        success: true,
        message: 'Payment verified and booking created successfully',
        booking: savedBooking,
        payment: savedPayment,
      });
    } catch (error) {
      console.log(error, 'booking error');
      
      res.status(500).json({
        success: false,
        message: 'Payment capture failed or booking creation failed',
        error,
      });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});