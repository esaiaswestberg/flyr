import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { sql } from 'slonik'
import PostgreSQL from './src/classes/database/PostgreSQL'

// Connect to database.
const db = new PostgreSQL()
const pool = await db.connect()

// Create migrations folder if it doesn't exist.
const migrationsPath = path.join(process.cwd(), 'migrations')
if (!fs.existsSync(migrationsPath)) fs.mkdirSync(migrationsPath)

// Create migrations table if it doesn't exist.
const migrationTable = 'migrations'
await pool.query(sql.unsafe`
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`)

// Check if migrations table is empty.
const migrations = await pool.query(sql.unsafe`SELECT * FROM ${sql.identifier([migrationTable])};`)
if (migrations.rowCount === 0) console.log('No migrations have been applied yet.')
else console.log(`Applied migrations: ${migrations.rows.map((row) => `\n - ${row.name}`).join('')}\n`)

// Create empty migration.
const createMigration = async (name: string) => {
  const timestamp = Date.now()
  const safeName = name.replace(/\s/g, '_')
  const migrationName = `${timestamp}-${safeName}.ts`
  const migrationPath = path.join(migrationsPath, migrationName)

  const template = `import { sql } from 'slonik'

export const up = sql.unsafe\`
  /* Replace with SQL to run when migrating up. */
\`

export const down = sql.unsafe\`
  /* Replace with SQL to run when migrating down. */
\`

export const fill = sql.unsafe\`
  /* Replace with SQL to run when filling the database. */
\`
`

  fs.writeFileSync(migrationPath, template)

  console.log(`Created migration "${migrationName}".`)
}

// Reset database.
const resetDatabase = async () => {
  const tables = await pool.query(sql.unsafe`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`)

  for (const table of tables.rows) {
    const tableName = table.table_name
    if (tableName === migrationTable) continue

    console.log(`Dropping table "${tableName}".`)
    await pool.query(sql.unsafe`DROP TABLE IF EXISTS ${sql.identifier([tableName])} CASCADE;`)
  }

  console.log('Reset database.')
}

// Apply migrations.
const applyMigrations = async () => {
  const migrations = fs.readdirSync(migrationsPath).sort()
  let applied = 0

  for (const migration of migrations) {
    // Import migration.
    const migrationPath = path.join(migrationsPath, migration)
    const relativePath = `./${path.relative(process.cwd(), migrationPath).replaceAll('\\', '/').replaceAll('.ts', '')}`
    const { up } = await import(relativePath)

    // Check if migration already exists.
    const name = migration.split('.')[0]
    const [timestamp, ...rest] = name.split('-')
    const safeName = rest.join('-')
    const migrationName = `${timestamp}-${safeName}`
    const migrationTable = 'migrations'
    const migrationExists = await pool ///
      .query(sql.unsafe`SELECT * FROM ${sql.identifier([migrationTable])} WHERE name = ${migrationName};`) ///
      .then((result) => result.rowCount > 0)

    // Run migration.
    if (!migrationExists) {
      console.log(`Running migration "${migrationName}".`)
      await pool.query(up).catch((error) => console.error(error))
      await pool.query(sql.unsafe`INSERT INTO ${sql.identifier([migrationTable])} (name) VALUES (${migrationName});`)
      applied++
    } else {
      console.log(`Migration "${migrationName}" already exists.`)
    }
  }

  console.log(`Applied ${applied} migrations.`)
}

// Rollback migrations.
const rollbackMigrations = async () => {
  const migrations = fs.readdirSync(migrationsPath).sort().reverse()
  let rolledBack = 0

  for (const migration of migrations) {
    // Import migration.
    const migrationPath = path.join(migrationsPath, migration)
    const relativePath = `./${path.relative(process.cwd(), migrationPath).replaceAll('\\', '/').replaceAll('.ts', '')}`
    const { down } = await import(relativePath)

    // Check if migration exists.
    const name = migration.split('.')[0]
    const [timestamp, ...rest] = name.split('-')
    const safeName = rest.join('-')
    const migrationName = `${timestamp}-${safeName}`
    const migrationTable = 'migrations'
    const migrationExists = await pool ///
      .query(sql.unsafe`SELECT * FROM ${sql.identifier([migrationTable])} WHERE name = ${migrationName};`) ///
      .then((result) => result.rowCount > 0)

    // Run migration.
    if (migrationExists) {
      console.log(`Rolling back migration "${migrationName}".`)
      await pool.query(down).catch((error) => console.error(error))
      await pool.query(sql.unsafe`DELETE FROM ${sql.identifier([migrationTable])} WHERE name = ${migrationName};`)
      rolledBack++
    } else {
      console.log(`Migration "${migrationName}" does not exist.`)
    }
  }

  console.log(`Rolled back ${rolledBack} migrations.`)
}

// Fill database.
const fillDatabase = async () => {
  const migrations = fs.readdirSync(migrationsPath)
  let filled = 0

  for (const migration of migrations) {
    // Import migration.
    const migrationPath = path.join(migrationsPath, migration)
    const relativePath = `./${path.relative(process.cwd(), migrationPath).replaceAll('\\', '/').replaceAll('.ts', '')}`
    const { fill } = await import(relativePath)

    // Run migration.
    console.log(`Filling database with migration "${migration}".`)
    await pool.query(fill).catch((error) => console.error(error))
    filled++
  }

  console.log(`Filled database with ${filled} migrations.`)
}

// Execute command.
const args = process.argv.slice(2)
switch (args.slice(0, 1)[0]) {
  case 'create':
    const name = args.slice(1, 2)[0]
    if (!name) {
      console.log('No name specified. Use "create <name>" to create a new migration.')
      break
    }
    await createMigration(name)
    break
  case 'reset':
    await resetDatabase()
    break
  case 'run':
    const command = args.slice(1, 2)[0]

    switch (command) {
      case 'up':
        await applyMigrations()
        break
      case 'down':
        await rollbackMigrations()
        break
      case 'fill':
        await fillDatabase()
        break
      default:
        console.log('Invalid command. Use "run <up|down|fill>" to run migrations.')
    }
    break
  case 'help':
    const help = `
      Usage: migrate <command> [options]

      Commands:
        create <name>       Create a new migration.
        reset               Reset database.
        run <up|down|fill>  Run migrations.
        help                Show this help message.
    `
    console.log(help)
    break
  default:
    console.log('No command specified. Use "help" for help.')
}

await pool.end()
