        var API_BASE = window.FORMOSA_API_BASE || '';

// Форматирование даты
function formatDateRu(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ===== ЗАГРУЗКА НОВОСТЕЙ С API =====
async function loadNewsFromAPI(limit = 6) {
    try {
        const container = document.getElementById('news-container');
        if (!container) return;

        const res = await fetch(`${API_BASE}/api/public/news`);
        if (!res.ok) throw new Error('Не удалось загрузить новости');
        const news = await res.json();

        if (news.length === 0) {
            loadNews();
            return;
        }
        
        const displayNews = news.slice(0, limit);
        container.innerHTML = displayNews.map(n => createNewsCardFromAPI(n)).join('');
    } catch (e) {
        console.error('Ошибка загрузки новостей:', e);
        // Fallback на статические данные
        loadNews();
    }
}

function createNewsCardFromAPI(newsItem) {
    const image = newsItem.image_url || 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27200%27 viewBox=%270 0 320 200%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27320%27 height=%27200%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2716%27 text-anchor=%27middle%27 x=%27160%27 y=%27100%27%3EФото%3C/text%3E%3C/svg%3E';
    const date = formatDateRu(newsItem.created_at);
    return `
        <article class="news-card">
            <div class="news-card-image">
                <img src="${image}" alt="${newsItem.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27200%27 viewBox=%270 0 320 200%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27320%27 height=%27200%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2716%27 text-anchor=%27middle%27 x=%27160%27 y=%27100%27%3EФото%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="news-card-content">
                <span class="news-card-category">${newsItem.category}</span>
                <h3 class="news-card-title">${newsItem.title}</h3>
                <p class="news-card-excerpt">${newsItem.excerpt}</p>
                <div class="news-card-footer">
                    <span class="news-card-date">${date}</span>
                    <a href="news-post.html?id=${newsItem.id}" class="read-more-arrow">
                        Читать далее
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.172 11L10.808 5.63605L12.222 4.22205L20 12L12.222 19.778L10.808 18.364L16.172 13H4V11H16.172Z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </article>
    `;
}

// ===== ЗАГРУЗКА АКЦИЙ С API =====
// Функции перенесены в promotionController.js
// Используйте window.PromotionController.loadOffersSlider() или .index()

// ===== АРХИВ НОВОСТЕЙ =====
async function loadNewsArchive() {
    const container = document.getElementById('archive-news-container');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/api/public/news`);
        if (!res.ok) throw new Error('Не удалось загрузить новости');
        const news = await res.json();

        if (news.length === 0) {
            renderArchiveFallback(container);
            return;
        }

        container.innerHTML = news.map(n => createArchiveNewsCard(n)).join('');
    } catch (e) {
        console.error('Ошибка загрузки архива:', e);
        renderArchiveFallback(container);
    }
}

function createArchiveNewsCard(newsItem) {
    const image = newsItem.image_url || newsItem.image || 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27250%27 viewBox=%270 0 400 250%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27400%27 height=%27250%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2718%27 text-anchor=%27middle%27 x=%27200%27 y=%27125%27%3EФото%3C/text%3E%3C/svg%3E';
    const date = newsItem.created_at ? formatDateRu(newsItem.created_at) : newsItem.date;
    const postUrl = newsItem.created_at ? `news-post.html?id=${newsItem.id}` : `index.html#news`;
    return `
        <article class="archive-news-card">
            <div class="archive-news-image">
                <img src="${image}" alt="${newsItem.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27250%27 viewBox=%270 0 400 250%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27400%27 height=%27250%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2718%27 text-anchor=%27middle%27 x=%27200%27 y=%27125%27%3EФото%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="archive-news-content">
                <span class="archive-news-category">${newsItem.category}</span>
                <h3 class="archive-news-title">${newsItem.title}</h3>
                <p class="archive-news-excerpt">${newsItem.excerpt}</p>
                <div class="archive-news-footer">
                    <span class="archive-news-date">${date}</span>
                    <a href="${postUrl}" class="btn btn-sm btn-secondary">Читать полностью</a>
                </div>
            </div>
        </article>
    `;
}

function renderArchiveFallback(container) {
    container.innerHTML = newsData.map(newsItem => createArchiveNewsCard(newsItem)).join('');
}

// ===== СТРАНИЦА ОТДЕЛЬНОЙ НОВОСТИ =====
async function loadNewsPost() {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) {
            document.getElementById('post-container').innerHTML = '<p style="text-align:center;padding:60px;">Новость не найдена</p>';
            return;
        }

        const res = await fetch(`${API_BASE}/api/public/news/${id}`);
        if (!res.ok) throw new Error('Новость не найдена');
        const news = await res.json();

        const container = document.getElementById('post-container');
        const image = news.image_url || 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27800%27 height=%27400%27 viewBox=%270 0 800 400%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27800%27 height=%27400%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2724%27 text-anchor=%27middle%27 x=%27400%27 y=%27200%27%3EФото%3C/text%3E%3C/svg%3E';
        const date = formatDateRu(news.created_at);

        container.innerHTML = `
            <article class="news-post">
                <div class="news-post-image">
                    <img src="${image}" alt="${news.title}" onerror="this.style.display='none'">
                </div>
                <div class="news-post-body">
                    <div class="news-post-meta">
                        <span class="news-post-category">${news.category}</span>
                        <span class="news-post-date">${date}</span>
                    </div>
                    <h1 class="news-post-title">${news.title}</h1>
                    <div class="news-post-excerpt">${news.excerpt}</div>
                    <div class="news-post-content">${news.content || news.excerpt}</div>
                    <div class="news-post-footer">
                        <a href="news-archive.html" class="btn btn-secondary">← Вернуться к архиву</a>
                        <a href="index.html#news" class="btn btn-primary">На главную</a>
                    </div>
                </div>
            </article>
        `;

        // Обновляем title страницы
        document.title = `${news.title} | Формоза-Сервис`;

        // Обновляем breadcrumb
        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = news.title.length > 40 ? news.title.substring(0, 40) + '...' : news.title;
        }

        // Загружаем рекомендации
        loadRelatedNews(id);
    } catch (e) {
        console.error('Ошибка загрузки новости:', e);
        document.getElementById('post-container').innerHTML = '<p style="text-align:center;padding:60px;">Новость не найдена или произошла ошибка</p>';
    }
}

