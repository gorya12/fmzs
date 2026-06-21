const path = require('path');
const knex = require('./knex');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

async function initialize() {
  console.log('🔧 Running main backend migrations...');
  await knex.migrate.latest();
  console.log('✅ Migrations applied');

  console.log('📦 Seeding main backend data...');
  await knex.seed.run();
  console.log('✅ Seed complete');
}

initialize()
  .then(() => knex.destroy())
  .catch(error => {
    console.error('❌ Main backend initialization failed:', error);
    process.exit(1);
  });
