# CMS Setup Guide

## Option 1: Local Editing (Recommended for Now)

The simplest approach - edit content on your local machine:

```bash
cd ~/projects/bespoke-floor-sanding

# Start CMS backend proxy
npx decap-server &

# Start dev server  
npm run dev
```

Then open: **http://localhost:4321/admin**

### Workflow:
1. Open the admin panel locally
2. Add/edit testimonials, gallery images, services
3. Images are saved to `public/images/`
4. Content saved to `src/content/`
5. Commit and push: `git add -A && git commit -m "Add new gallery images" && git push`
6. On VPS: `cd /opt/bespoke-floor-sanding && git pull && docker compose build && docker compose up -d`

---

## Option 2: GitHub OAuth (Production CMS)

This lets the business owner access `/admin` on the live site.

### Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - Application name: `Bespoke Floor Sanding CMS`
   - Homepage URL: `https://bespokefloorsanding.ie`
   - Authorization callback URL: `https://bespokefloorsanding.ie/api/callback`
4. Click **Register application**
5. Copy the **Client ID**
6. Generate a **Client Secret** and copy it

### Step 2: Deploy OAuth Server

Add to your `docker-compose.yml`:

```yaml
  oauth:
    image: qmcgaw/oauth-server
    restart: unless-stopped
    ports:
      - "3001:8080"
    environment:
      - GITHUB_CLIENT_ID=your-client-id
      - GITHUB_CLIENT_SECRET=your-client-secret
```

### Step 3: Update CMS Config

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/bespoke-floor-sanding
  branch: main
  base_url: https://bespokefloorsanding.ie
  auth_endpoint: /api/auth
```

### Step 4: Add Nginx route for OAuth

```nginx
location /api/auth {
    proxy_pass http://127.0.0.1:3001;
}
```

---

## Option 3: Invite Business Owner to GitHub

Simpler alternative:

1. Create a GitHub account for the business owner
2. Add them as collaborator to the repo
3. They use Option 1 (local editing) on their computer
4. Or use GitHub's web interface to edit markdown files directly

---

## Adding Gallery Images

### Via CMS:
1. Go to `/admin`
2. Click **Gallery (Before/After)**
3. Click **New Gallery**
4. Upload before/after images
5. Fill in title, location, description
6. Publish

### Manually:
1. Add images to `public/images/gallery/`
2. Create `src/content/gallery/my-project.md`:

```markdown
---
title: Living Room in Dublin
location: Dublin
description: Oak floor restoration
beforeImage: /images/gallery/dublin-before.jpg
afterImage: /images/gallery/dublin-after.jpg
order: 1
---
```

3. Commit and push

---

## Image Guidelines

- **Format**: JPG or PNG
- **Size**: Under 2MB per image
- **Dimensions**: 1200x800px recommended
- **Naming**: Use lowercase, dashes (e.g., `dublin-living-room-before.jpg`)