// ===== РЕКОМЕНДАЦИИ (другие новости) =====
async function loadRelatedNews(excludeId) {
    try {
        const container = document.getElementById('related-news-container');
        if (!container) return;

        const res = await fetch(`${API_BASE}/api/public/news`);
        if (!res.ok) throw new Error('Не удалось загрузить новости');
        const allNews = await res.json();

        // Исключаем текущую новость и берём до 3 других
        const related = allNews.filter(n => n.id !== parseInt(excludeId)).slice(0, 3);

        if (related.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = related.map(n => createNewsCardFromAPI(n)).join('');
    } catch (e) {
        console.error('Ошибка загрузки рекомендаций:', e);
    }
}

// Данные для преимуществ
let offersData = {
    reliability: {
        title: 'Надёжность',
        description: 'Мы гарантируем стабильную работу оборудования. Все системы проходят строгий контроль качества и тестирование перед вводом в эксплуатацию. Надёжность — наш главный приоритет.',
        icon: `<img src="assets/icons/reliability.png" alt="Ромб" class="rhomb-data">`
    },
    licensed: {
        title: 'Лицензированность',
        description: 'Компания имеет все необходимые лицензии и сертификаты для выполнения работ. Мы соответствуем международным стандартам безопасности и качества.',
        icon: `<img src="assets/icons/licensing.png" alt="Ромб" class="rhomb-data">`
    },
    support: {
        title: 'Поддержка',
        description: 'Наша команда экспертов доступна 24/7. Мы оказываем техническую поддержку, консультируем по вопросам эксплуатации и оперативно решаем любые проблемы.',
        icon: `<img src="assets/icons/support.png" alt="Ромб" class="rhomb-data">`
    },
    quality: {
        title: 'Качество',
        description: 'Мы используем только сертифицированные материалы и компоненты. Каждый проект проходит многоступенчатый контроль качества для достижения идеального результата.',
        icon: `<img src="assets/icons/quality.png" alt="Ромб" class="rhomb-data">`
    }
};

// Данные новостей
const newsData = [
    {
        id: 1,
        category: 'Сервис',
        title: 'Новое оборудование для диагностики',
        excerpt: 'Мы закупили современное диагностическое оборудование, которое позволит проводить более точную оценку состояния техники и выявлять проблемы на ранних стадиях.',
        date: '15 января 2025',
        image: 'assets/images/news1.jpg'
    },
    {
        id: 2,
        category: 'Ремонт',
        title: 'Успешный ремонт промышленного комплекса',
        excerpt: 'Завершили сложный ремонт производственной линии для крупного предприятия. Все работы выполнены в срок с соблюдением технических требований.',
        date: '12 января 2025',
        image: 'assets/images/news2.jpg'
    },
    {
        id: 3,
        category: 'Сервис',
        title: 'Расширение сервисной сети',
        excerpt: 'Открыли новый сервисный центр в регионе. Теперь наши клиенты могут получить помощь быстрее и удобнее, независимо от местоположения.',
        date: '10 января 2025',
        image: 'assets/images/news3.jpg'
    },
    {
        id: 4,
        category: 'Ремонт',
        title: 'Модернизация системы охлаждения',
        excerpt: 'Провели полную модернизацию системы охлаждения для промышленного объекта. Повысили эффективность работы оборудования на 25%.',
        date: '8 января 2025',
        image: 'assets/images/news4.jpg'
    },
    {
        id: 5,
        category: 'Сервис',
        title: 'Обучение персонала клиентов',
        excerpt: 'Провели серию обучающих семинаров для операторов оборудования. Помогаем клиентам максимально эффективно использовать технику.',
        date: '5 января 2025',
        image: 'assets/images/news5.jpg'
    },
    {
        id: 6,
        category: 'Ремонт',
        title: 'Экстренный выезд на объект',
        excerpt: 'Наши специалисты оперативно выехали на объект для устранения аварии. Работа была выполнена за 6 часов, минимизировав простои.',
        date: '3 января 2025',
        image: 'assets/images/news6.jpg'
    }
];

// Функция для создания HTML карточки новости
function createNewsCard(newsItem) {
    return `
        <article class="news-card">
            <div class="news-card-image">
                <img src="${newsItem.image}" alt="${newsItem.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27200%27 viewBox=%270 0 320 200%27%3E%3Crect fill=%27%23F8F9FA%27 width=%27320%27 height=%27200%27/%3E%3Ctext fill=%27%236C757D%27 font-family=%27Arial%27 font-size=%2716%27 text-anchor=%27middle%27 x=%27160%27 y=%27100%27%3EФото%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="news-card-content">
                <span class="news-card-category">${newsItem.category}</span>
                <h3 class="news-card-title">${newsItem.title}</h3>
                <p class="news-card-excerpt">${newsItem.excerpt}</p>
                <div class="news-card-footer">
                    <span class="news-card-date">${newsItem.date}</span>
                    <a href="#" class="read-more-arrow">
                        Читать далее
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.172 11L10.808 5.63605L12.222 4.22205L20 12L12.222 19.778L10.808 18.364L16.172 13H4V11H16.172Z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </article>
    `;
}

// Функция для загрузки новостей
function loadNews() {
    try {
        const container = document.getElementById('news-container');
        if (!container) {
            console.error('Контейнер #news-container не найден');
            return;
        }
        
        if (!newsData || newsData.length === 0) {
            console.error('Данные новостей пусты');
            return;
        }
        
        // Проверяем, есть ли уже контент (статические карточки)
        const hasStaticContent = container.querySelector('.news-card');
        if (hasStaticContent) {
            console.log('Статические карточки найдены, пропускаем загрузку через JS');
            return;
        }
        
        const newsHTML = newsData.map(newsItem => createNewsCard(newsItem)).join('');
        container.innerHTML = newsHTML;
        console.log('Новости успешно загружены:', newsData.length);
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
    }
}

// Загружаем новости при загрузке страницы
function initAll() {
    console.log('=== initAll called ===');
    markCurrentNavigation();
    loadNewsFromAPI(6);
    // Акции загружаются через promotionController.js автоматически
    initOffersSection();
    initMobileMenu();
    initPhoneModal();
    initContactForm();
}

function normalizePagePath(value) {
    const path = value.split('?')[0].split('#')[0].replace(/\/$/, '');
    const file = path.substring(path.lastIndexOf('/') + 1) || 'index';
    return file.replace(/\.html$/, '') || 'index';
}

function markCurrentNavigation() {
    const current = normalizePagePath(window.location.pathname);
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
        const target = normalizePagePath(href);
        link.classList.toggle('active', target === current);
    });
}
    
