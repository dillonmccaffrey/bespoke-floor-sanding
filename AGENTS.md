# Bespoke Floor Sanding Website

## Project Overview
A premium website for Bespoke Floor Sanding Co. with strong CTAs to call/email, client-editable content, and local SEO focus.

## Tech Stack
- **Framework**: Astro with TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Decap CMS (Git-based)
- **Analytics**: Umami (self-hosted)
- **Email**: Resend API

## Color Scheme
- Primary (Gold): `#C4A052`
- Background (Dark): `#1A1A1A`
- Background Light: `#2A2A2A`
- Text: `#F5F5F5`
- Text Muted: `#B0B0B0`
- Accent (Cream): `#E8DCC4`

## Contact Information
- **Business**: Bespoke Floor Sanding Co.
- **Owner**: Nygell
- **Phone**: +353 87 402 7101
- **Email**: info@bespokefloorsanding.ie
- **Service Areas**: Dublin, Monaghan, Cavan, Meath, Louth, Midlands, North Ireland

## Key Requirements
1. **CTA Focus**: Every section should drive users to call or email
2. **Mobile-first**: Floating call button on mobile
3. **Local SEO**: Location-specific pages for each service area
4. **Client-editable**: Business owner can update testimonials, gallery, services via Decap CMS
5. **Analytics**: Track all CTA clicks with Umami events

## Commands
```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Directory Structure (Target)
```
src/
├── components/       # Reusable UI components
├── layouts/          # Page layouts
├── pages/            # Astro pages
├── content/          # Markdown content (testimonials, gallery, services)
│   ├── testimonials/
│   ├── gallery/
│   └── services/
└── styles/           # Global styles
public/
├── images/           # Static images
└── admin/            # Decap CMS
```

## Environment Variables
```
RESEND_API_KEY=       # For contact form emails
UMAMI_WEBSITE_ID=     # Umami tracking ID
UMAMI_URL=            # Umami instance URL
```
