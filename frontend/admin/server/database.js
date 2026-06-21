const knex = require('./knex');
const bcrypt = require('bcryptjs');

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

const normalizeOffer = (row) => {
    if (!row) return null;
    return {
        ...row,
        features: parseJSON(row.features, [])
    };
};

module.exports = {
    getUserByUsername: (username) => knex('users').where({ username }).first(),
    getUserById: (id) => knex('users').where({ id }).first(),
    getAllUsers: () => knex('users').orderBy('id', 'desc'),
    createUser: async (username, password, full_name, role) => {
        const existing = await knex('users').where({ username }).first();
        if (existing) {
            throw new Error('Логин занят');
        }
        const [id] = await knex('users').insert({
            username,
            password_hash: bcrypt.hashSync(password, 10),
            full_name,
            role,
            created_at: now(),
            last_login: null
        });
        return id;
    },
    deleteUser: (id) => knex('users').where({ id }).del(),
    updateLastLogin: (id) => knex('users').where({ id }).update({ last_login: now() }),
    updateProfile: async (id, { full_name, password }) => {
        const update = {};
        if (full_name) update.full_name = full_name;
        if (password) update.password_hash = bcrypt.hashSync(password, 10);
        if (Object.keys(update).length === 0) return;
        await knex('users').where({ id }).update(update);
    },

    getApplications: (status) => {
        const query = knex('applications').orderBy('created_at', 'desc');
        if (status) {
            query.where({ status });
        }
        return query;
    },
    getAllApplications: (status) => {
        const query = knex('applications').orderBy('created_at', 'desc');
        if (status) {
            query.where({ status });
        }
        return query;
    },
    getApplicationById: (id) => knex('applications').where({ id }).first(),
    createApplication: async (data) => {
        const payload = {
            type: data.type || 'contact',
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            message: data.message || '',
            company: data.company || '',
            service: data.service || '',
            status: data.status || 'new',
            response: data.response || '',
            created_at: now(),
            updated_at: null,
            updated_by: data.updated_by || null
        };
        const [id] = await knex('applications').insert(payload);
        return id;
    },
    updateApplication: (id, data) => knex('applications').where({ id }).update({
        ...pick(data, ['status', 'response', 'updated_by']),
        updated_at: now()
    }),
    deleteApplication: (id) => knex('applications').where({ id }).del(),

    getNews: () => knex('news').orderBy('created_at', 'desc'),
    getNewsById: (id) => knex('news').where({ id }).first(),
    createNews: async (data) => {
        const [id] = await knex('news').insert({
            title: data.title,
            category: data.category,
            excerpt: data.excerpt,
            content: data.content || '',
            image_url: data.image_url || '',
            created_by: data.created_by || null,
            created_at: now(),
            updated_at: null,
            is_active: 1
        });
        return id;
    },
    updateNews: (id, data) => knex('news').where({ id }).update({
        ...pick(data, ['title', 'category', 'excerpt', 'content', 'image_url', 'is_active']),
        updated_at: now()
    }),
    deleteNews: (id) => knex('news').where({ id }).del(),

    getOffers: async () => {
        const rows = await knex('offers').orderBy('created_at', 'desc');
        return rows.map(normalizeOffer);
    },
    getOfferById: async (id) => normalizeOffer(await knex('offers').where({ id }).first()),
    createOffer: async (data) => {
        const [id] = await knex('offers').insert({
            title: data.title,
            description: data.description,
            price_old: data.price_old || '',
            price_new: data.price_new || '',
            features: typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
            icon: data.icon || '',
            created_by: data.created_by || null,
            created_at: now(),
            updated_at: null,
            is_active: 1
        });
        return id;
    },
    updateOffer: async (id, data) => {
        const update = pick(data, ['title', 'description', 'price_old', 'price_new', 'icon', 'is_active']);
        if (data.features !== undefined) {
            update.features = typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []);
        }
        if (Object.keys(update).length === 0) return;
        await knex('offers').where({ id }).update({ ...update, updated_at: now() });
    },
    deleteOffer: (id) => knex('offers').where({ id }).del(),

    logActivity: (user_id, action, entity_type, entity_id, details) => knex('activity_log').insert({
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        created_at: now()
    }),

    getStats: async () => {
        const [applications, users, news, offers] = await Promise.all([
            knex('applications').count('id as count').first(),
            knex('users').count('id as count').first(),
            knex('news').count('id as count').first(),
            knex('offers').count('id as count').first()
        ]);
        return {
            applications: parseInt(applications.count, 10) || 0,
            users: parseInt(users.count, 10) || 0,
            news: parseInt(news.count, 10) || 0,
            offers: parseInt(offers.count, 10) || 0
        };
    }
};
