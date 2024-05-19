FROM debian:bookworm
RUN apt update -y
RUN apt install nginx -y
#RUN mkdir -p /etc/nginx/ssl
#RUN apt install openssl -y
RUN rm -rf /var/lib/apt/lists/*
#RUN openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out /etc/ssl/tboumadj.42.fr.pem -keyout /etc/ssl/tboumadj.42.fr.key -subj "/C=FR/ST=Mulhouse/L=Mulhouse/O=42/OU=42/CN=tboumadj.42.fr/UID=tboumadj"
RUN mkdir -p /var/log/nginx/
#COPY conf/nginx.conf /etc/nginx/conf.d

#Vue.js
#COPY ./vue_dist/ ./dist/
COPY ./dist/ /var/www/html

#RUN chmod 755 /var/www/html
#RUN chmod 755 ./dist
#RUN chown -R www-data:www-data /dist/
#RUN chown -R www-data:www-data /var/www/html
COPY conf/test.conf /etc/nginx/conf.d
#COPY conf/nginx.conf /etc/nginx/conf.d
EXPOSE 8080


CMD ["nginx", "-g", "daemon off;"]
