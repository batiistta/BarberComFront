FROM nginx:1.27-alpine
ENV API_ORIGIN=
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint-barbercom.sh
RUN chmod +x /docker-entrypoint-barbercom.sh
COPY index.html /usr/share/nginx/html/index.html
COPY logo.png /usr/share/nginx/html/logo.png
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
EXPOSE 80
CMD ["/docker-entrypoint-barbercom.sh"]
