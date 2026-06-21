const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await db.getUserById(parseInt(req.params.id, 10));
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json(user);
});

router.post('/', async (req, res) => {
  const { username, password_hash, full_name, role } = req.body;
  if (!username || !password_hash) {
    return res.status(400).json({ error: 'username и password_hash обязательны' });
  }

  const created = await db.createUser({ username, password_hash, full_name, role });
  res.status(201).json(created[0] || created);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await db.updateUser(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json(updated[0] || updated);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deletedCount = await db.deleteUser(id);
  if (!deletedCount) return res.status(404).json({ error: 'Пользователь не найден' });
  res.status(204).send();
});

module.exports = router;
