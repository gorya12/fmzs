const knex = require('./knex');

const now = () => new Date().toISOString();
const parseJSON = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const pick = (source, allowed) => Object.keys(source || {}).reduce((acc, key) => {
  if (allowed.includes(key) && source[key] !== undefined) {
    acc[key] = source[key];
  }
  return acc;
}, {});

module.exports = {
  getUsers: () => knex('users').orderBy('id', 'desc'),
  getUserById: (id) => knex('users').where({ id }).first(),
  createUser: (data) => knex('users').insert({
    username: data.username,
    password_hash: data.password_hash,
    full_name: data.full_name,
    role: data.role || 'user',
    created_at: now(),
    last_login: null
  }).returning('*'),
  updateUser: (id, data) => knex('users').where({ id }).update({
    ...pick(data, ['username', 'password_hash', 'full_name', 'role', 'last_login']),
    updated_at: now()
  }).returning('*'),
  deleteUser: (id) => knex('users').where({ id }).del(),

  getNews: () => knex('news').orderBy('created_at', 'desc'),
  getNewsById: (id) => knex('news').where({ id }).first(),
  createNews: (data) => knex('news').insert({
    title: data.title,
    content: data.content || '',
    date: data.date || now().slice(0, 10),
    image_url: data.image_url || '',
    created_by: data.created_by || null,
    created_at: now(),
    updated_at: null,
    is_active: data.is_active !== undefined ? data.is_active : true
  }).returning('*'),
  updateNews: (id, data) => knex('news').where({ id }).update({
    ...pick(data, ['title', 'content', 'date', 'image_url', 'created_by', 'is_active']),
    updated_at: now()
  }).returning('*'),
  deleteNews: (id) => knex('news').where({ id }).del(),

  getProjects: () => knex('projects').orderBy('created_at', 'desc'),
  getProjectById: (id) => knex('projects').where({ id }).first(),
  createProject: (data) => knex('projects').insert({
    title: data.title,
    description: data.description || '',
    image_url: data.image_url || '',
    created_by: data.created_by || null,
    created_at: now(),
    updated_at: null
  }).returning('*'),
  updateProject: (id, data) => knex('projects').where({ id }).update({
    ...pick(data, ['title', 'description', 'image_url', 'created_by']),
    updated_at: now()
  }).returning('*'),
  deleteProject: (id) => knex('projects').where({ id }).del(),

  getOffers: () => knex('special_offers').orderBy('created_at', 'desc'),
  getOfferById: (id) => knex('special_offers').where({ id }).first(),
  createOffer: (data) => knex('special_offers').insert({
    title: data.title,
    description: data.description || '',
    created_by: data.created_by || null,
    created_at: now(),
    updated_at: null
  }).returning('*'),
  updateOffer: (id, data) => knex('special_offers').where({ id }).update({
    ...pick(data, ['title', 'description', 'created_by']),
    updated_at: now()
  }).returning('*'),
  deleteOffer: (id) => knex('special_offers').where({ id }).del(),

  getApplications: (status) => {
    const query = knex('applications').orderBy('created_at', 'desc');
    if (status) query.where({ status });
    return query;
  },
  getApplicationById: (id) => knex('applications').where({ id }).first(),
  createApplication: (data) => knex('applications').insert({
    type: data.type || 'contact',
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    company: data.company || '',
    service: data.service || '',
    message: data.message || '',
    status: data.status || 'new',
    response: data.response || null,
    updated_by: data.updated_by || null,
    created_at: now(),
    updated_at: null
  }).returning('*'),
  updateApplication: (id, data) => knex('applications').where({ id }).update({
    ...pick(data, ['status', 'response', 'updated_by']),
    updated_at: now()
  }).returning('*'),
  deleteApplication: (id) => knex('applications').where({ id }).del(),

  getActivityLogs: (user_id) => {
    const query = knex('activity_log').orderBy('created_at', 'desc');
    if (user_id) query.where({ user_id });
    return query;
  },
  getActivityLogById: (id) => knex('activity_log').where({ id }).first(),
  logActivity: (activity) => knex('activity_log').insert({
    user_id: activity.user_id || null,
    action: activity.action,
    entity_type: activity.entity_type,
    entity_id: activity.entity_id || null,
    details: activity.details || null,
    created_at: now()
  }).returning('*')
};
