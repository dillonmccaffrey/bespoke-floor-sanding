# Google Reviews Integration Guide

This document outlines options for displaying Google Business Profile reviews on the Bespoke Floor Sanding website.

## Prerequisites

Before implementing any solution, ensure you have:

1. **Google Business Profile** - A verified Google Business Profile for Bespoke Floor Sanding
2. **Place ID** - Your Google Place ID (find it at [Google's Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder))
3. **Reviews** - At least a few reviews on your Google Business Profile

---

## Overview of Options

| Option | Cost | Effort | Auto-sync | Best For |
|--------|------|--------|-----------|----------|
| **Elfsight** | Free (200 views/mo) or $5+/mo | Very Low | ✅ Yes | Quick setup, small businesses |
| **EmbedSocial** | $29+/mo | Low | ✅ Yes | Multiple review platforms |
| **Featurable** | Free tier available | Low | ✅ Yes | Developer-friendly, React support |
| **Wally** | Free tier available | Low | ✅ Yes | Astro-specific solution |
| **Manual/Static** | Free | Medium | ❌ No | Full control, no dependencies |
| **Google Places API** | Pay-per-use | High | ❌ Manual | Custom implementations |

---

## Option 1: Third-Party Widget Services (Recommended)

### Elfsight (Recommended for Simplicity)

**Pricing:**
- Free: 1 widget, 200 views/month (includes Elfsight branding)
- Basic: $5/mo - 3 widgets, 5,000 views/month
- Pro: $10/mo - 9 widgets, 50,000 views/month

**Pros:**
- No coding required
- No API key needed
- Auto-syncs reviews (within 72 hours)
- Customizable layouts (6+ templates)
- Mobile responsive

**Cons:**
- Branding on free tier
- External dependency
- Limited views on free plan

**Implementation:**

1. Visit [Elfsight Google Reviews Widget](https://elfsight.com/google-reviews-widget/)
2. Click "Create Widget for Free"
3. Enter your business name or Google Place ID
4. Customize appearance (layout, colors, which reviews to show)
5. Copy the embed code
6. Add to your Astro site:

```astro
---
// src/components/GoogleReviews.astro
---
<div class="google-reviews-container">
  <!-- Elfsight widget code -->
  <script src="https://static.elfsight.com/platform/platform.js" async></script>
  <div class="elfsight-app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"></div>
</div>

<style>
  .google-reviews-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
</style>
```

### Wally (Astro-Specific)

Wally offers Astro-specific integration with an `is:inline` directive for CORS handling.

**Implementation:**

1. Sign up at [Wally](https://app.getwally.net/)
2. Import reviews using your Google Maps URL
3. Design your widget
4. Copy embed code and add `is:inline` to the script tag:

```astro
---
// src/components/GoogleReviews.astro
---
<div class="reviews-section">
  <script src="https://app.getwally.net/widget.js" is:inline></script>
  <div data-wally-widget="your-widget-id"></div>
</div>
```

### Featurable

Offers a free tier with React component library (`react-google-reviews`).

**Implementation for Astro with React:**

```bash
npm install react-google-reviews
```

```astro
---
// src/components/GoogleReviews.astro
import { GoogleReviews } from 'react-google-reviews';
---
<GoogleReviews 
  client:load
  featurableId="your-featurable-widget-id"
/>
```

---

## Option 2: Manual/Static Reviews (Free, Full Control)

For complete control and zero external dependencies, manually curate and display reviews.

**Pros:**
- No external dependencies
- Full design control
- No view limits
- Better performance (no external scripts)

**Cons:**
- No auto-sync (must update manually)
- Requires periodic maintenance

**Implementation:**

```astro
---
// src/components/Reviews.astro
interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
  source: string;
}

const reviews: Review[] = [
  {
    author: "John Smith",
    rating: 5,
    text: "Excellent floor sanding service. The team was professional and the results exceeded our expectations.",
    date: "January 2026",
    source: "Google"
  },
  {
    author: "Sarah Johnson", 
    rating: 5,
    text: "Transformed our old wooden floors. Highly recommend Bespoke Floor Sanding!",
    date: "December 2025",
    source: "Google"
  },
  // Add more reviews...
];

function renderStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
---

<section class="reviews-section">
  <div class="reviews-header">
    <h2>What Our Customers Say</h2>
    <div class="google-rating">
      <img src="/images/google-logo.svg" alt="Google" width="24" height="24" />
      <span class="rating-stars">★★★★★</span>
      <span class="rating-text">5.0 based on {reviews.length} reviews</span>
    </div>
  </div>
  
  <div class="reviews-grid">
    {reviews.map((review) => (
      <article class="review-card">
        <div class="review-header">
          <span class="review-author">{review.author}</span>
          <span class="review-stars" aria-label={`${review.rating} out of 5 stars`}>
            {renderStars(review.rating)}
          </span>
        </div>
        <p class="review-text">{review.text}</p>
        <footer class="review-footer">
          <span class="review-date">{review.date}</span>
          <span class="review-source">via {review.source}</span>
        </footer>
      </article>
    ))}
  </div>
  
  <a 
    href="https://g.page/r/YOUR-PLACE-ID/review" 
    class="leave-review-btn"
    target="_blank"
    rel="noopener noreferrer"
  >
    Leave us a review on Google
  </a>
</section>

<style>
  .reviews-section {
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .reviews-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .google-rating {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .rating-stars {
    color: #fbbc04;
    font-size: 1.25rem;
  }
  
  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .review-card {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .review-author {
    font-weight: 600;
  }
  
  .review-stars {
    color: #fbbc04;
  }
  
  .review-text {
    color: #444;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .review-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #666;
  }
  
  .leave-review-btn {
    display: block;
    width: fit-content;
    margin: 2rem auto 0;
    padding: 0.75rem 1.5rem;
    background: #4285f4;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
  }
  
  .leave-review-btn:hover {
    background: #3367d6;
  }
</style>
```

---

## Option 3: Google Places API (Advanced)

For custom implementations requiring programmatic access.

**Important Limitations:**
- Returns maximum **5 reviews** per request
- Cannot paginate or control which reviews are returned
- Reviews sorted by "relevance" (no other options)
- Requires API key and billing account
- Must display proper Google attribution

**Use Cases:**
- Building a custom review aggregation system
- Combining with other data sources
- Server-side rendering of reviews

**Implementation (Build-time fetching):**

```typescript
// src/lib/google-reviews.ts
interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url: string;
}

interface PlaceDetails {
  reviews: GoogleReview[];
  rating: number;
  user_ratings_total: number;
}

export async function fetchGoogleReviews(placeId: string): Promise<PlaceDetails | null> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('GOOGLE_PLACES_API_KEY not set');
    return null;
  }
  
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Google API error:', data.status);
      return null;
    }
    
    return data.result;
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return null;
  }
}
```

```astro
---
// src/pages/index.astro (or reviews page)
import { fetchGoogleReviews } from '../lib/google-reviews';

const PLACE_ID = 'YOUR_GOOGLE_PLACE_ID';
const reviews = await fetchGoogleReviews(PLACE_ID);
---

{reviews && (
  <section class="reviews">
    <p>Rating: {reviews.rating}/5 ({reviews.user_ratings_total} reviews)</p>
    {reviews.reviews?.map((review) => (
      <article class="review">
        <img src={review.profile_photo_url} alt={review.author_name} />
        <h3>{review.author_name}</h3>
        <p>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
        <p>{review.text}</p>
      </article>
    ))}
    <!-- Required Google attribution -->
    <p class="attribution">Reviews from Google</p>
  </section>
)}
```

**Environment Setup:**

```bash
# .env
GOOGLE_PLACES_API_KEY=your_api_key_here
```

---

## Recommended Approach for Bespoke Floor Sanding

For a small business static site built with Astro, I recommend:

### Primary: Elfsight Free Tier

1. Quick to implement (< 30 minutes)
2. Auto-syncs new reviews
3. No API setup required
4. 200 views/month is sufficient for low-traffic sites
5. Upgrade to $5/mo Basic plan if you exceed limits

### Alternative: Manual Reviews Component

If you prefer:
- No external dependencies
- Faster page loads
- Full design control

Use the manual static component and update reviews quarterly.

---

## Getting Your Google Place ID

1. Go to [Google Maps](https://maps.google.com)
2. Search for "Bespoke Floor Sanding"
3. Copy the URL - the Place ID is in the URL after `1s0x` or similar
4. Or use [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)

---

## Creating a Review Request Link

Generate a direct link for customers to leave reviews:

```
https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID
```

Or create a short link using Google's direct URL:

```
https://g.page/r/YOUR_PLACE_ID/review
```

---

## Best Practices

1. **Respond to all reviews** - Shows engagement and professionalism
2. **Highlight best reviews** - Feature 5-star reviews prominently
3. **Include review date** - Builds trust with recent reviews
4. **Show aggregate rating** - Display overall star rating and count
5. **Mobile responsive** - Ensure reviews display well on all devices
6. **Call to action** - Include a "Leave a Review" button
7. **Schema markup** - Add structured data for SEO benefits

### Schema Markup for Reviews

```astro
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Bespoke Floor Sanding",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "25"
  }
}
</script>
```

---

## Summary

| Scenario | Recommended Solution |
|----------|---------------------|
| Quick setup, occasional updates | Elfsight Free |
| Growing traffic (1000+ views/mo) | Elfsight Basic ($5/mo) |
| Full control, no dependencies | Manual static component |
| Multiple review platforms | EmbedSocial |
| React-based customization | Featurable |
