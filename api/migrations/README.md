# Database Migrations

This folder contains SQL migration files that are automatically executed when the PostgreSQL Docker container is first initialized.

## Execution Order

Files are executed in **alphabetical order**. Use numeric prefixes to control execution:

- `001-schema.sql` - Creates all database tables and triggers
- `002-seed-data.sql` - Inserts initial/seed data
- `003-your-migration.sql` - Your additional migrations...

## Naming Convention

Use the format: `XXX-description.sql`

Examples:

- `001-schema.sql`
- `002-seed-data.sql`
- `003-add-shipping-carriers.sql`
- `004-update-package-statuses.sql`

## Adding New Migrations

1. Create a new `.sql` file with the next number prefix
2. Write your SQL statements (INSERT, UPDATE, ALTER TABLE, etc.)
3. Rebuild the Docker container:
   ```bash
   cd ../api/.infra/database
   docker-compose down -v
   docker-compose up -d --build
   ```

## Important Notes

- **Migrations only run on first initialization** when the database volume is empty
- To re-run migrations, you must remove the volume: `docker-compose down -v`
- All files in this directory are automatically copied to the container
- Both `.sql` and `.sh` files are supported
