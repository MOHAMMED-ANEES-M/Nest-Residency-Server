const generateOTP = () => {
    let otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp).toString().padStart(6, '0');
    return otp;
};

module.exports = { generateOTP };