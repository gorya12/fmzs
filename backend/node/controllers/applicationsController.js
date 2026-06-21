const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const applications = await db.getApplications(req.query.status);
  res.json(applications);
});

router.get('/:id', async (req, res) => {
  const application = await db.getApplicationById(parseInt(req.params.id, 10));
  if (!application) return res.status(404).json({ error: 'Заявка не найдена' });
  res.json(application);
});

router.post('/', async (req, res) => {
  const created = await db.createApplication(req.body);
  res.status(201).json(created[0] || created);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await db.updateApplication(id, req.body);
  if (!updated || updated.length === 0) return res.status(404).json({ error: 'Заявка не найдена' });
  res.json(updated[0]);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deletedCount = await db.deleteApplication(id);
  if (!deletedCount) return res.status(404).json({ error: 'Заявка не найдена' });
  res.status(204).send();
});

module.exports = router;
