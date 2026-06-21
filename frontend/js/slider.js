/**
 * Hero Slider - Простой слайдер с эффектом затухания
 * Автоматическое перелистывание, плавные переходы
 */

class HeroSlider {
    constructor() {
        // Находим элементы слайдера
        this.slider = document.querySelector('.hero-slider');
        if (!this.slider) {
            console.warn('Слайдер не найден');
            return;
        }
        
        // Основные элементы
        this.slides = this.slider.querySelectorAll('.slider-slide');
        this.dots = this.slider.querySelectorAll('.dot');
        this.prevBtn = this.slider.querySelector('.slider-nav.prev');
        this.nextBtn = this.slider.querySelector('.slider-nav.next');
        
        // Проверка наличия слайдов
        if (!this.slides.length) {
            console.warn('Нет слайдов');
            return;
        }
        
        // Состояние слайдера
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayTimer = null;
        this.autoplayDelay = 2000; // 5 секунд
        this.isAnimating = false;
        
        // Запускаем слайдер
        this.init();
    }
    
    init() {
        console.log('Запуск слайдера...');
        console.log('Найдено слайдов:', this.totalSlides);
        console.log('Найдено точек:', this.dots.length);
        
        // Подготавливаем слайды
        this.prepareSlides();
        
        // Показываем первый слайд
        this.showSlide(this.currentIndex, false);
        
        // Запускаем автоплей
        this.startAutoplay();
        
        // Добавляем обработчики событий
        this.addEventListeners();
    }
    
    prepareSlides() {
        // Устанавливаем CSS для всех слайдов
        this.slides.forEach((slide, index) => {
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.transition = 'opacity 0.8s ease, visibility 0.8s ease';
            slide.style.zIndex = '1';
            slide.classList.remove('active-slide');
            
            // Добавляем data-атрибут для отладки
            slide.setAttribute('data-slide-index', index);
        });
        
        // Убеждаемся, что контейнер имеет относительное позиционирование
        this.slider.style.position = 'relative';
    }
    
    showSlide(index, animate = true) {
        // Защита от множественных вызовов
        if (this.isAnimating) return;
        
        // Проверка границ
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        console.log('Показываем слайд:', index);
        
        this.isAnimating = true;
        
        // Скрываем все слайды
        this.slides.forEach((slide) => {
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.zIndex = '1';
            slide.classList.remove('active-slide');
        });
        
        // Показываем выбранный слайд
        const currentSlide = this.slides[index];
        currentSlide.style.visibility = 'visible';
        currentSlide.style.zIndex = '2';
        currentSlide.classList.add('active-slide');
        
        // Небольшая задержка для запуска анимации
        setTimeout(() => {
            currentSlide.style.opacity = '1';
        }, animate ? 20 : 0);
        
        // Обновляем индекс
        this.currentIndex = index;
        
        // Обновляем точки - ВАЖНО!
        this.updateDots();
        
        // Сбрасываем флаг анимации
        setTimeout(() => {
            this.isAnimating = false;
        }, animate ? 800 : 0);
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.showSlide(nextIndex);
        this.resetAutoplay();
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
        this.resetAutoplay();
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        if (index >= 0 && index < this.totalSlides) {
            console.log('Переход к слайду по точке:', index);
            this.showSlide(index);
            this.resetAutoplay();
        }
    }
    
    updateDots() {
        console.log('Обновление точек. Текущий индекс:', this.currentIndex);
        
        this.dots.forEach((dot, index) => {
            // Сначала удаляем все классы
            dot.classList.remove('active');
            
            // Добавляем класс active только для текущего индекса
            if (index === this.currentIndex) {
                dot.classList.add('active');
                console.log('Точка', index, 'активна');
            }
            
            // Добавляем data-атрибут для отладки
            dot.setAttribute('data-dot-index', index);
        });
    }
    
    startAutoplay() {
        this.stopAutoplay();
        
        this.autoplayTimer = setInterval(() => {
            if (!this.isAnimating) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
        
        console.log('Автоплей запущен');
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
            console.log('Автоплей остановлен');
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    addEventListeners() {
        console.log('Добавление обработчиков событий');
        
        // Кнопки навигации
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Клик по кнопке "Предыдущий"');
                this.prevSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Клик по кнопке "Следующий"');
                this.nextSlide();
            });
        }
        
        // Точки-индикаторы
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Клик по точке', index);
                this.goToSlide(index);
            });
            
            // Добавляем стиль cursor: pointer для наглядности
            dot.style.cursor = 'pointer';
        });
        
        // Остановка автоплея при наведении мыши
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });
        
        this.slider.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
        
        // Клавиатурная навигация
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
        
        // Делаем слайдер фокусируемым для клавиатуры
        this.slider.setAttribute('tabindex', '0');
        
        console.log('Обработчики событий добавлены');
    }
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация слайдера...');
    
    // Проверяем наличие слайдера
    const sliderElement = document.querySelector('.hero-slider');
    if (sliderElement) {
        console.log('Слайдер найден, создаем экземпляр');
        new HeroSlider();
    } else {
        console.error('Слайдер не найден в DOM!');
    }
});