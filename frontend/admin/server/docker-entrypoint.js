const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dbPath = process.env.ADMIN_DB_PATH || path.resolve(__dirname, 'database', 'admin.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run('npx', ['knex', 'migrate:latest', '--knexfile', 'knexfile.js']);

const knex = require('./knex');

(async () => {
  const row = await knex('users').count('id as count').first();
  if (!Number(row.count)) {
    run('npx', ['knex', 'seed:run', '--knexfile', 'knexfile.js']);
  }

  await knex.destroy();
  run('node', ['server.js']);
})();
