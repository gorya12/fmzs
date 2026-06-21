const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

knex.raw('PRAGMA foreign_keys = ON;').catch(() => {});

module.exports = knex;
