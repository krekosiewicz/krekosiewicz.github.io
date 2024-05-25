# Use NGINX Alpine image as the base
FROM nginx:alpine

# Set environment variables for the build
ARG DOMAIN_NAME
ENV DOMAIN_NAME=${DOMAIN_NAME}

# Install required packages for GeoIP
RUN apk add --no-cache nginx-mod-http-geoip geoip

# Download and install the GeoIP database
RUN mkdir -p /usr/share/GeoIP/ && \
    wget -q -O /usr/share/GeoIP/GeoIP.dat.gz http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz && \
    gunzip /usr/share/GeoIP/GeoIP.dat.gz

# Create directory for Certbot webroot authentication
RUN mkdir -p /var/www/certbot/.well-known/acme-challenge

# Remove default nginx configurations
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
