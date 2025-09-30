document.addEventListener('DOMContentLoaded', () => {
    // Инициализация фона Vanta.js
    VANTA.NET({
        el: "#vanta-background",
        mouseControls: true,
        touchControls: true,
        gyrocontrols: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x6366f1, // Синий цвет из градиента
        backgroundColor: 0x0a051a, // Цвет фона #0A051A
        points: 10.00,
        maxDistance: 25.00,
        spacing: 18.00
    });

    // Анимация заголовка "Нейронный импульс"
    const header = document.getElementById('animated-main-header');
    const text = header.textContent;
    header.innerHTML = ''; // Очищаем заголовок

    // Оборачиваем каждую букву в span
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        header.appendChild(span);
    });

    // Запуск анимации
    const chars = document.querySelectorAll('.char');
    chars.forEach((char, index) => {
        setTimeout(() => {
            char.classList.add('visible');
        }, index * 70); // Задержка появления для каждой буквы
    });
});