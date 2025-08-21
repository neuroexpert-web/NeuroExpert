export const metadata = {
  title: 'Политика конфиденциальности - NeuroExpert',
  description: 'Политика конфиденциальности платформы NeuroExpert',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-noir-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-sm text-gray-400">Дата обновления: 18 января 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности персональных данных (далее – Политика конфиденциальности) 
              действует в отношении всей информации, которую ООО "NeuroExpert" может получить о Пользователе 
              во время использования сайта neuroexpert.ai.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Основные понятия</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Сайт</strong> – сайт, расположенный в сети Интернет по адресу neuroexpert.ai</li>
              <li><strong>Пользователь</strong> – физическое лицо, использующее Сайт</li>
              <li><strong>Персональные данные</strong> – любая информация, относящаяся к Пользователю</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Сбор информации</h2>
            <p>Мы можем собирать следующую информацию:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Имя и контактные данные</li>
              <li>Email адрес</li>
              <li>Номер телефона</li>
              <li>Название компании</li>
              <li>Техническая информация о посещениях</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Использование информации</h2>
            <p>Собранная информация используется для:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Предоставления услуг и поддержки</li>
              <li>Улучшения качества обслуживания</li>
              <li>Отправки информационных сообщений</li>
              <li>Проведения статистических исследований</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Защита данных</h2>
            <p>
              Мы принимаем необходимые организационные и технические меры для защиты персональной информации 
              от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, 
              распространения.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Файлы cookie</h2>
            <p>
              Сайт использует файлы cookie для улучшения пользовательского опыта. Продолжая использовать сайт, 
              вы соглашаетесь с использованием файлов cookie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Контакты</h2>
            <p>
              По всем вопросам, касающимся настоящей Политики конфиденциальности, вы можете связаться с нами:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Email: privacy@neuroexpert.ai</li>
              <li>Форма обратной связи на сайте</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <a href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  )
}