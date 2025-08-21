export const metadata = {
  title: 'Пользовательское соглашение - NeuroExpert',
  description: 'Условия использования платформы NeuroExpert',
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-noir-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Пользовательское соглашение</h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-sm text-gray-400">Дата обновления: 18 января 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Общие положения</h2>
            <p>
              Настоящее Пользовательское соглашение (далее – Соглашение) регулирует отношения между 
              ООО "NeuroExpert" (далее – Исполнитель) и физическим или юридическим лицом 
              (далее – Пользователь), использующим платформу NeuroExpert.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Предмет соглашения</h2>
            <p>
              Исполнитель предоставляет Пользователю доступ к AI-платформе для цифровизации и 
              автоматизации бизнес-процессов на условиях настоящего Соглашения.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Права и обязанности сторон</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-white mt-4">3.1. Исполнитель обязуется:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Предоставить доступ к функционалу платформы</li>
              <li>Обеспечить техническую поддержку</li>
              <li>Соблюдать конфиденциальность данных Пользователя</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-white mt-4">3.2. Пользователь обязуется:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Использовать платформу в соответствии с законодательством РФ</li>
              <li>Не передавать доступ третьим лицам</li>
              <li>Своевременно оплачивать услуги</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Стоимость и порядок оплаты</h2>
            <p>
              Стоимость услуг определяется согласно тарифным планам, размещенным на сайте. 
              Оплата производится на условиях 100% предоплаты.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Ответственность сторон</h2>
            <p>
              Стороны несут ответственность за неисполнение или ненадлежащее исполнение своих 
              обязательств в соответствии с законодательством РФ.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Срок действия соглашения</h2>
            <p>
              Настоящее Соглашение вступает в силу с момента акцепта Пользователем и действует 
              до полного исполнения Сторонами своих обязательств.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Заключительные положения</h2>
            <p>
              Все споры решаются путем переговоров. При невозможности достижения соглашения, 
              споры подлежат рассмотрению в суде по месту нахождения Исполнителя.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Реквизиты</h2>
            <p className="text-sm">
              ООО "NeuroExpert"<br/>
              ИНН: [Укажите ИНН]<br/>
              ОГРН: [Укажите ОГРН]<br/>
              Юридический адрес: [Укажите адрес]<br/>
              Email: legal@neuroexpert.ai
            </p>
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