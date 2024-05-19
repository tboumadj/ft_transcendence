#!/bin/bash
set -e

if [ -f .env ]; then
export $(cat .env | xargs)
else
    echo "Le fichier .env n'existe pas."
fi
