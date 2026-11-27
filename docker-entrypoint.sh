#!/bin/sh
set -eu
# Mesma origem no browser (cookie first-party). Proxy nginx fala com a API.
API_ORIGIN="${API_ORIGIN:-}"
API_UPSTREAM="${API_UPSTREAM:-http://api.railway.internal:3000}"
printf "window.BARBERCOM_CONFIG = { API_ORIGIN: '%s' };\n" "$API_ORIGIN" > /usr/share/nginx/html/js/config.js
export API_UPSTREAM
envsubst '${API_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
