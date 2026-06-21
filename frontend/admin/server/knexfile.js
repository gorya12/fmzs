const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

const sqliteFile = process.env.ADMIN_DB_PATH || path.resolve(__dirname, 'database', 'admin.db');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: sqliteFile
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds')
    }
  }
};
