const bookingConfirmation = (guestName, roomNumber, roomName, checkInDate, checkOutDate, totalPrice, paymentId, hotelName) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #4CAF50;">Booking Confirmation - ${hotelName}</h2>
    <p>Dear ${guestName},</p>
    <p>Thank you for choosing ${hotelName}! Your booking has been successfully confirmed. Below are your booking details:</p>
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr style="background-color: #f2f2f2;">
        <th colspan="2" style="padding: 12px; border: 1px solid #ddd; text-align: left;">Booking Details</th>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Guest Name</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${guestName}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Room Number</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${roomNumber}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Room Type</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${roomName}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-In Date</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${checkInDate}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-Out Date</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${checkOutDate}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Price</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${totalPrice} INR</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Payment ID</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${paymentId}</td>
      </tr>
    </table>
    <p>If you have any questions or need further assistance, feel free to reach out to us at our customer service. We look forward to welcoming you soon!</p>
    <p>Best regards,</p>
    <p><strong>${hotelName} Team</strong></p>
  </div>
`;

const resetPassword = (otp, appName) => `
  <h3>Dear user,</h3>
  <h4>You have requested to reset your password for your ${appName} account. Use the following OTP to reset your password:</h4>
  <h2>${otp}</h2>
  <h4>If you did not request this, please ignore this email.</h4>
`;

const verifyEmail = (otp, appName) => `
  <h3>Dear user,</h3>
  <h4>Thank you for registering with ${appName}. Please use the following OTP to verify your email:</h4>
  <h2>${otp}</h2>
  <h4>If you did not register, please ignore this email.</h4>
`;

const bookingCancellation = (guestName, cancelReason, hotelName) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #FF0000;">Booking Cancellation - ${hotelName}</h2>
    <p>Dear ${guestName},</p>
    <p>We regret to inform you that your booking at ${hotelName} has been cancelled. Below is the reason for the cancellation:</p>
    <p style="font-weight: bold; color: #FF0000;">Cancellation Reason: ${cancelReason}</p>
    <p>If you have any questions or need further assistance, please reach out to us at our customer service.</p>
    <p>We apologize for any inconvenience caused and hope to serve you in the future.</p>
    <p>Best regards,</p>
    <p><strong>${hotelName} Team</strong></p>
  </div>
`;

module.exports = { bookingConfirmation, resetPassword, verifyEmail, bookingCancellation };
