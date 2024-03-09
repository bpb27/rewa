import { promises as fs } from 'fs';
import { FileMigrationProvider, Migrator } from 'kysely';
import * as path from 'path';
import { kyselyDb } from './db';

// migration name should be prefixed with this (add script)
// new Date().toISOString().replace(/[\D]/g, '')

async function migrateToLatest() {
  const migrationFolder = path.join(__dirname, './migrations');
  const migrator = new Migrator({
    db: kyselyDb,
    provider: new FileMigrationProvider({ fs, path, migrationFolder }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach(result => {
    if (result.status === 'Success') {
      console.log(`migration "${result.migrationName}" was executed successfully`);
    } else if (result.status === 'Error') {
      console.error(`failed to execute migration "${result.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await kyselyDb.destroy(); // close connection
}

migrateToLatest();
