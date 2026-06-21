/**
 * UpdateNewsRequest
 * Класс валидации для обновления новости
 */

class UpdateNewsRequest {
    constructor(data, newsId) {
        this.data = data;
        this.newsId = newsId;
        this.errors = {};
    }

    /**
     * Запуск всех валидаций
     */
    validate() {
        // Проверка ID
        if (!this.newsId || isNaN(this.newsId)) {
            this.errors.id = 'Некорректный ID новости';
            return false;
        }

        // Проверка что хотя бы что-то для обновления передано
        if (Object.keys(this.data).length === 0) {
            this.errors.data = 'Необходимо передать данные для обновления';
            return false;
        }

        // Валидируем только переданные поля
        if (this.data.title !== undefined) {
            this.validateTitle();
        }

        if (this.data.category !== undefined) {
            this.validateCategory();
        }

        if (this.data.excerpt !== undefined) {
            this.validateExcerpt();
        }

        if (this.data.content !== undefined) {
            this.validateContent();
        }

        if (this.data.image_url !== undefined) {
            this.validateImageUrl();
        }

        return Object.keys(this.errors).length === 0;
    }

    getErrors() {
        return this.errors;
    }

    getFirstError() {
        const keys = Object.keys(this.errors);
        if (keys.length === 0) return null;
        return this.errors[keys[0]];
    }

    /**
     * Получить очищенные данные
     */
    sanitized() {
        const result = {};

        if (this.data.title !== undefined) {
            result.title = this.data.title?.trim() || '';
        }

        if (this.data.category !== undefined) {
            result.category = this.data.category?.trim() || '';
        }

        if (this.data.excerpt !== undefined) {
            result.excerpt = this.data.excerpt?.trim() || '';
        }

        if (this.data.content !== undefined) {
            result.content = this.data.content?.trim() || '';
        }

        if (this.data.image_url !== undefined) {
            result.image_url = this.data.image_url ? String(this.data.image_url).trim() : '';
        }

        return result;
    }

    // ============== МЕТОДЫ ВАЛИДАЦИИ ==============

    validateTitle() {
        const title = this.data.title;

        if (typeof title !== 'string') {
            this.errors.title = 'Заголовок должен быть строкой';
            return;
        }

        const trimmed = title.trim();

        if (trimmed.length === 0) {
            this.errors.title = 'Заголовок не может быть пустым';
            return;
        }

        if (trimmed.length < 5) {
            this.errors.title = 'Заголовок должен быть минимум 5 символов';
            return;
        }

        if (trimmed.length > 200) {
            this.errors.title = 'Заголовок не может быть больше 200 символов';
        }
    }

    validateCategory() {
        const category = this.data.category;

        if (typeof category !== 'string') {
            this.errors.category = 'Категория должна быть строкой';
            return;
        }

        const validCategories = ['news', 'updates', 'events', 'other'];
        
        if (!validCategories.includes(String(category).toLowerCase())) {
            this.errors.category = `Категория должна быть одной из: ${validCategories.join(', ')}`;
        }
    }

    validateExcerpt() {
        const excerpt = this.data.excerpt;

        if (typeof excerpt !== 'string') {
            this.errors.excerpt = 'Краткое описание должно быть строкой';
            return;
        }

        const trimmed = excerpt.trim();

        if (trimmed.length === 0) {
            this.errors.excerpt = 'Краткое описание не может быть пустым';
            return;
        }

        if (trimmed.length < 10) {
            this.errors.excerpt = 'Краткое описание должно быть минимум 10 символов';
            return;
        }

        if (trimmed.length > 300) {
            this.errors.excerpt = 'Краткое описание не может быть больше 300 символов';
        }
    }

    validateContent() {
        const content = this.data.content;

        if (typeof content !== 'string') {
            this.errors.content = 'Содержание должно быть строкой';
            return;
        }

        const trimmed = content.trim();

        if (trimmed.length === 0) {
            this.errors.content = 'Содержание не может быть пустым';
            return;
        }

        if (trimmed.length < 20) {
            this.errors.content = 'Содержание должно быть минимум 20 символов';
            return;
        }

        if (trimmed.length > 10000) {
            this.errors.content = 'Содержание не может быть больше 10000 символов';
        }
    }

    validateImageUrl() {
        const imageUrl = this.data.image_url;

        if (imageUrl === null || imageUrl === '') {
            return;
        }

        if (typeof imageUrl !== 'string') {
            this.errors.image_url = 'URL изображения должен быть строкой';
            return;
        }

        const trimmed = imageUrl.trim();

        if (trimmed.length > 255) {
            this.errors.image_url = 'URL изображения слишком длинный';
        }
    }
}

module.exports = UpdateNewsRequest;
