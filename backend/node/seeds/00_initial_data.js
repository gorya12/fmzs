const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  await knex('activity_log').del();
  await knex('applications').del();
  await knex('special_offers').del();
  await knex('projects').del();
  await knex('news').del();
  await knex('users').del();

  const users = [
    {
      username: 'admin',
      password_hash: bcrypt.hashSync('Admin2025!', 10),
      full_name: 'Administrator',
      role: 'admin',
      created_at: new Date().toISOString(),
      last_login: null
    }
  ];

  const [admin] = await knex('users').insert(users).returning(['id']);
  const adminId = admin.id || 1;

  await knex('news').insert([
    {
      title: 'Переход на PostgreSQL',
      content: 'Основной backend теперь использует PostgreSQL с миграциями и индексами.',
      date: new Date().toISOString().slice(0, 10),
      image_url: '/assets/images/news1.jpg',
      created_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: null,
      is_active: true
    }
  ]);

  await knex('projects').insert([
    {
      title: 'Проект по цифровой безопасности',
      description: 'Модернизация сайта и перенос данных в реляционную базу для стабильной работы.',
      image_url: '/assets/images/project1.jpg',
      created_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: null
    }
  ]);

  await knex('special_offers').insert([
    {
      title: 'Техническая поддержка 24/7',
      description: 'Включает оперативное сопровождение и защиту сайта от аварий.',
      created_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: null
    }
  ]);

  await knex('applications').insert([
    {
      type: 'contact',
      name: 'Иван Иванов',
      phone: '+7 999 000-00-00',
      email: 'ivan@example.com',
      company: 'ООО «Форма»',
      service: 'Консультация',
      message: 'Хотим обсудить внедрение решения.',
      status: 'new',
      response: null,
      updated_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: null
    }
  ]);
};
