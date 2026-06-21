    /**
 * PromotionController
 * Контроллер для отображения акций на клиентской стороне
 * 
 * Методы:
 * - index() — загрузка списка всех активных акций
 * - show(id) — загрузка данных одной акции по ID
 */

// API_BASE определяется в news.js
var API_BASE = window.FORMOSA_API_BASE || '';

console.log('[PromotionController] script loaded, API_BASE =', API_BASE);

const fallbackOffers = [
    {
        title: 'Диагностика оборудования',
        description: 'Проверим состояние узлов, подготовим рекомендации и план обслуживания.',
        price_old: 'от 35 000 ₽',
        price_new: 'от 25 000 ₽',
        features: ['Выезд', 'Отчет', 'Рекомендации']
    },
    {
        title: 'Сервисное обслуживание',
        description: 'Плановое обслуживание промышленного оборудования с контролем сроков.',
        price_old: '',
        price_new: 'по договору',
        features: ['Регламент', 'Контроль', 'Поддержка']
    },
    {
        title: 'Поставка комплектующих',
        description: 'Подберем и поставим совместимые комплектующие для вашего объекта.',
        price_old: '',
        price_new: 'от 7 дней',
        features: ['Подбор', 'Поставка', 'Гарантия']
    }
];

class PromotionController {
    /**
     * Загрузить все активные акции
     * @param {string} containerId - ID контейнера для рендеринга
     * @param {Function} renderCallback - Опциональная функция для кастомного рендеринга
     */
    async index(containerId = 'offers-container', renderCallback = null) {
        console.log('[PromotionController] index() called, containerId =', containerId);
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`[PromotionController] контейнер #${containerId} не найден`);
                return [];
            }

            console.log('[PromotionController] fetching from', `${API_BASE}/api/public/offers`);
            const response = await fetch(`${API_BASE}/api/public/offers`);
            console.log('[PromotionController] response status =', response.status);
            
            if (!response.ok) {
                throw new Error('Не удалось загрузить акции');
            }

            const offers = await response.json();
            console.log('[PromotionController] offers loaded:', offers.length, offers);

            if (offers.length === 0) {
                container.innerHTML = fallbackOffers.map((offer, index) => this.renderOfferCard(offer, index)).join('');
                return fallbackOffers;
            }

            // Если передана кастомная функция рендеринга — используем её
            if (renderCallback && typeof renderCallback === 'function') {
                container.innerHTML = renderCallback(offers).join('');
            } else {
                // Рендерим по умолчанию
                container.innerHTML = offers.map(offer => this.renderOfferCard(offer)).join('');
            }

            return offers;
        } catch (error) {
            console.error('PromotionController index error:', error);
            // Fallback на заглушку
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = fallbackOffers.map((offer, index) => this.renderOfferCard(offer, index)).join('');
            }
            return fallbackOffers;
        }
    }

    /**
     * Загрузить одну акцию по ID
     * @param {number|string} id - ID акции
     * @param {string} containerId - ID контейнера для рендеринга
     * @param {Function} renderCallback - Опциональная функция для кастомного рендеринга
     * @returns {Object|null} Данные акции или null
     */
    async show(id, containerId = 'offer-detail-container', renderCallback = null) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`PromotionController: контейнер #${containerId} не найден`);
                return null;
            }

            if (!id) {
                container.innerHTML = '<p style="text-align:center;color:#6C757D;padding:40px;">Акция не найдена</p>';
                return null;
            }

            const response = await fetch(`${API_BASE}/api/public/offers/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    container.innerHTML = '<p style="text-align:center;color:#6C757D;padding:40px;">Акция не найдена</p>';
                } else {
                    throw new Error('Ошибка при загрузке акции');
                }
                return null;
            }

            const offer = await response.json();

            // Если передана кастомная функция рендеринга — используем её
            if (renderCallback && typeof renderCallback === 'function') {
                container.innerHTML = renderCallback(offer);
            } else {
                // Рендерим по умолчанию
                container.innerHTML = this.renderOfferDetail(offer);
            }

            // Обновляем заголовок страницы
            document.title = `${offer.title} | Формоза-Сервис`;

            return offer;
        } catch (error) {
            console.error('PromotionController show error:', error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<p style="text-align:center;color:#6C757D;padding:40px;">Ошибка загрузки акции</p>';
            }
            return null;
        }
    }

    /**
     * Рендер карточки акции (по умолчанию для слайдера)
     * @param {Object} offer - Данные акции
     * @param {number} index - Индекс в списке (для иконки)
     * @returns {string} HTML
     */
    renderOfferCard(offer, index = 0) {
        const features = Array.isArray(offer.features) ? offer.features : [];
        const featuresHTML = features.length > 0
            ? `<div class="offer-features">${features.map(f => `<span>${f}</span>`).join('')}</div>`
            : '';

        const priceHTML = offer.price_new
            ? `<div class="offer-price">
                ${offer.price_old ? `<span class="offer-price-old">${offer.price_old}</span>` : ''}
                <span class="offer-price-new">${offer.price_new}</span>
               </div>`
            : '';

        // Иконки по порядку
        const icons = [
            `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 27l-4-4-6 6h36l-6-6-4 4-8-8-8 8z"/><circle cx="24" cy="16" r="5"/><path d="M12 34h24"/></svg>`,
            `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M24 14v10l7 7"/></svg>`,
            `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4v6m0 28v6M4 24h6m28 0h6"/><circle cx="24" cy="24" r="10"/><path d="M24 18v6l4 4"/></svg>`,
            `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="18" height="14" rx="3"/><rect x="26" y="8" width="18" height="14" rx="3"/><rect x="4" y="26" width="18" height="14" rx="3"/><rect x="26" y="26" width="18" height="14" rx="3"/></svg>`
        ];
        const icon = icons[index % icons.length];

        // Используем иконку из БД если есть, иначе генерируем
        const iconHTML = offer.icon 
            ? `<img src="${offer.icon}" alt="" class="offer-card-icon-img" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><div class="offer-card-icon-svg" style="display:none">${icon}</div>`
            : `<div class="offer-card-icon">${icon}</div>`;

        return `
            <div class="offer-card-slider">
                ${iconHTML}
                <h3>${offer.title}</h3>
                <p class="offer-description">${offer.description}</p>
                ${featuresHTML}
                ${priceHTML}
                <a href="consultation.html" class="offer-link">Подробнее</a>
            </div>
        `;
    }

    /**
     * Рендер детальной страницы акции
     * @param {Object} offer - Данные акции
     * @returns {string} HTML
     */
    renderOfferDetail(offer) {
        const features = Array.isArray(offer.features) ? offer.features : [];
        const featuresHTML = features.length > 0
            ? `<ul class="offer-features-list">${features.map(f => `<li>${f}</li>`).join('')}</ul>`
            : '<p>Детали акции уточняйте у менеджера</p>';

        const priceHTML = offer.price_new
            ? `<div class="offer-detail-price">
                ${offer.price_old ? `<span class="offer-detail-price-old">${offer.price_old}</span>` : ''}
                <span class="offer-detail-price-new">${offer.price_new}</span>
               </div>`
            : '';

        const imageHTML = offer.icon
            ? `<div class="offer-detail-image"><img src="${offer.icon}" alt="${offer.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27300%27 viewBox=%270 0 600 300%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27600%27 height=%27300%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27300%27 y=%27150%27%3EИзображение%3C/text%3E%3C/svg%3E'"></div>`
            : '<div class="offer-detail-image"><img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27300%27 viewBox=%270 0 600 300%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27600%27 height=%27300%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27300%27 y=%27150%27%3EИзображение%3C/text%3E%3C/svg%3E" alt="Акция"></div>';

        return `
            <article class="offer-detail">
                ${imageHTML}
                <div class="offer-detail-body">
                    <h1 class="offer-detail-title">${offer.title}</h1>
                    ${priceHTML}
                    <div class="offer-detail-description">
                        <p>${offer.description}</p>
                    </div>
                    <div class="offer-detail-features">
                        <h3>Преимущества акции:</h3>
                        ${featuresHTML}
                    </div>
                    <div class="offer-detail-actions">
                        <a href="consultation.html" class="btn btn-primary btn-lg">Получить консультацию</a>
                        <a href="index.html#offers" class="btn btn-secondary">← Все акции</a>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Загрузить акции в слайдер (специальный метод для главной)
     * @param {string} trackId - ID трека слайдера
     */
    async loadOffersSlider(trackId = 'offers-slider-track') {
        console.log('[PromotionController] loadOffersSlider() called');
        const offers = await this.index(trackId, (offers) => {
            return offers.map((offer, index) => this.renderOfferCard(offer, index));
        });
        console.log('[PromotionController] offers rendered, count =', offers.length);

        if (typeof initOffersSlider === 'function') {
            console.log('[PromotionController] calling initOffersSlider in 100ms');
            setTimeout(() => initOffersSlider(), 100);
        } else {
            console.warn('[PromotionController] initOffersSlider not found!');
        }

        return offers;
    }
}

// Экспортируем глобально
window.PromotionController = new PromotionController();

// Автозагрузка если есть контейнер на странице
document.addEventListener('DOMContentLoaded', function() {
    console.log('[PromotionController] DOMContentLoaded fired');
    const offersContainer = document.getElementById('offers-slider-track');
    const offersListContainer = document.getElementById('offers-container');
    
    console.log('[PromotionController] offersContainer =', offersContainer, 'offersListContainer =', offersListContainer);
    
    if (offersContainer) {
        console.log('[PromotionController] auto-loading offers slider');
        window.PromotionController.loadOffersSlider('offers-slider-track');
    } else if (offersListContainer) {
        console.log('[PromotionController] auto-loading offers list');
        window.PromotionController.index('offers-container');
    } else {
        console.log('[PromotionController] no offers container found');
    }
    
    // Инициализация слайдера после загрузки акций
    if (typeof initOffersSlider === 'function') {
        setTimeout(() => initOffersSlider(), 150);
    }
});
