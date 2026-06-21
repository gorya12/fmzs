const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

async function initialize() {
    console.log('🔧 Запуск миграций базы данных...');
    await knex.migrate.latest();
    console.log('✅ Миграции применены');

    console.log('📦 Выполнение начальных сидов...');
    await knex.seed.run();
    console.log('✅ Сиды выполнены');

    console.log('👤 Суперадмины:');
    console.log('   Aleksandra / FormozaAdmin2025!');
    console.log('   Uvarov.A.V / ServiceMaster2025!');
    console.log('');
    console.log('📊 Таблицы готовы: users, applications, news, offers, activity_log');
}

initialize().then(() => knex.destroy()).catch(error => {
    console.error('❌ Ошибка инициализации БД:', error);
    process.exit(1);
});
