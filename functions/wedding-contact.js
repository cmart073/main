// Cloudflare Pages Function to handle wedding contact form
// Place your email or webhook URL in the environment variables

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    
    const data = {
      name: formData.get('name'),
      weddingDetails: formData.get('wedding-details'),
      connection: formData.get('connection'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    };
    
    // Option 1: Send to an email service (you'll need to configure)
    // await sendEmail(data);
    
    // Option 2: Send to a webhook (Discord, Slack, etc.)
    // await fetch('YOUR_WEBHOOK_URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    
    // For now, just log it
    console.log('Form submission:', data);
    
    // Redirect to a thank you page or back to the form with a success message
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
