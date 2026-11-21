#!/bin/sh
set -eu
API_ORIGIN="${API_ORIGIN:-}"
printf "window.BARBERCOM_CONFIG = { API_ORIGIN: '%s' };\n" "$API_ORIGIN" > /usr/share/nginx/html/js/config.js
# template sem variáveis — só garante o conf padrão
cp /etc/nginx/templates/default.conf.template /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
