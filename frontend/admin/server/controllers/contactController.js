const express = require('express');
const db = require('../database');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

async function createApplication(req, res, fallbackType) {
    const { name, phone, email, message, company, service, type } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
    }
    await db.createApplication({
        type: type || fallbackType,
        name,
        phone,
        email,
        message,
        company,
        service
    });
    res.json({ message: 'Message sent' });
}

router.post('/', asyncHandler((req, res) => createApplication(req, res, 'contact')));
router.post('/contact', asyncHandler((req, res) => createApplication(req, res, 'contact')));
router.post('/consultation', asyncHandler((req, res) => createApplication(req, res, 'consultation')));

module.exports = router;
