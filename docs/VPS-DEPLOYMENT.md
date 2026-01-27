# VPS Deployment Guide

This guide covers deploying the Bespoke Floor Sanding website to a VPS.

## Requirements

- VPS with Ubuntu 22.04+ (or similar)
- Domain pointed to VPS IP
- SSH access

## Quick Deploy (Docker)

### 1. SSH into your VPS

```bash
ssh root@your-vps-ip
```

### 2. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
```

### 3. Clone the repository

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/bespoke-floor-sanding.git
cd bespoke-floor-sanding
```

### 4. Create environment file

```bash
cp .env.example .env
nano .env
```

Add your values:
```env
RESEND_API_KEY=re_xxxxxxxx
UMAMI_WEBSITE_ID=your-website-id
UMAMI_URL=https://analytics.bespokefloorsanding.ie
UMAMI_APP_SECRET=generate-a-random-string-here
```

### 5. Start the containers

```bash
# Just the website
docker compose up -d web

# Website + Umami analytics
docker compose up -d
```

### 6. Set up Nginx

```bash
# Install Nginx
apt install nginx -y

# Copy config
cp nginx.conf /etc/nginx/sites-available/bespokefloorsanding.ie
ln -s /etc/nginx/sites-available/bespokefloorsanding.ie /etc/nginx/sites-enabled/

# Test and reload
nginx -t
systemctl reload nginx
```

### 7. Get SSL certificate

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate
certbot --nginx -d bespokefloorsanding.ie -d www.bespokefloorsanding.ie -d analytics.bespokefloorsanding.ie
```

---

## Manual Deploy (No Docker)

### 1. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install nodejs -y
```

### 2. Clone and build

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/bespoke-floor-sanding.git
cd bespoke-floor-sanding
npm ci
npm run build
```

### 3. Create systemd service

```bash
cat > /etc/systemd/system/bespoke-floor-sanding.service << 'EOF'
[Unit]
Description=Bespoke Floor Sanding Website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/bespoke-floor-sanding
ExecStart=/usr/bin/node dist/server/entry.mjs
Restart=on-failure
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=4321
EnvironmentFile=/opt/bespoke-floor-sanding/.env

[Install]
WantedBy=multi-user.target
EOF
```

### 4. Start the service

```bash
systemctl daemon-reload
systemctl enable bespoke-floor-sanding
systemctl start bespoke-floor-sanding
```

### 5. Check status

```bash
systemctl status bespoke-floor-sanding
curl http://localhost:4321
```

---

## Umami Analytics Setup

After Umami is running:

1. Go to `https://analytics.bespokefloorsanding.ie`
2. Default login: `admin` / `umami`
3. **Change the password immediately!**
4. Add website → Enter `bespokefloorsanding.ie`
5. Copy the Website ID
6. Update `.env` with `UMAMI_WEBSITE_ID`
7. Restart: `docker compose restart web`

Share the dashboard with the business owner:
- Settings → Share URL → Enable

---

## Resend Email Setup

1. Go to https://resend.com and create account
2. Add and verify domain `bespokefloorsanding.ie`
3. Add DNS records as instructed
4. Create API key
5. Update `.env` with `RESEND_API_KEY`
6. Restart: `docker compose restart web`

---

## Cloudflare Email Routing (Free)

To receive emails at `info@bespokefloorsanding.ie`:

1. Add domain to Cloudflare (free plan)
2. Go to Email → Email Routing
3. Enable Email Routing
4. Add route: `info@bespokefloorsanding.ie` → owner's personal email
5. Add required DNS records

---

## Decap CMS Setup

For the business owner to edit content:

### Option A: Git Gateway (Netlify Identity)
Not applicable for VPS - use Option B.

### Option B: GitHub OAuth

1. Create GitHub OAuth App:
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - New OAuth App
   - Authorization callback URL: `https://bespokefloorsanding.ie/api/auth/callback`

2. Deploy an OAuth provider or use a service like:
   - https://github.com/vencax/netlify-cms-github-oauth-provider

3. Update `public/admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: YOUR_USERNAME/bespoke-floor-sanding
     branch: main
     base_url: https://your-oauth-provider.com
   ```

### Option C: Local Only
For now, run locally to edit content:
```bash
npx decap-server
npm run dev
# Access http://localhost:4321/admin
```

Then commit and push changes, redeploy on VPS.

---

## Updating the Site

```bash
cd /opt/bespoke-floor-sanding
git pull
docker compose build
docker compose up -d
```

Or with systemd:
```bash
cd /opt/bespoke-floor-sanding
git pull
npm ci
npm run build
systemctl restart bespoke-floor-sanding
```

---

## Monitoring

Check logs:
```bash
# Docker
docker compose logs -f web

# Systemd
journalctl -u bespoke-floor-sanding -f
```

---

## Firewall

```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

---

## Backup

Back up Umami database:
```bash
docker compose exec db pg_dump -U umami umami > backup.sql
```
