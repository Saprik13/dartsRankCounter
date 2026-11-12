FROM nginx:1.27-alpine
COPY index.html favicon.ico /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY images /usr/share/nginx/html/images
COPY js /usr/share/nginx/html/js
EXPOSE 80
