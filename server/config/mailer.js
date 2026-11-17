
import nodemailer from "nodemailer";

let transporter = null;

const getEmailConfig = () => {
  const requiredVariables = [
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
  ];

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing email environment variables: ${missingVariables.join(", ")}`
    );
  }

  const port = Number(process.env.EMAIL_PORT);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("Invalid EMAIL_PORT configuration");
  }

  return {
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    tls: {
      rejectUnauthorized: true,
    },
  };
};

export const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport(getEmailConfig());
  }

  return transporter;
};

export const verifyEmailConnection = async () => {
  const mailer = getTransporter();

  await mailer.verify();

  return true;
};

export default getTransporter;
