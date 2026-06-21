const express = require('express');
const db = require('../database');
const asyncHandler = require('./asyncHandler');

const router = express.Router();

router.get('/news', asyncHandler(async (req, res) => {
    const news = (await db.getNews()).filter(n => n.is_active !== 0);
    res.json(news);
}));

router.get('/news/:id', asyncHandler(async (req, res) => {
    const news = await db.getNewsById(parseInt(req.params.id, 10));
    if (!news || news.is_active === 0) {
        return res.status(404).json({ error: 'Новость не найдена' });
    }
    res.json(news);
}));

router.get('/news/:id', asyncHandler(async (req, res) => {
    const news = await db.getNewsById(parseInt(req.params.id, 10));
    if (!news || news.is_active === 0) {
        return res.status(404).json({ error: 'Новость не найдена' });
    }
    res.json(news);
}));

router.get('/offers', asyncHandler(async (req, res) => {
    const offers = (await db.getOffers()).filter(o => o.is_active !== 0);
    res.json(offers);
}));

router.get('/offers/:id', asyncHandler(async (req, res) => {
    const offer = await db.getOfferById(parseInt(req.params.id, 10));
    if (!offer || offer.is_active === 0) {
        return res.status(404).json({ error: 'Акция не найдена' });
    }
    res.json(offer);
}));

module.exports = router;
