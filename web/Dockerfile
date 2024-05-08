# Use an NGINX image to serve static content
FROM nginx:alpine



COPY . /usr/share/nginx/html
#COPY index.html /usr/share/nginx/html/index.html



# Remove default nginx configurations and apply custom ones if any
#RUN rm /etc/nginx/conf.d/default.conf