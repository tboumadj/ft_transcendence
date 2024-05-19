#!/bin/bash

# Obtenir l'adresse IP locale
local_ip=$(hostname -i | awk '{print $NF}')

# Enregistrer l'adresse IP dans le fichier .env
echo "LOCAL_IP=$local_ip" >> srcs/requirements/nodejs/.env
echo "LOCAL_IP=$local_ip" >> srcs/.env
# echo "LOCAL_IP=$local_ip" >> NesTest/.env

