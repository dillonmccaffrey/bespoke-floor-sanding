#!/bin/bash
# Get the DKIM public key for DNS configuration

echo "=== DKIM Public Key ==="
echo ""
docker compose exec mailserver cat /etc/opendkim/keys/mail.txt 2>/dev/null || \
docker compose logs mailserver 2>/dev/null | grep -A5 "DKIM PUBLIC KEY"
echo ""
echo "Add this as a TXT record for: mail._domainkey.bespokefloorsanding.ie"
