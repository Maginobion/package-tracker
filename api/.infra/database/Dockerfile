FROM postgres:16-alpine

# Set environment variables
ENV POSTGRES_DB=package_tracker
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy initialization scripts
# Scripts in /docker-entrypoint-initdb.d/ are automatically executed in alphabetical order on first run
COPY migrations/*.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# The official postgres image already has the correct CMD
# CMD ["postgres"]

