import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2) Define the email options
  const mailOptions = {
    from: "Meabu <congminh23092004@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  //3) Send the email
  await transporter.sendMail(mailOptions);
};

export const sendVerifyEmail = async (email, verificationLink) => {
  // Define the subject and text for the verification email
  const subject = "Verify Your Email for Caro League";
  const text = `
Hello!

Thank you for signing up for **Caro League**! To complete your registration, please verify your email address by clicking the link below:

👉 [Verify Your Email](${verificationLink})

If the link does not work, you can copy and paste the following URL into your browser:
${verificationLink}

If you did not create an account, please ignore this email.

Best regards,  
**The Caro League Team**
`;

  // Call the sendEmail function with the constructed options
  await sendEmail({
    email: email,
    subject: subject,
    message: text,
  });
};
