import sendEmail from "../../config/sendEmail.js";
import { contactEmailTemplate } from "../../utils/EmailTemplate/contactemail.js";

export const Contactmail = async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    if (!email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required !!",
        status: false,
      });
    }

    // Create HTML template
    const htmlcontent = contactEmailTemplate({
      email,
      subject,
      message,
    });

    // Send Email
    await sendEmail({
      to: process.env.EMAIL_USER,   
      subject: subject,
      html: htmlcontent,
    });

    return res.status(200).json({
      message: "Message sent successfully",
      status: true,
    });

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Something went wrong",
      status: false,
    });
  }
};
