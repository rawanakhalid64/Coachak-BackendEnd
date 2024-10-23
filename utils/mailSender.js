const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
  try {
    // create Transport to send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,

      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
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
    console.log(error.message);
  }
};
module.exports = mailSender;
