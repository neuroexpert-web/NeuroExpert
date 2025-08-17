import React from 'react';
import faqData from '../../data/faq';

const FAQ: React.FC = () => {
    return (
        <div className="faq-section">
            <h2>Часто задаваемые вопросы</h2>
            <ul>
                {faqData.map((faq, index) => (
                    <li key={index} className="faq-item">
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FAQ;