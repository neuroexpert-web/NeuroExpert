import React from 'react';

interface ServicePackageCardProps {
  title: string;
  description: string;
  benefits: string[];
  steps: string[];
  exampleResult: string;
  onRequestConsultation: () => void;
}

const ServicePackageCard: React.FC<ServicePackageCardProps> = ({
  title,
  description,
  benefits,
  steps,
  exampleResult,
  onRequestConsultation,
}) => {
  return (
    <div className="service-package-card">
      <h3 className="service-package-title">{title}</h3>
      <p className="service-package-description">{description}</p>
      <h4>Benefits:</h4>
      <ul className="service-package-benefits">
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
      <h4>Steps:</h4>
      <ol className="service-package-steps">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <h4>Example Result:</h4>
      <p className="service-package-example-result">{exampleResult}</p>
      <button className="request-consultation-button" onClick={onRequestConsultation}>
        Запросить консультацию
      </button>
    </div>
  );
};

export default ServicePackageCard;