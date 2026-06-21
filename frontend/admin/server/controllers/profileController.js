const express = require('express');
const db = require('../database');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

router.get('/me', asyncHandler(async (req, res) => {
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
    });
}));

module.exports = router;
