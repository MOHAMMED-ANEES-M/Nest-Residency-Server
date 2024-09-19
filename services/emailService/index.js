const nodemailer = require('nodemailer');
const template = require('./template');
const dotenv = require('dotenv').config()


const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});


const sendEmail = async (to, subject, html) => {
    const msg = { from: `${process.env.APP_NAME} ${process.env.EMAIL_FROM}`, to, subject, html };
    await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, otp) => {
    const subject = 'Reset password';
    const html = template.resetPassword(otp, process.env.APP_NAME);
    await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, otp) => {
    const subject = 'Email Verification';
    const html = template.verifyEmail(otp, process.env.APP_NAME);
    await sendEmail(to, subject, html);
};

module.exports = { sendEmail, sendResetPasswordEmail, sendVerificationEmail };