document.addEventListener('DOMContentLoaded', initAll);

// Также пробуем сразу при загрузке скрипта
console.log('Script loaded, DOM readyState:', document.readyState);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Initializing immediately');
    initAll();
}

// Переинициализация при изменении размера экрана (для переключения mobile/desktop)
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        console.log('Resize detected, reinitializing...');
        initOffersSection();
    }, 200);
});

function initPhoneModal() {
    const phoneBtn = document.getElementById('nav-phone-btn');
    const headerPhoneBtn = document.querySelector('.mobile-phone-btn');
    const modal = document.getElementById('phone-modal');
    
    if (!modal) {
        console.log('Phone modal not found');
        return;
    }
    
    console.log('Phone modal initialized');
    
    // Открытие модального окна
    function openModal(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        modal.style.display = 'flex';
        
        // Небольшая задержка для анимации
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
    }
    
    if (phoneBtn) {
        phoneBtn.addEventListener('click', openModal);
        console.log('Phone btn listener added');
    }
    
    if (headerPhoneBtn) {
        headerPhoneBtn.addEventListener('click', openModal);
        console.log('Header phone btn listener added');
    }
    
    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.style.display = '';
        }, 300);
    }
    
    const closeBtn = document.getElementById('phone-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    const overlay = document.querySelector('.phone-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Закрытие при нажатии ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
    
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (!menuToggle || !mobileNav) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    console.log('Mobile menu initialized');
    
    // Открытие/закрытие меню
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu toggle clicked');
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    // Закрываем меню при клике на ссылку
    const navLinks = mobileNav.querySelectorAll('.mobile-nav-link, .mobile-nav-email');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Nav link clicked');
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            
            // Небольшая задержка перед переходом по ссылке
            setTimeout(() => {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            }, 100);
        });
    });
    
    // Кнопка "Позвонить нам" — только закрываем меню, модалка откроется отдельным обработчиком
    const phoneBtn = document.getElementById('nav-phone-btn');
    if (phoneBtn) {
        phoneBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Phone button clicked');
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            // НЕ делаем window.location.href — модалка откроется из initPhoneModal
        });
    }
    
    // Закрываем меню при клике вне его
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active')) {
            const isClickInside = mobileNav.contains(e.target) || menuToggle.contains(e.target);
            if (!isClickInside) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        }
    });
    
    // Закрываем меню при изменении размера экрана
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}

