const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


const sendEmail = async (
    to,
    subject,
    text,
    html,
    attachments = []
) => {

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: to,

        subject: subject,

        text: text,

        html: html,

        attachments: attachments

    });

};


module.exports = sendEmail;