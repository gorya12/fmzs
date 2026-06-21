/**
 * UpdatePromotionRequest
 * Класс валидации для обновления акции/спецпредложения
 */

class UpdatePromotionRequest {
    constructor(data, offerId) {
        this.data = data;
        this.offerId = offerId;
        this.errors = {};
    }

    /**
     * Запуск всех валидаций
     */
    validate() {
        // Проверка ID
        if (!this.offerId || isNaN(this.offerId)) {
            this.errors.id = 'Некорректный ID акции';
            return false;
        }

        // Проверка что хотя бы что-то для обновления передано
        if (Object.keys(this.data).length === 0) {
            this.errors.data = 'Необходимо передать данные для обновления';
            return false;
        }

        // Если передан title - валидируем его
        if (this.data.title !== undefined) {
            this.validateTitle();
        }

        // Если передано description - валидируем его
        if (this.data.description !== undefined) {
            this.validateDescription();
        }

        // Если передана цена - валидируем
        if (this.data.price_old !== undefined || this.data.price_new !== undefined) {
            this.validatePrices();
        }

        // Если переданы особенности - валидируем
        if (this.data.features !== undefined) {
            this.validateFeatures();
        }

        // Если передана иконка - валидируем
        if (this.data.icon !== undefined) {
            this.validateIcon();
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

        if (this.data.description !== undefined) {
            result.description = this.data.description?.trim() || '';
        }

        if (this.data.price_old !== undefined) {
            result.price_old = this.data.price_old ? String(this.data.price_old).trim() : '';
        }

        if (this.data.price_new !== undefined) {
            result.price_new = this.data.price_new ? String(this.data.price_new).trim() : '';
        }

        if (this.data.features !== undefined) {
            result.features = Array.isArray(this.data.features) ? this.data.features : [];
        }

        if (this.data.icon !== undefined) {
            result.icon = this.data.icon ? String(this.data.icon).trim() : '';
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

        if (trimmed.length < 3) {
            this.errors.title = 'Заголовок должен быть минимум 3 символа';
            return;
        }

        if (trimmed.length > 100) {
            this.errors.title = 'Заголовок не может быть больше 100 символов';
            return;
        }
    }

    validateDescription() {
        const description = this.data.description;

        if (typeof description !== 'string') {
            this.errors.description = 'Описание должно быть строкой';
            return;
        }

        const trimmed = description.trim();

        if (trimmed.length === 0) {
            this.errors.description = 'Описание не может быть пустым';
            return;
        }

        if (trimmed.length < 10) {
            this.errors.description = 'Описание должно быть минимум 10 символов';
            return;
        }

        if (trimmed.length > 1000) {
            this.errors.description = 'Описание не может быть больше 1000 символов';
            return;
        }
    }

    validatePrices() {
        const { price_old, price_new } = this.data;

        if (price_old !== undefined && price_old !== null && price_old !== '') {
            if (isNaN(price_old) || price_old < 0) {
                this.errors.price_old = 'Старая цена должна быть положительным числом';
                return;
            }
        }

        if (price_new !== undefined && price_new !== null && price_new !== '') {
            if (isNaN(price_new) || price_new < 0) {
                this.errors.price_new = 'Новая цена должна быть положительным числом';
                return;
            }
        }

        // Логика проверки: новая цена < старая цена
        if (price_old && price_new) {
            if (Number(price_new) >= Number(price_old)) {
                this.errors.price_new = 'Новая цена должна быть меньше старой цены';
            }
        }
    }

    validateFeatures() {
        const features = this.data.features;

        if (!Array.isArray(features)) {
            this.errors.features = 'Особенности должны быть массивом';
            return;
        }

        if (features.length > 10) {
            this.errors.features = 'Не может быть больше 10 особенностей';
            return;
        }

        for (let i = 0; i < features.length; i++) {
            const feature = features[i];

            if (typeof feature !== 'string') {
                this.errors.features = `Особенность ${i + 1} должна быть строкой`;
                return;
            }

            if (feature.trim().length > 100) {
                this.errors.features = `Особенность ${i + 1} не может быть больше 100 символов`;
                return;
            }
        }
    }

    validateIcon() {
        const icon = this.data.icon;

        if (typeof icon !== 'string') {
            this.errors.icon = 'Иконка должна быть строкой';
            return;
        }

        const trimmed = icon.trim();

        if (trimmed.length > 255) {
            this.errors.icon = 'Путь к иконке слишком длинный (максимум 255 символов)';
            return;
        }

        if (trimmed && !trimmed.match(/^[\/\w\-\.\~:?#\[\]@!$&'()*+,;=%]*$/)) {
            this.errors.icon = 'Иконка содержит недопустимые символы';
        }
    }
}

module.exports = UpdatePromotionRequest;
