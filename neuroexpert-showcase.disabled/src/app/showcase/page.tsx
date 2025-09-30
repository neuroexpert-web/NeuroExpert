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
          {smallBusinessPackages.map((package) => (
            <ServicePackageCard key={package.id} package={package} />
          ))}
        </div>
        <h2>Пакеты для Среднего Бизнеса</h2>
        <div className="package-list">
          {mediumBusinessPackages.map((package) => (
            <ServicePackageCard key={package.id} package={package} />
          ))}
        </div>
        <h2>Пакеты для Крупного Бизнеса</h2>
        <div className="package-list">
          {largeBusinessPackages.map((package) => (
            <ServicePackageCard key={package.id} package={package} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage;