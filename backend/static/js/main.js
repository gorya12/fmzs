// Основной JavaScript файл для динамической загрузки контента
const API_BASE_URL = 'http://localhost:5000';

// Функция для загрузки новостей
async function loadNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки новостей');
        }
        const news = await response.json();
        
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.innerHTML = '';
            
            if (news.length === 0) {
                newsContainer.innerHTML = '<p class="no-news">Новостей пока нет</p>';
            } else {
                news.forEach(item => {
                    const newsCard = createNewsCard(item);
                    newsContainer.appendChild(newsCard);
                });
            }
        }
    } catch (error) {
        console.error('Error loading news:', error);
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.innerHTML = '<p class="error-message">Ошибка загрузки новостей</p>';
        }
    }
}

// Функция для создания карточки новости
function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const date = new Date(news.date);
    const formattedDate = date.toLocaleDateString('ru-RU');
    
    card.innerHTML = `
        <div class="news-content">
            <div class="news-date">${formattedDate}</div>
            <h3 class="news-title">${news.title}</h3>
            <p class="news-excerpt">${news.content.substring(0, 100)}${news.content.length > 100 ? '...' : ''}</p>
            <a href="#" class="read-more" onclick="viewNews(${news.id}); return false;">Читать далее</a>
        </div>
    `;
    
    return card;
}

// Функция для просмотра детальной новости
async function viewNews(newsId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/news/${newsId}`);
        if (!response.ok) {
            throw new Error('Новость не найдена');
        }
        const news = await response.json();
        
        // Создаем модальное окно для показа новости
        showNewsModal(news);
    } catch (error) {
        console.error('Error loading news detail:', error);
        alert('Ошибка загрузки новости');
    }
}

// Функция для показа модального окна с новостью
function showNewsModal(news) {
    // Удаляем предыдущее модальное окно если есть
    const existingModal = document.querySelector('.news-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'news-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${news.title}</h2>
            <div class="modal-date">${new Date(news.date).toLocaleDateString('ru-RU')}</div>
            <div class="modal-body">
                <p>${news.content}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие модального окна
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.remove();
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// Функция для отправки контактной формы
async function submitContactForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Ошибка отправки');
        }
        
        const result = await response.json();
        alert(result.message);
        
        // Очищаем форму
        const form = document.getElementById('contact-form');
        if (form) {
            form.reset();
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Произошла ошибка при отправке формы');
    }
}

// Добавляем стили для модального окна
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .news-modal {
            display: flex;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .close-modal {
            position: absolute;
            right: 20px;
            top: 10px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #666;
        }
        
        .close-modal:hover {
            color: #333;
        }
        
        .modal-date {
            color: #666;
            margin: 10px 0;
            font-size: 14px;
        }
        
        .modal-body {
            margin-top: 20px;
            line-height: 1.8;
        }
        
        .error-message {
            text-align: center;
            color: #dc3545;
            padding: 20px;
        }
        
        .no-news {
            text-align: center;
            color: #666;
            padding: 20px;
        }
        
        .menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 10px;
        }
        
        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }
            
            .main-nav {
                display: none;
            }
            
            .main-nav.active {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем стили
    addModalStyles();
    
    // Загрузка новостей
    loadNews();
    
    // Поиск
    const searchForm = document.querySelector('.header-search');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                alert(`Поиск: ${searchQuery}`);
                // Здесь можно добавить логику поиска
            }
        });
    }
    
    // Мобильное меню
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    
    const header = document.querySelector('.header-top');
    const nav = document.querySelector('.main-nav');
    
    if (header && nav) {
        header.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Контактная форма
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                name: this.querySelector('[name="name"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                phone: this.querySelector('[name="phone"]')?.value || '',
                message: this.querySelector('[name="message"]')?.value || ''
            };
            submitContactForm(formData);
        });
    }
});

// Анимации при скролле
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.advantage-item, .project-card, .offer-card, .news-card');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (position.top < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
    });
});

// Инициализация анимаций
window.dispatchEvent(new Event('scroll'));

// Добавление анимаций при скролле
function initScrollAnimations() {
    const elements = document.querySelectorAll('.offer-card, .advantage-item, .project-card, .news-card, .contact-block');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Мобильное меню с улучшенной навигацией
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (window.innerWidth <= 768) {
        if (!menuToggle) {
            const toggle = document.createElement('button');
            toggle.className = 'menu-toggle';
            toggle.innerHTML = '☰ Меню';
            document.querySelector('.header-top').appendChild(toggle);
        }
        
        const toggle = document.querySelector('.menu-toggle');
        
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            this.innerHTML = mainNav.classList.contains('active') ? '✕ Закрыть' : '☰ Меню';
        });
        
        // Обработка кликов на пункты меню с подменю
        navItems.forEach(item => {
            const link = item.querySelector('a');
            const dropdown = item.querySelector('.dropdown-menu');
            
            if (dropdown) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        item.classList.toggle('active');
                        
                        // Закрыть другие открытые меню
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                    }
                });
            }
        });
        
        // Закрытие меню при клике вне
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !toggle.contains(e.target)) {
                mainNav.classList.remove('active');
                toggle.innerHTML = '☰ Меню';
            }
        });
    }
}

// Параллакс эффект для hero секции
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
}

// Плавная прокрутка для якорей
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initSmoothScroll();
    
    // Добавление класса для анимации заголовков
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('fade-in');
    });
});

// Оптимизация для ресайза
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768) {
            const mainNav = document.querySelector('.main-nav');
            const menuToggle = document.querySelector('.menu-toggle');
            if (mainNav) mainNav.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '☰ Меню';
        }
    }, 250);
    
});
