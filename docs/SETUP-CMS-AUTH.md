# Setting Up CMS Authentication (GitHub OAuth)

This guide explains how to set up GitHub OAuth for the Decap CMS on your self-hosted VPS.

## Step 1: Create a GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:

   | Field | Value |
   |-------|-------|
   | **Application name** | Bespoke Floor Sanding CMS |
   | **Homepage URL** | https://bespokefloorsanding.ie |
   | **Authorization callback URL** | https://bespokefloorsanding.ie/oauth/callback |

4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it

## Step 2: Add Credentials to VPS

SSH into your VPS and add the credentials:

```bash
ssh me@dillonmccaffrey.dev
cd ~/apps/bespoke-floor-sanding

# Create/edit .env file
cat >> .env << 'EOF'
GITHUB_CLIENT_ID=your-client-id-here
GITHUB_CLIENT_SECRET=your-client-secret-here
OAUTH_ORIGIN=https://bespokefloorsanding.ie
EOF
```

## Step 3: Update Nginx Configuration

Copy the updated nginx config:

```bash
# On VPS
sudo cp ~/apps/bespoke-floor-sanding/nginx.conf /etc/nginx/sites-available/bespokefloorsanding.ie

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

## Step 4: Deploy the OAuth Service

```bash
cd ~/apps/bespoke-floor-sanding
git pull
docker compose up -d --build
```

## Step 5: Test the Login

1. Go to https://bespokefloorsanding.ie/admin
2. Click **Login with GitHub**
3. Authorize the app
4. You should see the CMS dashboard

## Granting Access to the Business Owner

For the business owner (Nygell) to access the CMS:

1. They need a GitHub account (free)
2. Add them as a collaborator to the repository:
   ```bash
   gh repo add-collaborator dillonmccaffrey/bespoke-floor-sanding THEIR_GITHUB_USERNAME
   ```
3. They accept the invitation email
4. Now they can log into the CMS

## Troubleshooting

### "OAuth error" on login
- Verify the callback URL matches exactly: `https://bespokefloorsanding.ie/oauth/callback`
- Check the client ID and secret are correct in `.env`
- Restart the oauth container: `docker compose restart oauth`

### OAuth service not responding
```bash
docker logs bespoke-floor-sanding-oauth-1 --tail 20
```

### CMS shows "repo not found"
- The GitHub user must have access to the repository
- Add them as a collaborator (see above)
