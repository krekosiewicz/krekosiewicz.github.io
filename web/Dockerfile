FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom server configuration
COPY server.conf /etc/nginx/conf.d/

# Copy static files
COPY . /usr/share/nginx/html

# Remove server configuration file if copied to HTML directory
RUN rm -f /usr/share/nginx/html/server.conf
