const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
  try {
    // create Transport to send email
    console.log(email, title, body);
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
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
    console.log("Error", error);
  }
};
module.exports = mailSender;
