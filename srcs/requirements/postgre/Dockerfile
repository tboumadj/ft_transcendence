#FROM postgres:latest
FROM postgres:16.1


# Copier les fichiers de configuration
COPY conf/postgresql.conf /etc/postgresql/postgresql.conf
COPY conf/pg_hba.conf /etc/postgresql/pg_hba.conf

EXPOSE 5432

CMD ["postgres"]

