FROM mysql:latest

COPY ./vacations.sql /docker-entrypoint-initdb.d/
RUN chmod 644 /docker-entrypoint-initdb.d/vacations.sql

# docker run --name vacations-db -d -e MYSQL_ALLOW_EMPTY_PASSWORD=1 -e MYSQL_DATABASE=vacations_db -e MYSQL_TCP_PORT=3306 -p 3309:3306 vacations-db:1.0.0
