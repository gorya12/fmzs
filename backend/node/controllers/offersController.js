const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const offers = await db.getOffers();
  res.json(offers);
});

router.get('/:id', async (req, res) => {
  const offer = await db.getOfferById(parseInt(req.params.id, 10));
  if (!offer) return res.status(404).json({ error: 'Оффер не найден' });
  res.json(offer);
});

router.post('/', async (req, res) => {
  const { title, description, created_by } = req.body;
  if (!title) return res.status(400).json({ error: 'title обязательное поле' });

  const created = await db.createOffer({ title, description, created_by });
  res.status(201).json(created[0] || created);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await db.updateOffer(id, req.body);
  if (!updated || updated.length === 0) return res.status(404).json({ error: 'Оффер не найден' });
  res.json(updated[0]);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deletedCount = await db.deleteOffer(id);
  if (!deletedCount) return res.status(404).json({ error: 'Оффер не найден' });
  res.status(204).send();
});

module.exports = router;
