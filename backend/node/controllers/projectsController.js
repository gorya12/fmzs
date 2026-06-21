const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await db.getProjects();
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await db.getProjectById(parseInt(req.params.id, 10));
  if (!project) return res.status(404).json({ error: 'Проект не найден' });
  res.json(project);
});

router.post('/', async (req, res) => {
  const { title, description, image_url, created_by } = req.body;
  if (!title) return res.status(400).json({ error: 'title обязательное поле' });

  const created = await db.createProject({ title, description, image_url, created_by });
  res.status(201).json(created[0] || created);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await db.updateProject(id, req.body);
  if (!updated || updated.length === 0) return res.status(404).json({ error: 'Проект не найден' });
  res.json(updated[0]);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deletedCount = await db.deleteProject(id);
  if (!deletedCount) return res.status(404).json({ error: 'Проект не найден' });
  res.status(204).send();
});

module.exports = router;
