import nodemailer from "nodemailer";

const { EMAIL_PASSWORD, EMAIL_USER } = process.env;

type optionsType = {
  email: string;
  message: string;
  subject: string;
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
    from: EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};

export default sendEmail;
