"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const validation_1 = require("../middleware/validation");
const email_1 = require("../utils/email");
const router = express_1.default.Router();
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: "Too many contact form submissions, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post("/", contactLimiter, validation_1.validateContactForm, async (req, res) => {
    try {
        const { name, email, phone, subject, message, projectType, budget } = req.body;
        console.log("Contact form submission:", {
            name,
            email,
            subject,
            timestamp: new Date().toISOString(),
        });
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
        if (process.env.EMAIL_SERVICE_ENABLED === "true") {
            try {
                await (0, email_1.sendContactEmail)(emailData);
                console.log("Contact email sent successfully");
            }
            catch (emailError) {
                console.error("Error sending contact email:", emailError);
            }
        }
        const io = req.app.get('io');
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
            io.to('admin-dashboard').emit('new-contact', notificationData);
            io.emit('notification', {
                type: 'info',
                message: 'New contact form submission received',
                timestamp: new Date().toISOString()
            });
            console.log('📡 Real-time notification sent for contact submission');
        }
        res.status(200).json({
            success: true,
            message: "Thank you for your inquiry! We will get back to you soon.",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to process contact form submission",
            message: "Please try again later or contact us directly.",
        });
    }
});
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
exports.default = router;
//# sourceMappingURL=contact.js.map