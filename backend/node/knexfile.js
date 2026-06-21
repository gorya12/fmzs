const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const connection = process.env.DATABASE_MAIN_URL || process.env.DATABASE_URL || {
  host: process.env.PGHOST || '127.0.0.1',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'formosa_main'
};

module.exports = {
  development: {
    client: 'pg',
    connection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds')
    }
  }
};
