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

    // SMTP configuration from environment variables
    const smtpHost = import.meta.env.SMTP_HOST;
    const smtpPort = parseInt(import.meta.env.SMTP_PORT || '587');
    const smtpUser = import.meta.env.SMTP_USER;
    const smtpPass = import.meta.env.SMTP_PASS;
    const smtpFrom = import.meta.env.SMTP_FROM || 'noreply@bespokefloorsanding.ie';
    const contactEmail = import.meta.env.CONTACT_EMAIL || 'info@bespokefloorsanding.ie';

    if (!smtpHost) {
      console.error('SMTP not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser ? {
        user: smtpUser,
        pass: smtpPass,
      } : undefined,
    });

    // Send email
    await transporter.sendMail({
      from: `"Bespoke Floor Sanding Website" <${smtpFrom}>`,
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
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Location:</strong> ${location || 'Not specified'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
