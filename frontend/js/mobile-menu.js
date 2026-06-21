    // Мобильное меню и модальное окно телефона
document.addEventListener('DOMContentLoaded', function() {
    // === МЕНЮ ===
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            if (isActive) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
        
        // Закрываем меню при клике на ссылку
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(event) {
            if (mainNav.classList.contains('active')) {
                if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    }
        
    // === МОДАЛЬНОЕ ОКНО ТЕЛЕФОНА ===
    const phoneBtn = document.getElementById('mobile-phone-btn');
    const phoneModalOverlay = document.getElementById('phone-modal-overlay');
    const phoneModalClose = document.getElementById('phone-modal-close');
    const phoneOptions = document.querySelectorAll('.phone-option');
    
    // Открытие модального окна
    if (phoneBtn && phoneModalOverlay) {
        phoneBtn.addEventListener('click', function(e) {
            e.preventDefault();
            phoneModalOverlay.classList.add('active');
            document.body.classList.add('menu-open');
        });
    }
    
    // Закрытие модального окна по кнопке
    if (phoneModalClose && phoneModalOverlay) {
        phoneModalClose.addEventListener('click', function() {
            phoneModalOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Закрытие при клике на затемнение
    if (phoneModalOverlay) {
        phoneModalOverlay.addEventListener('click', function(e) {
            if (e.target === phoneModalOverlay) {
                phoneModalOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Закрытие при выборе номера (после небольшого задержки для перехода)
    phoneOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            // Не предотвращаем переход по ссылке, просто закрываем окно
            setTimeout(function() {
                phoneModalOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }, 300);
        });
    });
    
    // Закрытие модального окна при изменении размера экрана
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (mainNav) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
            if (phoneModalOverlay) {
                phoneModalOverlay.classList.remove('active');
            }
            document.body.classList.remove('menu-open');
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mainNav && mainNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            if (phoneModalOverlay && phoneModalOverlay.classList.contains('active')) {
                phoneModalOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
});
