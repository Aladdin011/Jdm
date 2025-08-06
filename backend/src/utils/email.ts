import nodemailer from 'nodemailer';

interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  projectType: string;
  budget: string;
  timestamp: string;
}

// Create email transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Generic SMTP configuration
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send contact form email
export const sendContactEmail = async (data: ContactEmailData): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email service not configured - skipping email send');
    return;
  }

  const transporter = createTransporter();

  // Email to company
  const companyEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #EE690B;">New Contact Form Submission</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Contact Details</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
      </div>
      
      <div style="background: #ffffff; padding: 20px; border-left: 4px solid #EE690B;">
        <h3>Subject: ${data.subject}</h3>
        <p style="line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
      </div>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This email was sent from the JD Marc Limited website contact form.
      </p>
    </div>
  `;

  // Auto-reply email to customer
  const customerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #EE690B, #83371D);">
        <h1 style="color: white; margin: 0;">JD Marc Limited</h1>
        <p style="color: white; margin: 10px 0 0 0;">Building Africa's Future Cities</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <h2 style="color: #EE690B;">Thank You for Your Inquiry!</h2>
        
        <p>Dear ${data.name},</p>
        
        <p>Thank you for reaching out to JD Marc Limited. We have received your message and will get back to you within 24 hours.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Message Summary:</h3>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Project Type:</strong> ${data.projectType}</p>
          <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li>Explore our <a href="https://jdmarcng.com/projects" style="color: #EE690B;">portfolio of completed projects</a></li>
          <li>Learn more <a href="https://jdmarcng.com/about" style="color: #EE690B;">about our company</a></li>
          <li>Contact us directly at <a href="tel:+2349291399" style="color: #EE690B;">+234 9 291 3991</a></li>
        </ul>
        
        <p>Best regards,<br>
        <strong>The JD Marc Limited Team</strong></p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>JD Marc Limited | Abuja, Nigeria<br>
        Email: info@jdmarcng.com | Phone: +234 9 291 3991<br>
        Website: <a href="https://jdmarcng.com" style="color: #EE690B;">jdmarcng.com</a></p>
      </div>
    </div>
  `;

  try {
    // Send email to company
    await transporter.sendMail({
      from: `"${data.name}" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form: ${data.subject}`,
      html: companyEmailHtml,
      replyTo: data.email,
    });

    // Send auto-reply to customer
    await transporter.sendMail({
      from: `"JD Marc Limited" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: 'Thank you for contacting JD Marc Limited',
      html: customerEmailHtml,
    });

    console.log('Contact emails sent successfully');
  } catch (error) {
    console.error('Error sending contact emails:', error);
    throw error;
  }
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
};
