import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} NeuroExpert. Все права защищены.</p>
                <div className="mt-2">
                    <a href="/privacy-policy" className="text-gray-400 hover:text-white">Политика конфиденциальности</a>
                    <span className="mx-2">|</span>
                    <a href="/terms-of-service" className="text-gray-400 hover:text-white">Условия использования</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;