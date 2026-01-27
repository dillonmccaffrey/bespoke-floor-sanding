# Microsite Improvements TODO

**Goal:** Improve SEO, drive traffic to main site, get people to call Nygell (087 402 7101)

## Sites
- https://floorsandingmonaghan.ie
- https://floorsandingcavan.ie

---

## 1. SEO Basics (Check & Fix)

### Favicon
- [x] Check favicon exists on both microsites
- [x] Ensure apple-touch-icon, favicon-32x32, favicon-16x16
- [x] Add site.webmanifest

### Meta Tags
- [x] Verify title tags are unique and keyword-rich
- [x] Verify meta descriptions are compelling with local keywords
- [x] Add Open Graph tags (og:title, og:description, og:image)
- [x] Add Twitter Card tags

### Structured Data
- [x] FAQPage schema (already done)
- [x] LocalBusiness schema with Monaghan/Cavan address
- [x] Review/AggregateRating schema

### Technical SEO
- [x] Ensure sitemap.xml exists and is valid
- [x] Ensure robots.txt allows crawling
- [x] Check canonical URLs are set correctly
- [x] Verify mobile-friendly (already Tailwind, should be fine)

---

## 2. Conversion Optimization

### CTAs to Call Nygell
- [x] Floating call button on mobile (like main site)
- [x] Prominent phone number in header
- [x] "Call Now" buttons throughout page
- [x] Click-to-call tracking with Umami events

### Links to Main Site
- [x] "View Full Gallery" → bespokefloorsanding.ie/gallery
- [x] "All Services" → bespokefloorsanding.ie/services
- [x] "Other Locations" → bespokefloorsanding.ie with area links
- [x] Footer link to main site

---

## 3. Umami Analytics

### Setup
- [x] Add Umami script to both microsites
- [x] Create website entries in Umami dashboard:
  - floorsandingmonaghan.ie (ID: d23ff6dc-cf11-4751-9e45-71dbbf373cad)
  - floorsandingcavan.ie (ID: 554fe327-76c5-42d4-a614-7e840f7c526b)
- [x] Get Website IDs

### Event Tracking
- [x] Track phone clicks: `data-umami-event="call-click"`
- [x] Track main site clicks: `data-umami-event="main-site-click"`
- [ ] Track form submissions (if contact form added)

### Share URLs
- [ ] Create shareable dashboard links for Nygell

---

## 4. Content Improvements

### Local SEO Content
- [x] Ensure all town names mentioned (Clones, Castleblayney, Carrickmacross, Virginia, Bailieborough, etc.)
- [x] Add "Serving [Town]" sections if not present
- [x] Local testimonials with town names (already done)

### Images
- [x] Verify all images have descriptive alt text with location keywords
- [x] Ensure hero image is optimized for web

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
