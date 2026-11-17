
import "dotenv/config";

import {
  verifyEmailConnection,
} from "../config/mailer.js";

import {
  sendEmail,
} from "../services/emailService.js";

const testEmail = async () => {
  try {
    console.log("Checking SMTP configuration...");

    await verifyEmailConnection();

    console.log("SMTP connection successful!");

    console.log("Sending test email...");

    const result = await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "MKS Crackers - SMTP Test",
      text: `
Hello,

This is a test email from MKS Crackers.

Your SMTP email configuration is working successfully.

MKS Crackers Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>MKS Crackers</h2>
          <p>Your SMTP email configuration is working successfully.</p>
          <strong>Email service test successful!</strong>
        </div>
      `,
    });

    console.log("Test email sent successfully!");
    console.log("Message ID:", result.messageId);

  } catch (error) {
    console.error("SMTP test failed:", error.message);
    process.exitCode = 1;
  }
};

testEmail();
