const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль' });
    }

    const user = await db.getUserByUsername(username);
    if (!user) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    await db.updateLastLogin(user.id);

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'formosa-secret-key-2025',
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            full_name: user.full_name
        }
    });
}));

module.exports = router;
