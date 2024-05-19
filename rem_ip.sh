#!/bin/bash

#path du .env   --  srcs/requirements/nodejs/.env

# Supprimer les lignes contenant 'LOCAL_IP' du fichier
sed -i '/LOCAL_IP/d' "srcs/requirements/nodejs/.env"
sed -i '/LOCAL_IP/d' "srcs/.env"
# sed -i '/LOCAL_IP/d' "NesTest/.env"

# Supprimer la ligne ajoutée de main.js


