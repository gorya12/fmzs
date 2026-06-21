const express = require('express');
const db = require('../database');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const apps = await db.getAllApplications();
    res.json(apps);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const app = await db.getApplicationById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
}));

router.post('/:id/status', asyncHandler(async (req, res) => {
    const { status } = req.body;
    await db.updateApplicationStatus(req.params.id, status);
    res.json({ message: 'Status updated' });
}));

module.exports = router;
