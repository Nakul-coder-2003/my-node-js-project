import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";
  const text = `Hello ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

export async function sendLoginEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";
  const text = `Hello ${name},\n\nThank you for Login at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for Login at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

export const sendDebitEmail = async (email, name, amount, remainingBalance) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Money Debited from your Wallet",
    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #d9534f;">Debit Alert!</h2>
                <p>Hello <b>${name}</b>,</p>
                <p>An amount of <b style="font-size: 18px;">₹${amount}</b> has been successfully transferred from your wallet.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;"><b>Remaining Balance:</b> ₹${remainingBalance}</p>
                </div>
                <p>Thank you for using our services!</p>
            </div>
        `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendCreditEmail = async (email, name, amount, newBalance) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Money Credited to your Wallet 🎉",
    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #5cb85c;">Money Received!</h2>
                <p>Hello <b>${name}</b>,</p>
                <p>Great news! An amount of <b style="font-size: 18px;">₹${amount}</b> has been added to your wallet.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;"><b>New Balance:</b> ₹${newBalance}</p>
                </div>
                <p>Enjoy your newly added funds!</p>
            </div>
        `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendOtpEmail = async (email, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Hello <b>${name}</b>,</p>
                <p>Your OTP to reset your password is: <b style="font-size: 24px; color: blue;">${otp}</b></p>
                <p>This OTP is valid for only 15 minutes. Do not share it with anyone.</p>
          </div>
        `,
  };
  await transporter.sendMail(mailOptions);
};


export const sendMoneyRequestEmail = async(payerEmail,payerName,requesterName,amount)=>{
   const mailOptions = {
     from:process.env.EMAIL_USER,
     to:payerEmail,
     subject:"Money Request Pending",
     html: `<p>Hello <b>${payerName}</b>,</p>
               <p><b>${requesterName}</b> has requested <b>₹${amount}</b> from you.</p>
               <p>Please log in to your app to approve or reject this request.</p>`
   };
   await transporter.sendMail(mailOptions);
}

export const sendApprovedEmail = async(requesterEmail,requesterName,payerName,amount)=>{
    const mailOptions = {
      from:process.env.EMAIL_USER,
      to:requesterEmail,
      subject:"Money Request Approved! 🎉",
      html: `<p>Hello <b>${requesterName}</b>,</p>
               <p>Good news! <b>${payerName}</b> has approved your request for <b>₹${amount}</b>.</p>
               <p>The money has been added to your wallet.</p>`
    };
    await transporter.sendMail(mailOptions);
}

export const sendRejectedEmail = async(requesterEmail,requesterName,payerName,amount)=>{
    const mailOptions = {
      from : process.env.EMAIL_USER,
      to: requesterEmail,
      subject: "Money Request Rejected",
      html: `<p>Hello <b>${requesterName}</b>,</p>
              <p>We wanted to let you know that <b>${payerName}</b> has declined your request for <b>₹${amount}</b>.</p>`
    };
    await transporter.sendMail(mailOptions);
}