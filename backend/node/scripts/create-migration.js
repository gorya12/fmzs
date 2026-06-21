const fs = require('fs');
const path = require('path');

const name = process.argv.slice(2).join(' ').trim();
if (!name) {
  console.error('Usage: node create-migration.js <migration-name>');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const slug = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
const filename = `${timestamp}_${slug}.js`;
const migrationsDir = path.resolve(__dirname, '..', 'migrations');

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const content = `exports.up = async function(knex) {
  // TODO: add schema changes for ${name}
};

exports.down = async function(knex) {
  // TODO: revert schema changes for ${name}
};
`;

const fullPath = path.join(migrationsDir, filename);
fs.writeFileSync(fullPath, content, { flag: 'wx' });
console.log(`Created migration: ${filename}`);
