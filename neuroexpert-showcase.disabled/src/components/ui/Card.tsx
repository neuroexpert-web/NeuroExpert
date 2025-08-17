import React from 'react';

interface CardProps {
  title: string;
  description: string;
  benefits: string[];
  onAction: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, benefits, onAction }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <ul className="list-disc list-inside mb-4">
        {benefits.map((benefit, index) => (
          <li key={index} className="text-gray-600">{benefit}</li>
        ))}
      </ul>
      <button 
        onClick={onAction} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Запросить консультацию
      </button>
    </div>
  );
};

export default Card;