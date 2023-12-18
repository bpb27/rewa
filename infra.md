## Drizzle

```bash
# Introspect db to get a drizzle schema
./node_modules/drizzle-kit/bin.cjs introspect:sqlite --driver better-sqlite --url ./prisma/db.sqlite
```

## Turso

```bash
# Create a named db from an existing file
turso db create rewa-test-1 --from-file prisma/db.sqlite

# Start an interactive SQL shell with:
turso db shell rewa-test-1

# To see information about the database, including a connection URL, run:
turso db show rewa-test-1

#To get an authentication token for the database, run:
turso db tokens create rewa-test-1
```
