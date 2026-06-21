const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'formosa-main-backend' });
});

router.use('/users', controllers.users);
router.use('/news', controllers.news);
router.use('/projects', controllers.projects);
router.use('/offers', controllers.offers);
router.use('/applications', controllers.applications);
router.use('/activity', controllers.activity);

module.exports = router;
