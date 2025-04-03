FROM debian:buster

# On met à jour le container
RUN apt update -y; \
    apt upgrade -y; \
    # On install vim et nginx
    apt install nginx -y;

# On install le générateur de certificats SSL
RUN mkdir -p /etc/nginx/ssl
RUN apt install openssl -y
RUN mkdir -p /var/run/nginx

# Copiez le script de génération de certificat et démarrage nginc dans le conteneur
COPY tools/config.sh /tmp/config.sh
RUN chmod +x /tmp/config.sh

# On copy le fichier config de nginx
COPY conf/nginx.conf /etc/nginx/nginx.conf

# On ajoute les droits
RUN chmod 755 /var/www/html
RUN chown -R www-data:www-data /var/www/html

# On lance la génération SSL puis nginx
CMD ["sh", "/tmp/config.sh"]