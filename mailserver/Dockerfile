FROM alpine:3.19

RUN apk add --no-cache \
    postfix \
    opendkim \
    opendkim-utils \
    supervisor \
    ca-certificates

# Create directories
RUN mkdir -p /etc/opendkim/keys /var/run/opendkim /var/spool/postfix/opendkim && \
    chown -R opendkim:opendkim /etc/opendkim /var/run/opendkim && \
    chmod 700 /etc/opendkim/keys

# Copy configuration files
COPY postfix-main.cf /etc/postfix/main.cf
COPY opendkim.conf /etc/opendkim/opendkim.conf
COPY supervisord.conf /etc/supervisord.conf
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 25

ENTRYPOINT ["/entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
