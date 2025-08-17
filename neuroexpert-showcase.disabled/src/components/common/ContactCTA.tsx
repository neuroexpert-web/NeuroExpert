import React from 'react';

const ContactCTA: React.FC = () => {
    return (
        <div className="contact-cta">
            <h2>Готовы начать?</h2>
            <p>Свяжитесь с нами, чтобы получить консультацию и узнать, как наши услуги могут помочь вашему бизнесу.</p>
            <a href="/contact" className="btn btn-primary">Запросить консультацию</a>
        </div>
    );
};

export default ContactCTA;