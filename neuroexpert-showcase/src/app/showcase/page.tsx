import React from 'react';
import BusinessSegmentSelector from '../../components/showcase/BusinessSegmentSelector';
import ServicePackageCard from '../../components/showcase/ServicePackageCard';
import { smallBusinessPackages, mediumBusinessPackages, largeBusinessPackages } from '../../data/packages';

const ShowcasePage = () => {
  return (
    <div className="showcase-container">
      <h1 className="showcase-title">Наши Комплексные Услуги</h1>
      <BusinessSegmentSelector />
      <div className="service-packages">
        <h2>Пакеты для Малого Бизнеса</h2>
        <div className="package-list">
          {smallBusinessPackages.map((pkg, idx) => (
            <ServicePackageCard
              key={idx}
              title={pkg.title}
              description={pkg.description}
              benefits={Array.isArray(pkg.benefits) ? pkg.benefits : [pkg.benefits]}
              steps={pkg.steps}
              exampleResult={pkg.exampleResult}
              onRequestConsultation={() => {}}
            />
          ))}
        </div>
        <h2>Пакеты для Среднего Бизнеса</h2>
        <div className="package-list">
          {mediumBusinessPackages.map((pkg, idx) => (
            <ServicePackageCard
              key={idx}
              title={pkg.title}
              description={pkg.description}
              benefits={Array.isArray(pkg.benefits) ? pkg.benefits : [pkg.benefits]}
              steps={pkg.steps}
              exampleResult={pkg.exampleResult}
              onRequestConsultation={() => {}}
            />
          ))}
        </div>
        <h2>Пакеты для Крупного Бизнеса</h2>
        <div className="package-list">
          {largeBusinessPackages.map((pkg, idx) => (
            <ServicePackageCard
              key={idx}
              title={pkg.title}
              description={pkg.description}
              benefits={Array.isArray(pkg.benefits) ? pkg.benefits : [pkg.benefits]}
              steps={pkg.steps}
              exampleResult={pkg.exampleResult}
              onRequestConsultation={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage;