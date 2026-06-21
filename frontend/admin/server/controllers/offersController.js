const express = require('express');
const multer = require('multer');
const asyncHandler = require('./asyncHandler');
const CreatePromotionRequest = require('../requests/CreatePromotionRequest');
const UpdatePromotionRequest = require('../requests/UpdatePromotionRequest');
const offersService = require('../services/offersService');

const router = express.Router();

const canEditOffers = (role) => ['superadmin', 'manager'].includes(role);
const canDeleteOffers = (role) => role === 'superadmin';

/**
 * Обработчик ошибок Multer
 */
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

/**
 * GET /api/offers
 * Получить все акции
 * Доступ: публичный
 */
router.get('/', asyncHandler(async (req, res) => {
    const offers = await offersService.getAll();

    res.json({
        success: true,
        data: offers,
        count: offers.length
    });
}));

/**
 * GET /api/offers/:id
 * Получить акцию по ID
 * Доступ: публичный
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: 'Некорректный ID акции'
        });
    }

    const offer = await offersService.getById(id);

    if (!offer) {
        return res.status(404).json({ 
            error: 'Акция не найдена' 
        });
    }

    res.json({
        success: true,
        data: offer
    });
}));

/**
 * POST /api/offers
 * Создать новую акцию
 * Доступ: manager, superadmin
 * 
 * @body {
 *   title: string (обязательно, 3-100 символов),
 *   description: string (обязательно, 10-1000 символов),
 *   price_old: number|string (опционально),
 *   price_new: number|string (опционально, должна быть < price_old),
 *   features: string[] (опционально, максимум 10),
 *   icon: File (опционально)
 * }
 */
router.post(
    '/',
    (req, res, next) => {
        // Проверка прав перед загрузкой файла
        if (!canEditOffers(req.user.role)) {
            return res.status(403).json({
                error: 'Доступ запрещён. Требуются права manager или выше'
            });
        }
        next();
    },
    offersService.getUploadMiddleware(),
    handleMulterError,
    asyncHandler(async (req, res) => {
        const createRequest = new CreatePromotionRequest(req.body);
        if (!createRequest.validate()) {
            if (req.file) {
                offersService.deleteImageFile(`/uploads/offers/${req.file.filename}`);
            }
            return res.status(422).json({
                error: 'Ошибка валидации',
                errors: createRequest.getErrors(),
                message: createRequest.getFirstError()
            });
        }
        const cleanData = createRequest.sanitized();
        const result = await offersService.create(cleanData, req.file, req.user.id);
        res.status(201).json({
            success: true,
            message: 'Акция успешно создана',
            data: result
        });
    })
);

/**
 * PATCH /api/offers/:id
 * Обновить акцию
 * Доступ: manager, superadmin
 *
 * @param id - ID акции
 * @body - Любые поля для обновления (поддерживает частичные обновления)
 * @file icon - Новое изображение (опционально)
 */
router.patch(
    '/:id',
    (req, res, next) => {
        // Проверка прав перед загрузкой файла
        if (!canEditOffers(req.user.role)) {
            return res.status(403).json({
                error: 'Доступ запрещён. Требуются права manager или выше'
            });
        }
        next();
    },
    offersService.getUploadMiddleware(),
    handleMulterError,
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        // 1. ВАЛИДАЦИЯ ДАННЫХ
        const updateRequest = new UpdatePromotionRequest(req.body, id);

        if (!updateRequest.validate()) {
            // Удаляем загруженный файл если валидация не прошла
            if (req.file) {
                offersService.deleteImageFile(`/uploads/offers/${req.file.filename}`);
            }
            return res.status(422).json({
                error: 'Ошибка валидации',
                errors: updateRequest.getErrors(),
                message: updateRequest.getFirstError()
            });
        }

        // 2. ПОЛУЧЕНИЕ ОЧИЩЕННЫХ ДАННЫХ
        const cleanData = updateRequest.sanitized();

        // 3. ОБНОВЛЕНИЕ ЧЕРЕЗ СЕРВИС
        const result = await offersService.update(id, cleanData, req.file, req.user.id);

        // 4. ОТВЕТ
        res.json({
            success: true,
            message: 'Акция успешно обновлена',
            data: result
        });
    })
);

/**
 * DELETE /api/offers/:id
 * Удалить акцию
 * Доступ: superadmin только
 *
 * @param id - ID акции
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    // 1. ПРОВЕРКА ПРАВ (только суперадмин может удалять)
    if (!canDeleteOffers(req.user.role)) {
        return res.status(403).json({ 
            error: 'Доступ запрещён. Только суперадмин может удалять акции' 
        });
    }

    const { id } = req.params;

    // 2. УДАЛЕНИЕ ЧЕРЕЗ СЕРВИС
    const result = await offersService.delete(id, req.user.id);

    // 3. ОТВЕТ
    res.json({
        success: true,
        message: 'Акция успешно удалена',
        data: result
    });
}));

module.exports = router;
