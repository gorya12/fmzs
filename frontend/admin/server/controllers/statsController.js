const express = require('express');
const db = require('../database');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const stats = await db.getStats();
    res.json(stats);
}));

module.exports = router;
