const nodemailer = require('nodemailer');
const template = require('./template'); 
const dotenv = require('dotenv').config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  const msg = { from: `${process.env.APP_NAME} ${process.env.EMAIL_FROM}`, to, subject, html };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, otp) => {
  const subject = 'Reset Password';
  const html = template.resetPassword(otp, process.env.APP_NAME);
  await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, otp) => {
  const subject = 'Email Verification';
  const html = template.verifyEmail(otp, process.env.APP_NAME);
  await sendEmail(to, subject, html);
};

const sendBookingConfirmationEmail = async (to, guestName, roomName, checkInDate, checkOutDate, totalPrice,paymentId, hotelName) => {
  const subject = 'Booking Confirmation';
  const html = template.bookingConfirmation(guestName, roomName, checkInDate, checkOutDate, totalPrice, paymentId, hotelName);
  await sendEmail(to, subject, html);
};

const sendBookingCancellationEmail = async (to, guestName, cancelReason, hotelName) => {
  const subject = 'Booking Cancellation';
  const html = template.bookingCancellation(guestName, cancelReason, hotelName);
  await sendEmail(to, subject, html);
};

const sendAdminNewBookingNotification = async (guestName, roomName, checkInDate, checkOutDate, totalPrice, bookingId, paymentId) => {
  const subject = 'New Booking Notification';
  const html = template.adminNewBookingNotification(guestName, roomName, checkInDate, checkOutDate, totalPrice, bookingId, paymentId);
  await sendEmail(process.env.ADMIN_EMAIL, subject, html);
};

module.exports = { sendEmail, sendResetPasswordEmail, sendVerificationEmail, sendBookingConfirmationEmail, sendBookingCancellationEmail, sendAdminNewBookingNotification };