import { Pool } from 'pg'

const pool = new Pool({
  max: 20,
  //   host: 'localhost',
  //   user: 'postgres',
  //   password: 'dev',
  //   database: 'tcc_dev',
  connectionString: 'postgres://postgres:dev@localhost:5432/tcc_dev',
  idleTimeoutMillis: 30000
})

export default pool
