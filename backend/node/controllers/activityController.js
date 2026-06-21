const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const logs = await db.getActivityLogs(req.query.user_id);
  res.json(logs);
});

router.get('/:id', async (req, res) => {
  const log = await db.getActivityLogById(parseInt(req.params.id, 10));
  if (!log) return res.status(404).json({ error: 'Лог не найден' });
  res.json(log);
});

router.post('/', async (req, res) => {
  const { user_id, action, entity_type, entity_id, details } = req.body;
  if (!action || !entity_type) {
    return res.status(400).json({ error: 'action и entity_type обязательны' });
  }

  const created = await db.logActivity({ user_id, action, entity_type, entity_id, details });
  res.status(201).json(created[0] || created);
});

module.exports = router;
