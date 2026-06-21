const express = require('express');
const cors = require('cors');
const path = require('path');
const authMiddleware = require('./auth');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'formosa-secret-key-2025';
const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

// Middleware
app.use(cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
});

// Static files
app.use(express.static(path.join(__dirname, '..', '..')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Protected routes middleware
const auth = authMiddleware(JWT_SECRET);
const controllers = require('./controllers');

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'formosa-admin-api' });
});

app.use('/api/auth', controllers.authController);
app.use('/api/users', auth, controllers.usersController);
app.use('/api/applications', auth, controllers.applicationsController);
app.use('/api/news', auth, controllers.newsController);
app.use('/api/offers', auth, controllers.offersController);
app.use('/api/stats', auth, controllers.statsController);
app.use('/api/profile', auth, controllers.profileController);
app.use('/api', controllers.contactController);
app.use('/api/public', controllers.publicController);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Ошибка сервера' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Админ-панель запущена на http://localhost:${PORT}/admin/`);
    console.log(`📊 API доступен на http://localhost:${PORT}/api/`);
});
