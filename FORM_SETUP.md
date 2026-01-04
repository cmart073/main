# Form Handling Options

The wedding contact form needs a backend to handle submissions. Here are your options:

## Option 1: Cloudflare Pages Functions (Included)

The `functions/wedding-contact.js` file is set up to handle form submissions.

**To activate:**
1. Deploy to Cloudflare Pages (it will automatically detect the function)
2. Choose one of these methods to receive form data:

### Method A: Email via Resend API (Recommended)
```javascript
// In functions/wedding-contact.js, add:
const RESEND_API_KEY = context.env.RESEND_API_KEY;

const emailResponse = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'wedding-form@cmart073.com',
    to: 'your-email@example.com',
    subject: `Wedding Inquiry from ${data.name}`,
    html: `
      <h2>New Wedding Inquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Wedding:</strong> ${data.weddingDetails}</p>
      <p><strong>Connection:</strong> ${data.connection}</p>
      <p><strong>Message:</strong> ${data.message}</p>
    `
  })
});
```

Then set the environment variable in Cloudflare Pages settings:
- Variable: `RESEND_API_KEY`
- Value: Your Resend API key (get free at resend.com)

### Method B: Discord Webhook
```javascript
// In functions/wedding-contact.js, add:
const DISCORD_WEBHOOK = context.env.DISCORD_WEBHOOK;

await fetch(DISCORD_WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: `**New Wedding Inquiry**\n**Name:** ${data.name}\n**Wedding:** ${data.weddingDetails}\n**Connection:** ${data.connection}\n**Message:** ${data.message}`
  })
});
```

## Option 2: Formspree (Easiest)

1. Sign up at formspree.io (free tier available)
2. Create a new form and get your form endpoint
3. Update `weddings.html` form action:
```html
<form id="wedding-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## Option 3: EmailJS (No Backend)

1. Sign up at emailjs.com (free tier available)
2. Add this before closing `</body>` tag in weddings.html:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
  emailjs.init('YOUR_PUBLIC_KEY');
  
  document.getElementById('wedding-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
      .then(() => {
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('wedding-form').style.display = 'none';
      });
  });
</script>
```

## Option 4: Simple Mailto (Fallback)

If you just want something that works immediately:

Replace the form in `weddings.html` with:
```html
<a href="mailto:your-email@example.com?subject=Wedding Inquiry" class="cta-primary">
  Email me about your wedding
</a>
```

## Recommendation

For professional use: **Cloudflare Pages Functions + Resend API**
For quick setup: **Formspree** (5 minutes to set up)
For immediate deployment: **Simple mailto link**
