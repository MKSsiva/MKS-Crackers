
import getTransporter from "../config/mailer.js";

const getSender = () => {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER;
};

// Reusable email sending service
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!to || !subject || (!text && !html)) {
      throw new Error(
        "Recipient, subject and email content are required"
      );
    }

    const transporter = getTransporter();

    const result = await transporter.sendMail({
      from: getSender(),
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    // Do not log SMTP passwords or authentication configuration
    console.error("Email sending failed:", error.message);

    throw new Error("Unable to send email");
  }
};

// Send a welcome email after customer registration
export const sendWelcomeEmail = async ({
  name,
  email,
}) => {
  const safeName = String(name || "Customer")
    .replace(/[<>&"']/g, "");

  return sendEmail({
    to: email,
    subject: "Welcome to MKS Crackers!",
    text: `Hello ${safeName},

Welcome to MKS Crackers!

Thank you for registering with us.

We look forward to serving you.

MKS Crackers Team`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to MKS Crackers!</h2>

        <p>Hello ${safeName},</p>

        <p>
          Thank you for registering with MKS Crackers.
        </p>

        <p>
          We look forward to serving you.
        </p>

        <strong>MKS Crackers Team</strong>
      </div>
    `,
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async ({
  name,
  email,
  orderId,
  amount,
}) => {
  const safeName = String(name || "Customer")
    .replace(/[<>&"']/g, "");

  return sendEmail({
    to: email,
    subject: `MKS Crackers - Order #${orderId} Confirmed`,
    text: `Hello ${safeName},

Your order #${orderId} has been confirmed.

Order Amount: ₹${amount}

Thank you for shopping with MKS Crackers.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Order Confirmed!</h2>

        <p>Hello ${safeName},</p>

        <p>Your order has been confirmed.</p>

        <p>
          <strong>Order ID:</strong> #${orderId}
        </p>

        <p>
          <strong>Order Amount:</strong> ₹${amount}
        </p>

        <p>Thank you for shopping with MKS Crackers!</p>
      </div>
    `,
  });
};
