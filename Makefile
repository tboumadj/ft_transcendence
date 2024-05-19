#COLORS
_YELLOW =\033[0;33m
_GREEN =\033[0;32m

#MAKE
COMPOSE_FILE = srcs/docker-compose.yml

.PHONY: up stop clear

up:
		@echo "$(_YELLOW)Creation de Transcendence en cours...$(_END)"
		@mkdir -p ./data/postgre
		@mkdir -p ./data/backend
		./get_ip.sh

		@docker compose -f $(COMPOSE_FILE) up -d --build
		@echo "$(_GREEN)$(_BOLD)Lancement de Transcendence reussie!$(_END)"

stop:
		@docker compose -f $(COMPOSE_FILE) down
		./rem_ip.sh
		@echo "$(_GREEN)$(_BOLD)Arret de Transcendence reussi!$(_END)"

clear:
		@docker compose -f $(COMPOSE_FILE) down
		@docker system prune -a
		@docker volume rm $$(docker volume ls -q)
		@rm -rf ./data/*
		@rm -rf ./data
		./rem_ip.sh
		@echo "$(_GREEN)$(_BOLD)Supression de Transcendence et ses volumes reussi!$(_END)"
