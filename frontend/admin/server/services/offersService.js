/**
 * offersService.js
 * Сервисный слой для управления акциями/спецпредложениями
 * 
 * Отвечает за:
 * - Загрузку изображений/иконок через Multer
 * - Сохранение/обновление/удаление акций в БД
 * - Бизнес-логику (проверки, обработка файлов)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

// ============== НАСТРОЙКА MULTER ==============

// Директория для загрузки изображений акций
const OFFERS_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'offers');

// Гарантируем существование директории
if (!fs.existsSync(OFFERS_UPLOAD_DIR)) {
    fs.mkdirSync(OFFERS_UPLOAD_DIR, { recursive: true });
}

// Конфигурация хранилища
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, OFFERS_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла: timestamp-оригинальное-имя
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9а-яА-ЯёЁ\-_]/g, '_');
        cb(null, `${uniqueSuffix}-${safeName}${ext}`);
    }
});

// Фильтр файлов (только изображения)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP)'), false);
    }
};

// Создаём multer-инстанс
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB лимит
    }
});

// ============== СЕРВИСНЫЕ МЕТОДЫ ==============

class OffersService {
    /**
     * Получить все акции
     */
    async getAll() {
        return await db.getOffers();
    }

    /**
     * Получить акцию по ID
     */
    async getById(id) {
        return await db.getOfferById(id);
    }

    /**
     * Создать акцию с загрузкой изображения/иконки
     * @param {Object} data - Данные акции из req.body
     * @param {Object} file - Файл из req.file (опционально)
     * @param {number} userId - ID пользователя, создающего акцию
     * @returns {Object} Созданная акция
     */
    async create(data, file, userId) {
        // Если есть файл, формируем URL для изображения/иконки
        let iconUrl = data.icon || '';
        if (file) {
            // Сохраняем относительный путь для БД
            iconUrl = `/uploads/offers/${file.filename}`;
        }

        // Создаём запись в БД
        const offerId = await db.createOffer({
            title: data.title,
            description: data.description,
            price_old: data.price_old || '',
            price_new: data.price_new || '',
            features: data.features || [],
            icon: iconUrl,
            created_by: userId
        });

        // Логируем действие
        await db.logActivity(
            userId,
            'CREATE',
            'offer',
            offerId,
            `Создана акция: ${data.title}`
        );

        return {
            id: offerId,
            title: data.title,
            description: data.description,
            price_old: data.price_old || '',
            price_new: data.price_new || '',
            features: data.features || [],
            icon: iconUrl,
            created_by: userId,
            created_at: new Date().toISOString()
        };
    }

    /**
     * Обновить акцию с возможностью замены изображения
     * @param {number} id - ID акции
     * @param {Object} data - Данные для обновления из req.body
     * @param {Object} file - Новый файл изображения (опционально)
     * @param {number} userId - ID пользователя
     * @returns {Object} Обновлённая акция
     */
    async update(id, data, file, userId) {
        // Проверяем существование акции
        const existingOffer = await db.getOfferById(id);
        if (!existingOffer) {
            throw new Error('Акция не найдена');
        }

        // Если загружен новый файл
        let iconUrl = data.icon;
        if (file) {
            // Удаляем старое изображение если оно есть
            if (existingOffer.icon) {
                this.deleteImageFile(existingOffer.icon);
            }
            // Устанавливаем новый путь
            iconUrl = `/uploads/offers/${file.filename}`;
        } else if (iconUrl === '' && existingOffer.icon) {
            // Удаляем изображение если передан пустой icon
            this.deleteImageFile(existingOffer.icon);
        }

        // Формируем данные для обновления
        const updateData = {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.price_old !== undefined && { price_old: data.price_old }),
            ...(data.price_new !== undefined && { price_new: data.price_new }),
            ...(data.features !== undefined && { features: data.features }),
            ...(iconUrl !== undefined && { icon: iconUrl }),
            ...(data.is_active !== undefined && { is_active: data.is_active })
        };

        // Обновляем в БД
        await db.updateOffer(id, updateData);

        // Логируем действие
        const changedFields = Object.keys(updateData).join(', ');
        await db.logActivity(
            userId,
            'UPDATE',
            'offer',
            id,
            `Обновлена акция: ${existingOffer.title}. Изменённые поля: ${changedFields}`
        );

        return {
            id,
            ...updateData,
            updated_by: userId,
            updated_at: new Date().toISOString()
        };
    }

    /**
     * Удалить акцию (включая файл изображения)
     * @param {number} id - ID акции
     * @param {number} userId - ID пользователя
     * @returns {Object} Результат удаления
     */
    async delete(id, userId) {
        // Проверяем существование акции
        const existingOffer = await db.getOfferById(id);
        if (!existingOffer) {
            throw new Error('Акция не найдена');
        }

        // Удаляем файл изображения если он есть
        if (existingOffer.icon) {
            this.deleteImageFile(existingOffer.icon);
        }

        // Удаляем запись из БД
        await db.deleteOffer(id);

        // Логируем действие
        await db.logActivity(
            userId,
            'DELETE',
            'offer',
            id,
            `Удалена акция: ${existingOffer.title}`
        );

        return {
            id,
            deleted_at: new Date().toISOString()
        };
    }

    /**
     * Удалить файл изображения по URL
     * @param {string} imageUrl - URL изображения (например, /uploads/offers/file.jpg)
     */
    deleteImageFile(imageUrl) {
        try {
            // Преобразуем URL в путь к файлу
            const filePath = path.join(__dirname, '..', imageUrl);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(`Ошибка при удалении файла ${imageUrl}:`, error.message);
        }
    }

    /**
     * Middleware для обработки загрузки файлов
     * Может использоваться в контроллере как offersService.uploadMiddleware()
     */
    getUploadMiddleware() {
        return upload.single('icon');
    }
}

// Экспортируем синглтон
module.exports = new OffersService();
