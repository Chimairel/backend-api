import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Portfolio App" <noreply@portfolio.com>',
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome to the App!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });
    console.log(`Verification email successfully sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
