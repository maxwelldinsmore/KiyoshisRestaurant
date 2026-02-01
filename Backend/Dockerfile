# Sets up a PostgreSQL database and auto creates tables
# You can run it with the docker build and run commands below
FROM postgres:16

# ENV variables to shorter commands
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123
ENV POSTGRES_DB=kiyoshi_db

COPY init.sql /docker-entrypoint-initdb.d/


# BUILD:
# docker build -t kiyoshi-postgres .

# RUN:
# docker run -d --name kiyoshi-container -p 5432:5432 kiyoshi-postgres

# TEST (connects to psql via cli):
# docker exec -it kiyoshi-postgres psql -U admin -d kiyoshi_db