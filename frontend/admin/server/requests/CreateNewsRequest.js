/**
 * CreateNewsRequest
 * Класс валидации для создания новости
 */

class CreateNewsRequest {
    constructor(data) {
        this.data = data;
        this.errors = {};
    }

    validate() {
        this.validateTitle();
        this.validateCategory();
        this.validateExcerpt();
        this.validateContent();
        this.validateImageUrl();

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

    sanitized() {
        return {
            title: this.data.title?.trim() || '',
            category: this.data.category?.trim() || '',
            excerpt: this.data.excerpt?.trim() || '',
            content: this.data.content?.trim() || '',
            image_url: this.data.image_url ? String(this.data.image_url).trim() : ''
        };
    }

    // ============== ВАЛИДАЦИЯ ==============

    validateTitle() {
        const title = this.data.title;

        if (!title) {
            this.errors.title = 'Заголовок обязателен';
            return;
        }

        if (typeof title !== 'string') {
            this.errors.title = 'Заголовок должен быть строкой';
            return;
        }

        const trimmed = title.trim();

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

        if (!category) {
            this.errors.category = 'Категория обязательна';
            return;
        }

        const validCategories = ['news', 'updates', 'events', 'other'];
        
        if (!validCategories.includes(String(category).toLowerCase())) {
            this.errors.category = `Категория должна быть одной из: ${validCategories.join(', ')}`;
        }
    }

    validateExcerpt() {
        const excerpt = this.data.excerpt;

        if (!excerpt) {
            this.errors.excerpt = 'Краткое описание обязательно';
            return;
        }

        if (typeof excerpt !== 'string') {
            this.errors.excerpt = 'Краткое описание должно быть строкой';
            return;
        }

        const trimmed = excerpt.trim();

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

        if (!content) {
            this.errors.content = 'Содержание обязательно';
            return;
        }

        if (typeof content !== 'string') {
            this.errors.content = 'Содержание должно быть строкой';
            return;
        }

        const trimmed = content.trim();

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

        // Опционально
        if (!imageUrl) {
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

module.exports = CreateNewsRequest;
