FROM nginx:1.27-alpine
RUN apk add --no-cache gettext
ARG API_ORIGIN=
ENV API_UPSTREAM=api.railway.internal:3000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint-barbercom.sh
RUN chmod +x /docker-entrypoint-barbercom.sh
COPY index.html /usr/share/nginx/html/index.html
COPY logo.png /usr/share/nginx/html/logo.png
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
RUN printf "window.BARBERCOM_CONFIG = { API_ORIGIN: '%s' };\n" "$API_ORIGIN" > /usr/share/nginx/html/js/config.js
EXPOSE 80
CMD ["/docker-entrypoint-barbercom.sh"]
