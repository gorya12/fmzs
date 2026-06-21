const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  await knex('activity_log').del();
  await knex('offers').del();
  await knex('news').del();
  await knex('applications').del();
  await knex('users').del();

  const superadmins = [
    {
      username: 'Aleksandra',
      password_hash: bcrypt.hashSync('FormozaAdmin2025!', 10),
      full_name: 'Александра (Суперадмин)',
      role: 'superadmin',
      created_at: new Date().toISOString(),
      last_login: null
    },
    {
      username: 'Uvarov.A.V',
      password_hash: bcrypt.hashSync('ServiceMaster2025!', 10),
      full_name: 'Уваров А.В. (Суперадмин)',
      role: 'superadmin',
      created_at: new Date().toISOString(),
      last_login: null
    }
  ];

  await knex('users').insert(superadmins);
  const adminA = await knex('users').where({ username: 'Aleksandra' }).first();
  const adminB = await knex('users').where({ username: 'Uvarov.A.V' }).first();

  await knex('news').insert([
    {
      title: 'Запуск новой админ-панели',
      category: 'Обновление',
      excerpt: 'Админ-панель переведена на SQLite с поддержкой миграций и новых моделей.',
      content: 'Теперь данные админки хранятся в рабочей реляционной базе с поддержкой миграций и версионного контроля схемы.',
      image_url: '/assets/images/news1.jpg',
      created_by: adminA.id || 1,
      created_at: new Date().toISOString(),
      updated_at: null,
      is_active: 1
    }
  ]);

  await knex('offers').insert([
    {
      title: 'Пакет стандартной поддержки',
      description: 'Включает техническую поддержку, управление заявками и публикацию новостей через админку.',
      price_old: '35000',
      price_new: '25000',
      features: JSON.stringify(['Администрирование', 'Отчётность', 'Хранение данных']),
      icon: 'shield',
      created_by: adminB.id || 2,
      created_at: new Date().toISOString(),
      updated_at: null,
      is_active: 1
    }
  ]);

  await knex('applications').insert([
    {
      type: 'contact',
      name: 'Иван Иванов',
      phone: '+7 999 123-45-67',
      email: 'ivan@example.com',
      message: 'Хочу оформить заявку на обслуживание.',
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: null,
      updated_by: null
    }
  ]);
};
