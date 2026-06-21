const express = require('express');
const multer = require('multer');
const asyncHandler = require('./asyncHandler');
const CreateNewsRequest = require('../requests/CreateNewsRequest');
const UpdateNewsRequest = require('../requests/UpdateNewsRequest');
const newsService = require('../services/newsService');

const router = express.Router();

const canEditNews = (role) => ['superadmin', 'manager'].includes(role);
const canDeleteNews = (role) => role === 'superadmin';


const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'Файл слишком большой. Максимальный размер 5MB' });
        }
        return res.status(400).json({ error: `Ошибка загрузки файла: ${err.message}` });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};


router.get('/', asyncHandler(async (req, res) => {
    const news = await newsService.getAll();

    res.json({
        success: true,
        data: news,
        count: news.length
    });
}));


router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: 'Некорректный ID новости'
        });
    }

    const news = await newsService.getById(id);

    if (!news) {
        return res.status(404).json({
            error: 'Новость не найдена'
        });
    }

    res.json({
        success: true,
        data: news
    });
}));


router.post(
    '/',
    (req, res, next) => {
        if (!canEditNews(req.user.role)) {
            return res.status(403).json({
                error: 'Доступ запрещён. Требуются права manager или выше'
            });
        }
        next();
    },
    newsService.getUploadMiddleware(),
    handleMulterError,
    asyncHandler(async (req, res) => {
        const createRequest = new CreateNewsRequest(req.body);

        if (!createRequest.validate()) {
            if (req.file) {
                newsService.deleteImageFile(`/uploads/news/${req.file.filename}`);
            }
            return res.status(422).json({
                error: 'Ошибка валидации',
                errors: createRequest.getErrors(),
                message: createRequest.getFirstError()
            });
        }

        const cleanData = createRequest.sanitized();

        const result = await newsService.create(cleanData, req.file, req.user.id);

        res.status(201).json({
            success: true,
            message: 'Новость успешно создана',
            data: result
        });
    })
);


router.patch(
    '/:id',
    (req, res, next) => {
        if (!canEditNews(req.user.role)) {
            return res.status(403).json({
                error: 'Доступ запрещён. Требуются права manager или выше'
            });
        }
        next();
    },
    newsService.getUploadMiddleware(),
    handleMulterError,
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        const updateRequest = new UpdateNewsRequest(req.body, id);

        if (!updateRequest.validate()) {
            if (req.file) {
                newsService.deleteImageFile(`/uploads/news/${req.file.filename}`);
            }
            return res.status(422).json({
                error: 'Ошибка валидации',
                errors: updateRequest.getErrors(),
                message: updateRequest.getFirstError()
            });
        }

        const cleanData = updateRequest.sanitized();

        const result = await newsService.update(id, cleanData, req.file, req.user.id);

        res.json({
            success: true,
            message: 'Новость успешно обновлена',
            data: result
        });
    })
);


router.delete('/:id', asyncHandler(async (req, res) => {
    if (!canDeleteNews(req.user.role)) {
        return res.status(403).json({
            error: 'Доступ запрещён. Только суперадмин может удалять новости'
        });
    }

    const { id } = req.params;

    const result = await newsService.delete(id, req.user.id);

    res.json({
        success: true,
        message: 'Новость успешно удалена',
        data: result
    });
}));

module.exports = router;
