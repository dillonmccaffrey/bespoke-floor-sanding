#!/bin/sh
set -e

DOMAIN="${MAIL_DOMAIN:-bespokefloorsanding.ie}"
SELECTOR="${DKIM_SELECTOR:-mail}"
KEYDIR="/etc/opendkim/keys"

echo "=== Mail Server Setup ==="
echo "Domain: $DOMAIN"
echo "DKIM Selector: $SELECTOR"

# Generate DKIM keys if they don't exist
if [ ! -f "$KEYDIR/$SELECTOR.private" ]; then
    echo "Generating DKIM keys..."
    opendkim-genkey -D "$KEYDIR" -d "$DOMAIN" -s "$SELECTOR" -b 2048
    chown -R opendkim:opendkim "$KEYDIR"
    chmod 600 "$KEYDIR/$SELECTOR.private"
    
    echo ""
    echo "=========================================="
    echo "DKIM PUBLIC KEY - Add this DNS record:"
    echo "=========================================="
    echo ""
    cat "$KEYDIR/$SELECTOR.txt"
    echo ""
    echo "=========================================="
fi

# Create OpenDKIM tables
cat > /etc/opendkim/KeyTable << EOF
$SELECTOR._domainkey.$DOMAIN $DOMAIN:$SELECTOR:$KEYDIR/$SELECTOR.private
EOF

cat > /etc/opendkim/SigningTable << EOF
*@$DOMAIN $SELECTOR._domainkey.$DOMAIN
EOF

cat > /etc/opendkim/TrustedHosts << EOF
127.0.0.1
localhost
172.16.0.0/12
192.168.0.0/16
10.0.0.0/8
EOF

chown -R opendkim:opendkim /etc/opendkim

# Update Postfix hostname
postconf -e "myhostname=mail.$DOMAIN"
postconf -e "mydomain=$DOMAIN"

# Fix permissions
postfix set-permissions 2>/dev/null || true

echo "Starting mail server..."
exec "$@"
