import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const { EMAIL_PASSWORD, EMAIL_USER } = process.env;

type optionsType = {
  email: string | undefined;
  subject: string;
  html: string;
};

const sendEmail = async (options: optionsType) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Job Finder",
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transport.sendMail(mailOptions);
};

export default sendEmail;
