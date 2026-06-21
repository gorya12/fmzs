const express = require('express');
const db = require('../database');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const users = await db.getAllUsers();
    res.json(users.map(u => ({
        id: u.id,
        username: u.username,
        full_name: u.full_name,
        role: u.role,
        created_at: u.created_at,
        last_login: u.last_login
    })));
}));

router.post('/', asyncHandler(async (req, res) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const { username, password, full_name, role } = req.body;
    if (!username || !password || !full_name || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!['manager', 'support'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }
    const userId = await db.createUser(username, password, full_name, role);
    res.json({ id: userId, message: 'User created' });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const id = parseInt(req.params.id, 10);
    const user = await db.getUserById(id);
    if (user && user.role === 'superadmin') {
        return res.status(403).json({ error: 'Cannot delete superadmin' });
    }
    await db.deleteUser(id);
    res.json({ message: 'User deleted' });
}));

module.exports = router;
