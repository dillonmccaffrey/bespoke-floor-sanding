# Bespoke Floor Sanding - Project Status

**Last Updated:** 2026-01-25

## Project Overview

Three interconnected sites for Nygell's floor sanding business:
- **Main site:** bespokefloorsanding.ie
- **Monaghan microsite:** floorsandingmonaghan.ie
- **Cavan microsite:** floorsandingcavan.ie

## Completed (24 Original User Stories ✅)

All original PRD user stories are complete:
- Astro + Tailwind with dark/gold theme
- Header, Hero, Services, Gallery, Testimonials, Service Areas, Footer
- Contact form with Resend email integration
- 5 location pages (Dublin, Monaghan, Cavan, Meath, Midlands)
- Schema.org structured data, sitemap, robots.txt
- Decap CMS at /admin
- Umami analytics with event tracking
- Floating mobile call button
- Owner and developer documentation

## Additional Features Built (Not in Original PRD)

- **Microsites:** Two satellite sites for local SEO (Monaghan, Cavan)
- **FAQ sections:** Added to all three sites with Schema.org FAQPage markup
- **404 pages:** Custom error pages for all sites
- **Theme toggle:** Light/dark mode switch
- **Real images:** Gallery, services, hero images generated/added
- **Domain migration:** Switched from bespoke.dillonmccaffrey.dev to bespokefloorsanding.ie
- **Physical address:** Added to LocalBusiness schema (Derryledigan, Scotstown, Monaghan)

## Uncommitted Work in Progress

```
Modified:
- src/pages/index.astro
- src/pages/services.astro

New files:
- public/images/*.jpg (hero, gallery, service images)
- src/components/FAQ.astro
- src/pages/404.astro
- src/content/gallery/project-4.md, project-5.md, project-6.md
```

---

## OUTSTANDING TASKS

### Automated (Can be done by Amp)

- [ ] Improve meta descriptions on remaining location pages
- [ ] Add Google Reviews integration/widget
- [ ] Generate more local content for microsites
- [ ] Commit and push uncommitted work

### Manual (Requires Dillon/Nygell)

#### Deployment & DNS
- [ ] Deploy latest changes to VPS (main site)
- [ ] Deploy Monaghan microsite to VPS
- [ ] Deploy Cavan microsite to VPS
- [ ] Fix Cavan DNS - A records to 195.201.3.154
- [ ] Get SSL certificate for Cavan site

#### Email Setup
- [ ] Set up Cloudflare Email Routing for contact@bespokefloorsanding.ie

#### Analytics & Tracking
- [ ] Configure Umami analytics (add website IDs)
- [ ] Add all three sites to Umami dashboard
- [ ] Set up Microsoft Clarity for heatmaps (optional)

#### Google Setup
- [ ] Create/Claim Google Business Profile
- [ ] Verify Google Business Profile
- [ ] Add bespokefloorsanding.ie to Google Search Console
- [ ] Add floorsandingmonaghan.ie to Search Console
- [ ] Add floorsandingcavan.ie to Search Console
- [ ] Submit sitemaps for all three sites
- [ ] Request indexing for main pages

#### Citations & Backlinks
- [ ] Submit to Golden Pages (all sites)
- [ ] Submit to Yelp Ireland
- [ ] Create Facebook business page
- [ ] Create Instagram profile
- [ ] Request reviews from past customers

---

## Questions to Resolve

1. Is the main site currently live and working at bespokefloorsanding.ie?
2. Are the microsites deployed and accessible?
3. Is the contact form receiving emails?
4. Has Nygell tested the CMS at /admin?
5. Are there any design feedback items from Nygell?
6. Do we have real before/after photos from Nygell to replace placeholders?
7. What's the priority: deployment, polish, or SEO/marketing tasks?
