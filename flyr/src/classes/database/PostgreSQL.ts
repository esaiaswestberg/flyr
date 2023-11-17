import { createPool, type DatabasePool } from 'slonik'

/**
 * PostgreSQL database class.
 *
 * @class PostgreSQL
 * @author Esaias Westberg <esaias@westbergs.se>
 */
export default class PostgreSQL {
  protected pool: DatabasePool | null = null

  constructor() {
    this.connect()
  }

  /**
   * Connect to PostgreSQL database.
   */
  public async connect(): Promise<DatabasePool> {
    const connectionUrl = process.env.DATABASE_URL
    if (!connectionUrl) throw new Error('No connection URL provided')

    if (this.pool) return this.pool
    return (this.pool = await createPool(connectionUrl))
  }
}
