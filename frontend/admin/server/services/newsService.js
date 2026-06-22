/**
 * newsService.js
 * Сервисный слой для управления новостями
 * 
 * Отвечает за:
 * - Загрузку изображений через Multer
 * - Сохранение/обновление/удаление новостей в БД
 * - Бизнес-логику (проверки, обработка файлов)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

// ============== НАСТРОЙКА MULTER ==============

// Директория для загрузки изображений новостей
const NEWS_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'news');

// Гарантируем существование директории
if (!fs.existsSync(NEWS_UPLOAD_DIR)) {
    fs.mkdirSync(NEWS_UPLOAD_DIR, { recursive: true });
}

// Конфигурация хранилища
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, NEWS_UPLOAD_DIR);
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

class NewsService {
    /**
     * Получить все новости
     */
    async getAll() {
        return await db.getNews();
    }

    /**
     * Получить новость по ID
     */
    async getById(id) {
        return await db.getNewsById(id);
    }

    /**
     * Создать новость с загрузкой изображения
     * @param {Object} data - Данные новости из req.body
     * @param {Object} file - Файл из req.file (опционально)
     * @param {number} userId - ID пользователя, создающего новость
     * @returns {Object} Созданная новость
     */
    async create(data, file, userId) {
        // Если есть файл, формируем URL для изображения
        let imageUrl = data.image_url || '';
        if (file) {
            // Сохраняем относительный путь для БД
            imageUrl = `/uploads/news/${file.filename}`;
        }

        // Создаём запись в БД
        const newsId = await db.createNews({
            title: data.title,
            category: data.category,
            excerpt: data.excerpt,
            content: data.content || '',
            image_url: imageUrl,
            created_by: userId
        });

        // Логируем действие
        await db.logActivity(
            userId,
            'CREATE',
            'news',
            newsId,
            `Создана новость: ${data.title}`
        );

        return {
            id: newsId,
            title: data.title,
            category: data.category,
            excerpt: data.excerpt,
            content: data.content || '',
            image_url: imageUrl,
            created_by: userId,
            created_at: new Date().toISOString()
        };
    }

    /**
     * Обновить новость с возможностью замены изображения
     * @param {number} id - ID новости
     * @param {Object} data - Данные для обновления из req.body
     * @param {Object} file - Новый файл изображения (опционально)
     * @param {number} userId - ID пользователя
     * @returns {Object} Обновлённая новость
     */
    async update(id, data, file, userId) {
        // Проверяем существование новости
        const existingNews = await db.getNewsById(id);
        if (!existingNews) {
            throw new Error('Новость не найдена');
        }

        // Если загружен новый файл
        let imageUrl = data.image_url;
        if (file) {
            // Удаляем старое изображение если оно есть
            if (existingNews.image_url) {
                this.deleteImageFile(existingNews.image_url);
            }
            // Устанавливаем новый путь
            imageUrl = `/uploads/news/${file.filename}`;
        } else if (imageUrl === '' && existingNews.image_url) {
            // Удаляем изображение если передан пустой image_url
            this.deleteImageFile(existingNews.image_url);
        }

        // Формируем данные для обновления
        const updateData = {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.category !== undefined && { category: data.category }),
            ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
            ...(data.content !== undefined && { content: data.content }),
            ...(imageUrl !== undefined && { image_url: imageUrl }),
            ...(data.is_active !== undefined && { is_active: data.is_active })
        };

        // Обновляем в БД
        await db.updateNews(id, updateData);

        // Логируем действие
        const changedFields = Object.keys(updateData).join(', ');
        await db.logActivity(
            userId,
            'UPDATE',
            'news',
            id,
            `Обновлена новость: ${existingNews.title}. Изменённые поля: ${changedFields}`
        );

        return {
            id,
            ...updateData,
            updated_by: userId,
            updated_at: new Date().toISOString()
        };
    }

    /**
     * Удалить новость (включая файл изображения)
     * @param {number} id - ID новости
     * @param {number} userId - ID пользователя
     * @returns {Object} Результат удаления
     */
    async delete(id, userId) {
        // Проверяем существование новости
        const existingNews = await db.getNewsById(id);
        if (!existingNews) {
            throw new Error('Новость не найдена');
        }

        // Удаляем файл изображения если он есть
        if (existingNews.image_url) {
            this.deleteImageFile(existingNews.image_url);
        }

        // Удаляем запись из БД
        await db.deleteNews(id);

        // Логируем действие
        await db.logActivity(
            userId,
            'DELETE',
            'news',
            id,
            `Удалена новость: ${existingNews.title}`
        );

        return {
            id,
            deleted_at: new Date().toISOString()
        };
    }

    /**
     * Удалить файл изображения по URL
     * @param {string} imageUrl - URL изображения (например, /uploads/news/file.jpg)
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
     * Может использоваться в контроллере как newsService.uploadMiddleware()
     */
    getUploadMiddleware() {
        return upload.single('image');
    }
}

// Экспортируем синглтон
module.exports = new NewsService();
