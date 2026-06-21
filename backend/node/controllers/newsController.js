const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const news = await db.getNews();
  res.json(news);
});

router.get('/:id', async (req, res) => {
  const news = await db.getNewsById(parseInt(req.params.id, 10));
  if (!news) return res.status(404).json({ error: 'Новость не найдена' });
  res.json(news);
});

router.post('/', async (req, res) => {
  const { title, content, date, image_url, created_by, is_active } = req.body;
  if (!title) return res.status(400).json({ error: 'title обязательное поле' });

  const created = await db.createNews({ title, content, date, image_url, created_by, is_active });
  res.status(201).json(created[0] || created);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await db.updateNews(id, req.body);
  if (!updated || updated.length === 0) return res.status(404).json({ error: 'Новость не найдена' });
  res.json(updated[0]);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deletedCount = await db.deleteNews(id);
  if (!deletedCount) return res.status(404).json({ error: 'Новость не найдена' });
  res.status(204).send();
});

module.exports = router;
