FROM postgres:16
# Environment variables
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123
ENV POSTGRES_DB=kiyoshi_db
ENV POSTGRES_HOST_AUTH_METHOD=trust

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY seed_data.sql /docker-entrypoint-initdb.d/02-seed_data.sql
COPY procedures.sql/users.sql /docker-entrypoint-initdb.d/03-users.sql
COPY procedures.sql/employees.sql /docker-entrypoint-initdb.d/04-employees.sql
COPY procedures.sql/suppliers.sql /docker-entrypoint-initdb.d/05-suppliers.sql
COPY procedures.sql/inventory.sql /docker-entrypoint-initdb.d/06-inventory.sql
COPY procedures.sql/menu_items.sql /docker-entrypoint-initdb.d/07-menu_items.sql
COPY procedures.sql/orders.sql /docker-entrypoint-initdb.d/08-orders.sql
COPY procedures.sql/rewards.sql /docker-entrypoint-initdb.d/09-rewards.sql
COPY procedures.sql/reports.sql /docker-entrypoint-initdb.d/10-reports.sql
COPY pg_hba.conf /etc/postgresql/pg_hba.conf
