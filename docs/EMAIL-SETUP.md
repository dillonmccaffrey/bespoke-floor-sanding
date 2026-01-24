# Self-Hosted Email Setup

This project uses a self-hosted Postfix mail server with DKIM signing for sending contact form emails.

## DNS Records Required

Add these DNS records at your domain registrar for `bespokefloorsanding.ie`:

### 1. MX Record (for receiving replies)
```
Type: MX
Host: @
Value: mail.bespokefloorsanding.ie
Priority: 10
```

### 2. A Record for mail subdomain
```
Type: A
Host: mail
Value: <your-vps-ip>
```

### 3. SPF Record (prevents spoofing)
```
Type: TXT
Host: @
Value: v=spf1 a mx ip4:<your-vps-ip> ~all
```

### 4. DMARC Record (email authentication policy)
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@bespokefloorsanding.ie
```

### 5. DKIM Record (email signing)

After first deployment, get the DKIM key:
```bash
./scripts/get-dkim-key.sh
```

Then add:
```
Type: TXT
Host: mail._domainkey
Value: <the-key-from-script>
```

## Deployment

1. Deploy the stack:
```bash
docker compose up -d
```

2. Get DKIM key:
```bash
./scripts/get-dkim-key.sh
```

3. Add all DNS records above

4. Test by submitting the contact form

## Checking Logs

```bash
# All mail logs
docker compose logs -f mailserver

# Contact form submissions
docker compose logs -f web | grep "Contact Form"
```

## Troubleshooting

### Emails going to spam
- Ensure all DNS records are set correctly
- Check if VPS IP is on any blacklists: https://mxtoolbox.com/blacklists.aspx
- DKIM and SPF must be properly configured

### Emails not sending
```bash
# Check mailserver is running
docker compose ps mailserver

# Check logs for errors
docker compose logs mailserver
```

### Test email delivery
```bash
docker compose exec mailserver sh -c 'echo "Test" | mail -s "Test Email" your@email.com'
```

## Firewall

Ensure port 25 is open for outgoing mail:
```bash
ufw allow out 25/tcp
```

Note: Some VPS providers block port 25 by default. You may need to request it to be unblocked.
