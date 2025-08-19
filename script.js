// Анимация "Нейронный импульс" для заголовка NeuroExpert
class NeuralImpulseAnimation {
    constructor() {
        this.headerElement = null;
        this.originalText = '';
        this.chars = [];
        this.animationDelay = 70; // мс между появлением букв
        this.impulseDelay = 200; // мс после появления буквы до импульса
        
        this.init();
    }
    
    init() {
        // Ждем полной загрузки страницы
        window.addEventListener('load', () => {
            this.setupHeaderAnimation();
        });
    }
    
    setupHeaderAnimation() {
        // Находим элемент h1 по ID
        this.headerElement = document.getElementById('animated-main-header');
        if (!this.headerElement) {
            console.error('Header element not found');
            return;
        }
        
        // Сохраняем оригинальный текст
        this.originalText = this.headerElement.textContent;
        
        // Очищаем содержимое
        this.headerElement.innerHTML = '';
        
        // Разбиваем текст на буквы и создаем span элементы
        this.createCharSpans();
        
        // Запускаем анимацию появления
        this.startAppearAnimation();
    }
    
    createCharSpans() {
        this.chars = [];
        
        for (let i = 0; i < this.originalText.length; i++) {
            const char = this.originalText[i];
            const span = document.createElement('span');
            
            span.className = 'char';
            span.textContent = char;
            
            // Добавляем пробел как неразрывный пробел для корректного отображения
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            }
            
            this.chars.push(span);
            this.headerElement.appendChild(span);
        }
    }
    
    startAppearAnimation() {
        this.chars.forEach((char, index) => {
            setTimeout(() => {
                this.animateCharAppear(char, index);
            }, index * this.animationDelay);
        });
    }
    
    animateCharAppear(char, index) {
        // Добавляем класс для анимации появления
        char.classList.add('visible');
        
        // Запускаем импульс с задержкой после появления
        setTimeout(() => {
            this.triggerImpulse(char, index);
        }, this.impulseDelay);
    }
    
    triggerImpulse(char, index) {
        // Пропускаем пробелы
        if (char.textContent.trim() === '') {
            return;
        }
        
        // Запускаем анимацию импульса (светящаяся точка)
        char.classList.add('pulse');
        
        // Небольшая задержка перед заливкой градиентом
        setTimeout(() => {
            char.classList.add('impulse');
        }, 100);
        
        // Очищаем классы анимации после завершения
        setTimeout(() => {
            char.classList.remove('pulse');
        }, 500);
    }
    
    // Метод для перезапуска анимации (опционально)
    restart() {
        this.chars.forEach(char => {
            char.classList.remove('visible', 'pulse', 'impulse');
        });
        
        setTimeout(() => {
            this.startAppearAnimation();
        }, 100);
    }
}

// Дополнительные интерактивные эффекты
class InteractiveEffects {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            this.setupButtonEffects();
            this.setupScrollEffects();
        });
    }
    
    setupButtonEffects() {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.createRippleEffect(e, ctaButton);
            });
        }
    }
    
    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupScrollEffects() {
        // Добавляем плавное появление контента при скролле
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Наблюдаем за элементами контента
        document.querySelectorAll('.hero-content > *').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }
}

// CSS для ripple эффекта
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Инициализация анимаций
const neuralAnimation = new NeuralImpulseAnimation();
const interactiveEffects = new InteractiveEffects();

// Опциональный перезапуск анимации при клике на заголовок
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const header = document.getElementById('animated-main-header');
        if (header) {
            header.addEventListener('click', () => {
                neuralAnimation.restart();
            });
            header.style.cursor = 'pointer';
            header.title = 'Кликните для перезапуска анимации';
        }
    }, 1000);
});