function initOffersSection() {
    console.log('=== initOffersSection ===');
    
    // Проверяем ширину экрана
    const isMobile = window.innerWidth < 768;
    console.log('Is mobile:', isMobile);
    
    if (isMobile) {
        // === MOBILE ВЕРСИЯ ===
        const mobileOfferCards = document.querySelectorAll('.mobile-offer-card');
        const mobileDots = document.querySelectorAll('.mobile-offer-dot');
        const mobileTitleEl = document.getElementById('mobile-offer-title');
        const mobileDescriptionEl = document.getElementById('mobile-offer-description');
        
        console.log('Mobile - cards:', mobileOfferCards.length, 'dots:', mobileDots.length);
        console.log('Mobile - title:', !!mobileTitleEl, 'description:', !!mobileDescriptionEl);
        
        if (mobileOfferCards.length === 0 || !mobileTitleEl || !mobileDescriptionEl) {
            console.log('Mobile elements not found');
            return;
        }
        
        // Функция обновления контента
        function updateMobileCard(index) {
            const card = mobileOfferCards[index];
            const offerKey = card.dataset.offer;
            const offerData = offersData[offerKey];
            
            if (!offerData) {
                console.log('No data for:', offerKey);
                return;
            }
            
            console.log('Updating to:', offerKey);
            
            // Убираем активный класс у всех
            mobileOfferCards.forEach(c => c.classList.remove('active'));
            mobileDots.forEach(d => d.classList.remove('active'));
            
            // Добавляем активный класс текущему
            card.classList.add('active');
            if (mobileDots[index]) {
                mobileDots[index].classList.add('active');
            }
            
            // Обновляем текст с анимацией
            const detailsContent = document.querySelector('.mobile-offer-details-content');
            if (detailsContent) {
                detailsContent.classList.add('fade-out');
                
                setTimeout(() => {
                    mobileTitleEl.textContent = offerData.title;
                    mobileDescriptionEl.textContent = offerData.description;
                    detailsContent.classList.remove('fade-out');
                }, 300);
            } else {
                mobileTitleEl.textContent = offerData.title;
                mobileDescriptionEl.textContent = offerData.description;
            }
        }
        
        // Добавляем обработчики на карточки
        mobileOfferCards.forEach((card, index) => {
            card.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Card clicked:', index);
                updateMobileCard(index);
            };
        });
        
        // Добавляем обработчики на точки
        mobileDots.forEach((dot, index) => {
            dot.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dot clicked:', index);
                updateMobileCard(index);
            };
        });
        
        // Устанавливаем первую карточку активной
        updateMobileCard(0);
        
        console.log('✓ Mobile offers ready');
        
    } else {
        // === DESKTOP ВЕРСИЯ ===
        const desktopOfferItems = document.querySelectorAll('.offer-item');
        const iconEl = document.getElementById('offer-icon');
        const titleEl = document.getElementById('offer-title');
        const descriptionEl = document.getElementById('offer-description');
        
        console.log('Desktop - items:', desktopOfferItems.length);
        
        if (desktopOfferItems.length === 0 || !iconEl || !titleEl || !descriptionEl) {
            console.log('Desktop elements not found');
            return;
        }
        
        // Функция обновления ромба
        function updateRhombus(index) {
            const item = desktopOfferItems[index];
            const offerKey = item.dataset.offer;
            const offerData = offersData[offerKey];
            
            if (!offerData) return;
            
            // Убираем активный класс
            desktopOfferItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            // Анимация
            iconEl.style.opacity = '0';
            titleEl.style.opacity = '0';
            descriptionEl.style.opacity = '0';
            
            setTimeout(() => {
                iconEl.innerHTML = offerData.icon;
                titleEl.textContent = offerData.title;
                descriptionEl.textContent = offerData.description;
                
                iconEl.style.opacity = '1';
                titleEl.style.opacity = '1';
                descriptionEl.style.opacity = '1';
            }, 200);
        }
        
        // Добавляем обработчики
        desktopOfferItems.forEach((item, index) => {
            item.onclick = function() {
                console.log('Desktop item clicked:', index);
                updateRhombus(index);
            };
        });
        
        // Первая активная
        updateRhombus(0);
        
        console.log('✓ Desktop offers ready');
    }
}
    
// Инициализация слайдера предложений
function initOffersSlider() {
    console.log('=== initOffersSlider called ===');

    const track = document.querySelector('.offers-slider-track');
    const slider = document.querySelector('.offers-slider');
    const prevBtn = document.querySelector('.slider-nav-btn.prev');
    const nextBtn = document.querySelector('.slider-nav-btn.next');
    const dotsContainer = document.getElementById('offers-slider-dots');
    const cards = document.querySelectorAll('.offer-card-slider');
    
    console.log('track:', !!track, 'cards.length:', cards.length);
    
    if (!track || cards.length === 0) {
        console.log('Offers slider elements not found');
        return;
    }
    
    // Генерируем точки динамически
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });
    }
    const dots = document.querySelectorAll('.slider-dot');
    
    console.log('Offers slider initialized:', cards.length, 'cards');
    
    let currentIndex = 0;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let autoPlayInterval;
    
    function getCardsPerView() {
        if (window.innerWidth > 1024) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }
    
    function getCardWidth() {
        return cards[0].offsetWidth + 20; // 20px gap
    }
    
    function getMaxIndex() {
        return Math.max(0, cards.length - getCardsPerView());
    }
    
    function updateSlider(animate = true) {
        const cardWidth = getCardWidth();
        const offset = -(currentIndex * cardWidth);
        track.style.transition = animate ? 'transform 0.3s ease' : 'none';
        track.style.transform = `translateX(${offset}px)`;
        
        // Обновляем точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        prevTranslate = offset;
    }
    
    // Drag события для мыши и тача
    function onTouchStart(event) {
        isDragging = true;
        startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
        track.style.transition = 'none';
        
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    function onTouchMove(event) {
        if (!isDragging) return;
        
        const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        const diff = currentX - startX;
        const cardWidth = getCardWidth();
        currentTranslate = prevTranslate + diff;
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function onTouchEnd() {
        isDragging = false;
        
        const movedBy = currentTranslate - prevTranslate;
        const cardWidth = getCardWidth();
        
        if (movedBy < -100 && currentIndex < getMaxIndex()) {
            currentIndex += 1;
        } else if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }
        
        currentIndex = Math.max(0, Math.min(currentIndex, getMaxIndex()));
        updateSlider(true);
        
        // Запускаем автоплей снова
        startAutoPlay();
    }
    
    // Мышь события
    track.addEventListener('mousedown', onTouchStart);
    document.addEventListener('mousemove', onTouchMove);
    document.addEventListener('mouseup', onTouchEnd);
    
    // Тач события
    track.addEventListener('touchstart', onTouchStart);
    track.addEventListener('touchmove', onTouchMove);
    track.addEventListener('touchend', onTouchEnd);
    
    // Точки
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider(true);
        });
    });
    
    // Автоплей
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (currentIndex < getMaxIndex()) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider(true);
        }, 5000);
    }
    
    // Пауза при наведении
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
    
    // Пересчёт при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            currentIndex = 0;
            updateSlider(false);
        }, 200);
    });
    
    // Инициализация
    updateSlider(false);
    startAutoPlay();
    
    console.log('✓ Offers slider ready with drag support');
}

// Обработчик формы контактов
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = form.querySelector('.btn-form');
        const originalText = btn.textContent;
        
        const data = {
            type: 'contact',
            name: form.querySelector('[name="name"]')?.value || '',
            phone: form.querySelector('[name="phone"]')?.value || '',
            email: '',
            company: '',
            service: '',
            message: form.querySelector('[name="message"]')?.value || ''
        };

        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                btn.textContent = 'Отправлено!';
                btn.style.background = '#48AB4D';
                form.reset();
            } else {
                btn.textContent = 'Ошибка';
                btn.style.background = '#DC3545';
            }
        } catch {
            btn.textContent = 'Ошибка сети';
            btn.style.background = '#DC3545';
        }
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

// Автоматическая инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initOffersSlider();
        initContactForm();
    });
} else {
    initOffersSlider();
    initContactForm();
}
    
