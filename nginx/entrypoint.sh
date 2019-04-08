#!/bin/sh

# Define default value for app container hostname and port
MATTERMOST_HOST=${MATTERMOST_HOST:-mattermost}
MATTERMOST_PORT_NUMBER=${MATTERMOST_PORT_NUMBER:-8000}
NODE_HOST=${NODE_HOST:-node}
NODE_PORT_NUMBER=${NODE_PORT_NUMBER:-8080}

# Check if SSL should be enabled (if certificates exists)
if [ -f "/cert/cert.pem" -a -f "/cert/key-no-password.pem" ]; then
  echo "found certificate and key, linking ssl config"
  ssl="-ssl"
else
  echo "linking plain config"
fi
# Linking Nginx configuration file
ln -s /etc/nginx/sites-available/nginx$ssl /etc/nginx/conf.d/nginx.conf

# Setup app host and port on configuration file
sed -i "s/{%MATTERMOST_HOST%}/${MATTERMOST_HOST}/g" /etc/nginx/conf.d/nginx.conf
sed -i "s/{%MATTERMOST_PORT%}/${MATTERMOST_PORT_NUMBER}/g" /etc/nginx/conf.d/nginx.conf
sed -i "s/{%NODE_HOST%}/${NODE_HOST}/g" /etc/nginx/conf.d/nginx.conf
sed -i "s/{%NODE_PORT%}/${NODE_PORT_NUMBER}/g" /etc/nginx/conf.d/nginx.conf

cat /etc/nginx/conf.d/nginx.conf

# Run Nginx
exec nginx -g 'daemon off;'
