
import { render, screen, fireEvent } from '@testing-library/react';

export async function checkComponent(Component, name) {
  console.log(`Проверяю компонент ${name}...`);
  
  try {
    const { container } = render(<Component />);
    
    // Проверяем все кнопки
    const buttons = container.querySelectorAll('button');
    buttons.forEach((button, index) => {
      fireEvent.click(button);
      console.log(`  ✓ Кнопка ${index + 1} работает`);
    });
    
    // Проверяем все ссылки
    const links = container.querySelectorAll('a');
    links.forEach((link, index) => {
      if (link.href === '#' || !link.href) {
        console.log(`  ⚠️  Ссылка ${index + 1} пустая`);
      }
    });
    
    // Проверяем формы
    const forms = container.querySelectorAll('form');
    forms.forEach((form, index) => {
      fireEvent.submit(form);
      console.log(`  ✓ Форма ${index + 1} обрабатывается`);
    });
    
    return true;
  } catch (error) {
    console.error(`  ❌ Ошибка в компоненте ${name}:`, error.message);
    return false;
  }
}
