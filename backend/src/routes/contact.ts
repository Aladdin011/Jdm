import express from "express";
import rateLimit from "express-rate-limit";
import { validateContactForm } from "../middleware/validation";
import { sendContactEmail } from "../utils/email";
import { Server } from "socket.io";

const router = express.Router();

// Rate limiting for contact form (more restrictive)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 contact form submissions per windowMs
  message: {
    error: "Too many contact form submissions, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form submission endpoint
router.post("/", contactLimiter, validateContactForm, async (req, res) => {
  try {
    const { name, email, phone, subject, message, projectType, budget } =
      req.body;

    // Log the contact form submission
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      timestamp: new Date().toISOString(),
    });

    // Prepare email data
    const emailData = {
      name,
      email,
      phone: phone || "Not provided",
      subject: subject || "Contact Form Inquiry",
      message,
      projectType: projectType || "General Inquiry",
      budget: budget || "Not specified",
      timestamp: new Date().toISOString(),
    };

    // Send email (if email service is configured)
    if (process.env.EMAIL_SERVICE_ENABLED === "true") {
      try {
        await sendContactEmail(emailData);
        console.log("Contact email sent successfully");
      } catch (emailError) {
        console.error("Error sending contact email:", emailError);
        // Don't fail the request if email sending fails
      }
    }

    // Emit real-time notification to admin dashboard
    const io: Server = req.app.get('io');
    if (io) {
      const notificationData = {
        id: Date.now().toString(),
        type: 'contact-submission',
        data: {
          name: emailData.name,
          email: emailData.email,
          subject: emailData.subject,
          projectType: emailData.projectType,
          timestamp: emailData.timestamp
        },
        message: `New contact form submission from ${emailData.name}`,
        timestamp: new Date().toISOString()
      };

      // Emit to admin dashboard room
      io.to('admin-dashboard').emit('new-contact', notificationData);

      // Also emit a general notification
      io.emit('notification', {
        type: 'info',
        message: 'New contact form submission received',
        timestamp: new Date().toISOString()
      });

      console.log('📡 Real-time notification sent for contact submission');
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Thank you for your inquiry! We will get back to you soon.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to process contact form submission",
      message: "Please try again later or contact us directly.",
    });
  }
});

// Get contact information
router.get("/info", (req, res) => {
  const contactInfo = {
    company: "JD Marc Limited",
    email: "info@jdmarcng.com",
    phone: "+234 9 291 3991",
    address: "Abuja, Nigeria",
    website: "https://jdmarcng.com",
    businessHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    socialMedia: {
      facebook: "https://facebook.com/jdmarclimited",
      linkedin: "https://linkedin.com/company/jdmarclimited",
      twitter: "https://twitter.com/jdmarclimited",
      instagram: "https://instagram.com/jdmarclimited",
    },
  };

  res.status(200).json(contactInfo);
});

export default router;
