exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('full_name').notNullable();
    table.string('role').notNullable();
    table.timestamp('created_at').notNullable();
    table.timestamp('last_login').nullable();
  });

  await knex.schema.createTable('applications', table => {
    table.increments('id').primary();
    table.string('type').notNullable();
    table.string('name').notNullable();
    table.string('phone').notNullable();
    table.string('email').notNullable().defaultTo('');
    table.string('company').nullable().defaultTo('');
    table.string('service').nullable().defaultTo('');
    table.text('message').nullable();
    table.string('status').notNullable().defaultTo('new');
    table.text('response').nullable();
    table.timestamp('created_at').notNullable();
    table.timestamp('updated_at').nullable();
    table.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
  });

  await knex.schema.createTable('news', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('category').notNullable();
    table.text('excerpt').notNullable();
    table.text('content').nullable();
    table.string('image_url').nullable().defaultTo('');
    table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').notNullable();
    table.timestamp('updated_at').nullable();
    table.integer('is_active').notNullable().defaultTo(1);
  });

  await knex.schema.createTable('offers', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.string('price_old').nullable().defaultTo('');
    table.string('price_new').nullable().defaultTo('');
    table.text('features').nullable().defaultTo('[]');
    table.string('icon').nullable().defaultTo('');
    table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').notNullable();
    table.timestamp('updated_at').nullable();
    table.integer('is_active').notNullable().defaultTo(1);
  });

  await knex.schema.createTable('activity_log', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.string('action').notNullable();
    table.string('entity_type').notNullable();
    table.integer('entity_id').nullable();
    table.text('details').nullable();
    table.timestamp('created_at').notNullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('activity_log');
  await knex.schema.dropTableIfExists('offers');
  await knex.schema.dropTableIfExists('news');
  await knex.schema.dropTableIfExists('applications');
  await knex.schema.dropTableIfExists('users');
};
