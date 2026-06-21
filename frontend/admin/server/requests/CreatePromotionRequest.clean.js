class CreatePromotionRequest {
    constructor(data) {
        this.data = data;
        this.errors = {};
    }

    validate() {
        this.validateTitle();
        this.validateDescription();
        this.validatePrices();
        this.validateFeatures();
        this.validateIcon();

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
            description: this.data.description?.trim() || '',
            price_old: this.data.price_old ? String(this.data.price_old).trim() : '',
            price_new: this.data.price_new ? String(this.data.price_new).trim() : '',
            features: Array.isArray(this.data.features) ? this.data.features : [],
            icon: this.data.icon ? String(this.data.icon).trim() : ''
        };
    }

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

        if (!/^[\w\s\-\(\)\.,:а-яА-ЯёЁ]*$/.test(trimmed)) {
            this.errors.title = 'Заголовок содержит недопустимые символы';
            return;
        }
    }

    validateDescription() {
        const description = this.data.description;

        if (!description) {
            this.errors.description = 'Описание обязательно';
            return;
        }

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

        if (!price_old && !price_new) {
            return;
        }

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

        if (price_old && price_new) {
            if (Number(price_new) >= Number(price_old)) {
                this.errors.price_new = 'Новая цена должна быть меньше старой цены';
                return;
            }
        }
    }

    validateFeatures() {
        const features = this.data.features;

        if (!features) {
            return;
        }

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

            const trimmed = feature.trim();

            if (trimmed.length === 0) {
                this.errors.features = `Особенность ${i + 1} не может быть пустой`;
                return;
            }

            if (trimmed.length > 100) {
                this.errors.features = `Особенность ${i + 1} не может быть больше 100 символов`;
                return;
            }
        }
    }

    validateIcon() {
        const icon = this.data.icon;

        if (!icon) {
            return;
        }

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
            return;
        }
    }
}

module.exports = CreatePromotionRequest;
