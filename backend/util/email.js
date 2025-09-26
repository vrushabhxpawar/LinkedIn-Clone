import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});
import nodemailer from "nodemailer";
import {
  createWelcomeEmailTemplate,
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate
} from "./mailTemplate.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (recipient, fullname, profileUrl) => {
  try {
    const info = await transporter.sendMail({
      from: `"LinkedIn" ${process.env.FROM_EMAIL}`,
      to: recipient,
      subject: "Welcome email",
      html: createWelcomeEmailTemplate(fullname, profileUrl),
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
};

export const sendcommentNotificationEmail = async (
  recipient,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  try {
    const info = await transporter.sendMail({
      from: `"LinkedIn" ${process.env.FROM_EMAIL}`,
      to: recipient,
      subject: "Comment notification",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
};

export const sendConnectionAcceptedEmail = async (senderEmail , senderName, recipientName, profileUrl) => {
  try {
    const info = await transporter.sendMail({
      from: `"LinkedIn" ${process.env.FROM_EMAIL}`,
      to: senderEmail,
      subject:  `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
};

