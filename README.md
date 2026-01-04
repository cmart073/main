# cmart073.com

Personal website for Chris Martin

## Deployment Instructions

### Initial Setup

1. **Create a new GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cmart073.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to your Cloudflare dashboard
   - Navigate to Pages
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose your GitHub repository
   - Configure build settings:
     - **Framework preset:** None
     - **Build command:** (leave empty)
     - **Build output directory:** /
   - Click "Save and Deploy"

3. **Configure custom domain:**
   - In Cloudflare Pages project settings, go to "Custom domains"
   - Add your domain: cmart073.com
   - Cloudflare will automatically configure DNS if your domain is on Cloudflare

### File Structure

```
/
├── index.html          # Main landing page
├── weddings.html       # Wedding officiant page
├── nav.html           # Reusable navigation component
└── README.md          # This file
```

### Adding New Pages

1. Create a new HTML file in the root directory
2. Add the navigation include:
   ```html
   <div id="nav-container"></div>
   
   <script>
     fetch('/nav.html')
       .then(response => response.text())
       .then(html => {
         document.getElementById('nav-container').innerHTML = html;
       });
   </script>
   ```
3. Update `nav.html` to include the new page in navigation
4. Add a link on the main landing page (`index.html`)

### Updating Navigation

Edit `nav.html` to add or modify navigation links. Changes will automatically apply to all pages.

### Form Submissions

The wedding contact form is configured for Netlify Forms. If you're using Cloudflare Pages:

**Option 1: Cloudflare Pages Functions**
- Create a `functions/wedding-contact.js` file to handle form submissions

**Option 2: External Form Service**
- Use a service like Formspree, Getform, or Basin
- Update the form action in `weddings.html`

**Option 3: Email Service**
- Use EmailJS or similar to send form data via email
- Add client-side JavaScript to handle form submission

## Notes

- The site uses Google Fonts (Crimson Pro and Inter)
- Form currently configured for Netlify - update for your hosting platform
- Navigation loads dynamically via JavaScript
