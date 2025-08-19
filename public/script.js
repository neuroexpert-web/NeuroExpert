window.onload = function () {
  const header = document.getElementById('animated-main-header');
  if (!header) return;

  const originalText = 'NeuroExpert';
  header.textContent = '';

  const chars = [];
  for (const ch of originalText) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    header.appendChild(span);
    chars.push(span);
  }

  // Sequential appearance
  const delayBetween = 70; // ms
  chars.forEach((span, i) => {
    setTimeout(() => {
      span.classList.add('visible');

      // After visible animation starts, trigger gradient fill and pulse
      setTimeout(() => {
        // Trigger gradient fill by expanding ::before clip-path
        span.style.setProperty('--fill', '1');
        // We use a tiny hack: toggle a data attribute to signal CSS animation
        span.dataset.fill = 'running';

        // Animate the glowing dot ::after along the x-axis
        // Since we cannot directly animate pseudo-element from JS,
        // we rely on CSS animation tied to data attribute
        span.dataset.pulse = 'start';
      }, 120);
    }, i * delayBetween);
  });
};

