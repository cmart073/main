// Cloudflare Pages Function to handle wedding contact form
// Stores submissions in KV and sends email notification

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    
    const submission = {
      id: Date.now().toString(),
      name: formData.get('name'),
      weddingDetails: formData.get('wedding-details'),
      connection: formData.get('connection'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Store in KV (you'll need to bind a KV namespace called WEDDING_SUBMISSIONS)
    if (context.env.WEDDING_SUBMISSIONS) {
      await context.env.WEDDING_SUBMISSIONS.put(
        `submission:${submission.id}`,
        JSON.stringify(submission)
      );
    }
    
    // Send email notification using MailChannels (free on Cloudflare)
    try {
      // Get email from environment variable
      const toEmail = context.env.ADMIN_EMAIL || 'noreply@cmart073.com';
      
      await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: toEmail, name: 'Chris Martin' }],
          }],
          from: {
            email: 'weddings@cmart073.com',
            name: 'Wedding Contact Form',
          },
          subject: `Wedding Inquiry from ${submission.name}`,
          content: [{
            type: 'text/html',
            value: `
              <h2>New Wedding Inquiry</h2>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Wedding:</strong> ${submission.weddingDetails}</p>
              <p><strong>Connection:</strong> ${submission.connection}</p>
              <p><strong>Message:</strong> ${submission.message || 'None provided'}</p>
              <p><strong>Submitted:</strong> ${new Date(submission.timestamp).toLocaleString()}</p>
              <br>
              <p><a href="https://cmart073.com/admin.html">View in admin panel</a></p>
            `,
          }],
        }),
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      // Continue even if email fails - data is still in KV
    }
    
    // Redirect back with success message
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/weddings.html?success=true'
      }
    });
    
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response('Error processing form', { status: 500 });
  }
}
