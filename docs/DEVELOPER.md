# Developer Documentation

## Tech Stack

- **Framework**: Astro 5.x with TypeScript
- **Styling**: Tailwind CSS 4.x
- **CMS**: Decap CMS (Git-based)
- **Analytics**: Umami (self-hosted)
- **Email**: Resend API
- **Deployment**: Node.js adapter (SSR for API routes)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Decap CMS locally
npx decap-server
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.astro      # Navigation header
│   ├── Footer.astro      # Site footer
│   ├── Hero.astro        # Homepage hero section
│   ├── Services.astro    # Services grid
│   ├── Gallery.astro     # Before/after gallery
│   ├── Testimonials.astro # Customer reviews
│   ├── ServiceAreas.astro # Coverage map
│   ├── SchemaOrg.astro   # JSON-LD structured data
│   ├── Analytics.astro   # Umami tracking
│   └── FloatingCallButton.astro
├── layouts/
│   ├── Layout.astro      # Base layout
│   └── LocationPage.astro # SEO location pages
├── pages/
│   ├── index.astro       # Homepage
│   ├── services.astro    # Services page
│   ├── gallery.astro     # Gallery page
│   ├── contact.astro     # Contact form
│   ├── floor-sanding-*.astro # Location pages
│   └── api/
│       └── contact.ts    # Contact form API
├── content/              # Markdown content (CMS-managed)
│   ├── testimonials/
│   ├── gallery/
│   ├── services/
│   └── settings/
└── styles/
    └── global.css        # Tailwind config + theme
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required for contact form
RESEND_API_KEY=re_xxxxxxxx

# Required for analytics
UMAMI_WEBSITE_ID=your-website-id
UMAMI_URL=https://your-umami-instance.com
```

## Deployment

### Option 1: Node.js Server

```bash
npm run build
node dist/server/entry.mjs
```

### Option 2: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["node", "dist/server/entry.mjs"]
```

### Option 3: Platform (Vercel, Netlify)

Change the adapter in `astro.config.mjs`:

```js
// For Vercel
import vercel from '@astrojs/vercel/serverless';
export default defineConfig({
  adapter: vercel(),
  // ...
});

// For Netlify
import netlify from '@astrojs/netlify';
export default defineConfig({
  adapter: netlify(),
  // ...
});
```

## Decap CMS Setup

### For Production (Git Gateway)

1. Enable Identity and Git Gateway on Netlify
2. Invite the business owner via email
3. They access `/admin` and log in

### For Local Development

```bash
# Terminal 1: Run Astro dev server
npm run dev

# Terminal 2: Run Decap CMS proxy
npx decap-server
```

Then access `http://localhost:4321/admin`

## Umami Analytics Setup

1. Self-host Umami (Docker or Railway/Vercel)
2. Create a website in Umami dashboard
3. Copy the Website ID
4. Set `UMAMI_WEBSITE_ID` and `UMAMI_URL` env vars

The Analytics component auto-tracks:
- Page views
- `cta-call`: Phone link clicks
- `cta-email`: Email link clicks
- `form-submit`: Contact form submissions
- `gallery-view`: Gallery section views

## SEO

### Location Pages

Create new location pages by copying an existing one:

```astro
---
import LocationPage from '../layouts/LocationPage.astro';
---

<LocationPage 
  location="NewArea" 
  description="Floor sanding in NewArea..."
/>
```

### Schema.org

The `SchemaOrg.astro` component adds:
- LocalBusiness schema
- Service offerings
- Aggregate reviews
- Service areas

## Color Scheme

Defined in `src/styles/global.css`:

```css
--color-primary: #C4A052;      /* Gold */
--color-background: #1A1A1A;   /* Dark */
--color-text: #F5F5F5;         /* Light */
```

## Adding New Features

1. Create component in `src/components/`
2. Import in relevant page or layout
3. Run `npm run build` to verify
4. Commit with conventional commit message

## Troubleshooting

### Build fails
- Check for TypeScript errors
- Ensure all imports are correct
- Run `npm run build` locally first

### CMS not saving
- Verify Git Gateway is enabled
- Check branch name matches config
- Ensure user has write access

### Emails not sending
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for errors
- Domain must be verified in Resend
