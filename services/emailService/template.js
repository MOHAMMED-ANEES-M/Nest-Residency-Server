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

module.exports = { resetPassword, verifyEmail };