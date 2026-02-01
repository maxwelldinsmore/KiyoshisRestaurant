FROM postgres:16

# Set PostgreSQL environment variables
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123
ENV POSTGRES_DB=kiyoshi_db

# Optional: copy SQL init scripts
COPY init.sql /docker-entrypoint-initdb.d/


# BUILD:
# docker build -t kiyoshi-postgres .

# RUN:
# docker run -d --name kiyoshi-container -p 5432:5432 kiyoshi-postgres

# TEST (connects to psql via cli):
# docker exec -it kiyoshi-postgres psql -U admin -d kiyoshi_db