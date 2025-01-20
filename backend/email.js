// email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email provider
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

const sendEmail = (to, subject, text) => {
  return transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
