import React, { useState } from 'react';

const ConsultationForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ name, email, businessType, message });
    };

    return (
        <form onSubmit={handleSubmit} className="consultation-form">
            <h2>Запросить консультацию</h2>
            <div>
                <label htmlFor="name">Имя:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="businessType">Тип бизнеса:</label>
                <select
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                >
                    <option value="">Выберите тип бизнеса</option>
                    <option value="small">Малый бизнес</option>
                    <option value="medium">Средний бизнес</option>
                    <option value="large">Крупный бизнес</option>
                </select>
            </div>
            <div>
                <label htmlFor="message">Сообщение:</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Отправить запрос</button>
        </form>
    );
};

export default ConsultationForm;