import type { APIRoute } from 'astro';

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
    const smtpPort = parseInt(import.meta.env.SMTP_PORT || '25');
    const smtpFrom = import.meta.env.SMTP_FROM || 'noreply@bespokefloorsanding.ie';
    const contactEmail = import.meta.env.CONTACT_EMAIL || 'info@bespokefloorsanding.ie';

    // Log the submission
    console.log('=== New Contact Form Submission ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone || 'Not provided'}`);
    console.log(`Location: ${location || 'Not specified'}`);
    console.log(`Message: ${message}`);
    console.log('===================================');

    // If SMTP is configured, try to send email
    if (smtpHost) {
      try {
        const nodemailer = await import('nodemailer');
        
        // Create transporter - for internal mailserver, no auth needed
        const transporter = nodemailer.default.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: false,
          tls: {
            rejectUnauthorized: false
          }
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
        
        console.log('Email sent successfully to', contactEmail);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue anyway - form submission is logged
      }
    } else {
      console.log('SMTP not configured - email not sent (submission logged above)');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Thank you for your message!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
