import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, location, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const smtpHost = import.meta.env.SMTP_HOST || 'mailserver';
    const smtpPort = parseInt(import.meta.env.SMTP_PORT || '25');
    const smtpFrom = import.meta.env.SMTP_FROM || 'noreply@bespokefloorsanding.ie';
    const contactEmail = import.meta.env.CONTACT_EMAIL || 'contact@bespokefloorsanding.ie';

    // Log the submission
    console.log('=== New Contact Form Submission ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone || 'Not provided'}`);
    console.log(`Location: ${location || 'Not specified'}`);
    console.log(`Message: ${message}`);
    console.log(`Sending to: ${contactEmail}`);
    console.log('===================================');

    // Create transporter for internal mail server
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"Bespoke Floor Sanding" <${smtpFrom}>`,
      to: contactEmail,
      replyTo: email,
      subject: `New Quote Request from ${name}`,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Location: ${location || 'Not specified'}

Message:
${message}

---
Reply directly to this email to respond to the customer.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C4A052; border-bottom: 2px solid #C4A052; padding-bottom: 10px;">
            New Quote Request
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 100px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${phone ? `<a href="tel:${phone}">${phone}</a>` : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Location:</td>
              <td style="padding: 8px 0;">${location || 'Not specified'}</td>
            </tr>
          </table>
          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Reply directly to this email to respond to the customer.
          </p>
        </div>
      `,
    });

    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Thank you for your message!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email. Please call us directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
