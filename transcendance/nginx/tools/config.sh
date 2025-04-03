#!/bin/bash

openssl req -x509 -nodes -out /etc/nginx/ssl/transcendance.crt -keyout /etc/nginx/ssl/transcendance.key -subj "${SSL_CERTIFICAT}"

nginx -g "daemon off;"