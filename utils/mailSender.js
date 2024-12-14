const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
  try {
    // create Transport to send email
<<<<<<< HEAD
    console.log(process.env.MAIL_HOST);
    console.log({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS ? "********" : "Not Set",
    });
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
=======
    console.log(email, title, body);
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
>>>>>>> dea498c4cbda935d24e9ebcf9aed2f46fe93250c
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      // Add a comma here
      
    });
    const info = await transporter.sendMail({
      from: "coachak.com",
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log("Error", error);
  }
};
module.exports = mailSender;
