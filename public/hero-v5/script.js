// Анимация заголовка "Нейронный импульс"
window.onload = function() {
    // Находим заголовок
    const mainHeader = document.getElementById('animated-main-header');
    if (!mainHeader) return;
    
    // Сохраняем текст и очищаем заголовок
    const text = mainHeader.textContent;
    mainHeader.textContent = '';
    
    // Разбиваем текст на буквы и оборачиваем каждую в span
    const chars = text.split('').map((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        span.style.position = 'relative';
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        
        // Создаем внутренний span для текста
        const innerSpan = document.createElement('span');
        innerSpan.textContent = char;
        innerSpan.style.position = 'relative';
        innerSpan.style.zIndex = '2';
        innerSpan.style.display = 'inline-block';
        innerSpan.style.background = 'linear-gradient(90deg, #A855F7 0%, #6366F1 100%)';
        innerSpan.style.webkitBackgroundClip = 'text';
        innerSpan.style.webkitTextFillColor = 'transparent';
        innerSpan.style.backgroundClip = 'text';
        
        span.textContent = '';
        span.appendChild(innerSpan);
        
        return span;
    });
    
    // Добавляем буквы в заголовок
    chars.forEach(span => mainHeader.appendChild(span));
    
    // Функция для анимации импульса
    function animateImpulse(charElement, delay) {
        setTimeout(() => {
            // Добавляем класс для появления буквы
            charElement.classList.add('visible');
            
            // Создаем элемент импульса
            const pulse = document.createElement('div');
            pulse.style.position = 'absolute';
            pulse.style.top = '50%';
            pulse.style.left = '-10px';
            pulse.style.width = '6px';
            pulse.style.height = '6px';
            pulse.style.background = 'white';
            pulse.style.borderRadius = '50%';
            pulse.style.boxShadow = '0 0 15px white, 0 0 30px #A855F7, 0 0 45px #6366F1';
            pulse.style.transform = 'translateY(-50%)';
            pulse.style.zIndex = '3';
            pulse.style.pointerEvents = 'none';
            
            charElement.appendChild(pulse);
            
            // Анимируем движение импульса
            setTimeout(() => {
                pulse.style.transition = 'left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease-out';
                pulse.style.left = '100%';
                
                // Анимируем заполнение градиентом
                const beforeStyle = document.createElement('style');
                beforeStyle.textContent = `
                    .char-${delay}::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, #A855F7 0%, #6366F1 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                        transition: clip-path 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                        z-index: 1;
                    }
                `;
                document.head.appendChild(beforeStyle);
                charElement.classList.add(`char-${delay}`);
                
                // Удаляем импульс после анимации
                setTimeout(() => {
                    pulse.style.opacity = '0';
                    setTimeout(() => pulse.remove(), 400);
                }, 300);
            }, 50);
        }, delay);
    }
    
    // Запускаем анимацию для каждой буквы с задержкой
    chars.forEach((char, index) => {
        animateImpulse(char, index * 70); // Задержка 70ms между буквами
    });
    
    // Анимация остальных элементов
    setTimeout(() => {
        // Анимируем предзаголовок
        const preHeader = document.querySelector('.pre-header');
        if (preHeader) {
            preHeader.style.opacity = '0';
            preHeader.style.transform = 'translateY(-20px)';
            preHeader.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                preHeader.style.opacity = '1';
                preHeader.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Анимируем подзаголовок
        const subHeader = document.querySelector('.sub-header');
        if (subHeader) {
            subHeader.style.opacity = '0';
            subHeader.style.transform = 'translateY(20px)';
            subHeader.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                subHeader.style.opacity = '1';
                subHeader.style.transform = 'translateY(0)';
            }, 800);
        }
        
        // Анимируем подпись к подзаголовку
        const subHeaderCaption = document.querySelector('.sub-header-caption');
        if (subHeaderCaption) {
            subHeaderCaption.style.opacity = '0';
            subHeaderCaption.style.transform = 'translateY(20px)';
            subHeaderCaption.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                subHeaderCaption.style.opacity = '1';
                subHeaderCaption.style.transform = 'translateY(0)';
            }, 1000);
        }
        
        // Анимируем описание
        const description = document.querySelector('.description');
        if (description) {
            description.style.opacity = '0';
            description.style.transform = 'translateY(20px)';
            description.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                description.style.opacity = '1';
                description.style.transform = 'translateY(0)';
            }, 1200);
        }
        
        // Анимируем кнопку
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.style.opacity = '0';
            ctaButton.style.transform = 'translateY(20px)';
            ctaButton.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                ctaButton.style.opacity = '1';
                ctaButton.style.transform = 'translateY(0)';
            }, 1400);
        }
    }, 100);
};