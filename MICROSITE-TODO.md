# Microsite Improvements TODO

**Goal:** Improve SEO, drive traffic to main site, get people to call Nygell (087 402 7101)

## Sites
- https://floorsandingmonaghan.ie
- https://floorsandingcavan.ie

---

## 1. SEO Basics (Check & Fix)

### Favicon
- [ ] Check favicon exists on both microsites
- [ ] Ensure apple-touch-icon, favicon-32x32, favicon-16x16
- [ ] Add site.webmanifest

### Meta Tags
- [ ] Verify title tags are unique and keyword-rich
- [ ] Verify meta descriptions are compelling with local keywords
- [ ] Add Open Graph tags (og:title, og:description, og:image)
- [ ] Add Twitter Card tags

### Structured Data
- [x] FAQPage schema (already done)
- [ ] LocalBusiness schema with Monaghan/Cavan address
- [ ] Review/AggregateRating schema

### Technical SEO
- [ ] Ensure sitemap.xml exists and is valid
- [ ] Ensure robots.txt allows crawling
- [ ] Check canonical URLs are set correctly
- [ ] Verify mobile-friendly (already Tailwind, should be fine)

---

## 2. Conversion Optimization

### CTAs to Call Nygell
- [ ] Floating call button on mobile (like main site)
- [ ] Prominent phone number in header
- [ ] "Call Now" buttons throughout page
- [ ] Click-to-call tracking with Umami events

### Links to Main Site
- [ ] "View Full Gallery" → bespokefloorsanding.ie/gallery
- [ ] "All Services" → bespokefloorsanding.ie/services
- [ ] "Other Locations" → bespokefloorsanding.ie with area links
- [ ] Footer link to main site

---

## 3. Umami Analytics

### Setup
- [ ] Add Umami script to both microsites
- [ ] Create website entries in Umami dashboard:
  - floorsandingmonaghan.ie
  - floorsandingcavan.ie
- [ ] Get Website IDs

### Event Tracking
- [ ] Track phone clicks: `data-umami-event="call-click"`
- [ ] Track main site clicks: `data-umami-event="main-site-click"`
- [ ] Track form submissions (if contact form added)

### Share URLs
- [ ] Create shareable dashboard links for Nygell

---

## 4. Content Improvements

### Local SEO Content
- [ ] Ensure all town names mentioned (Clones, Castleblayney, Carrickmacross, Virginia, Bailieborough, etc.)
- [ ] Add "Serving [Town]" sections if not present
- [ ] Local testimonials with town names (already done)

### Images
- [ ] Verify all images have descriptive alt text with location keywords
- [ ] Ensure hero image is optimized for web

---

## 5. Deployment

- [ ] Build and test locally
- [ ] Deploy to VPS
- [ ] Verify all changes live
- [ ] Re-submit sitemaps to Google Search Console

---

## Files to Edit

### Monaghan
- `/home/dillon/projects/monaghan-floor-sanding/src/pages/index.astro`
- `/home/dillon/projects/monaghan-floor-sanding/src/layouts/Layout.astro`
- `/home/dillon/projects/monaghan-floor-sanding/public/` (favicon files)

### Cavan
- `/home/dillon/projects/cavan-floor-sanding/src/pages/index.astro`
- `/home/dillon/projects/cavan-floor-sanding/src/layouts/Layout.astro`
- `/home/dillon/projects/cavan-floor-sanding/public/` (favicon files)

---

## Reference

- Main site Analytics: https://analytics.bespokefloorsanding.ie
- Nygell's phone: 087 402 7101
- VPS: `ssh vps`
- Umami Website ID (main): 0d04802d-3eb9-4704-bcdf-15eb578c9f72
