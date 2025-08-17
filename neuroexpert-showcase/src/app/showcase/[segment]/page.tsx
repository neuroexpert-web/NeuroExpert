import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ServicePackageCard from '../../../components/showcase/ServicePackageCard';
import { getPackagesBySegment } from '../../../data/packages';

interface Pkg {
  title: string;
  description: string;
  benefits: string[] | string;
  steps: string[];
  exampleResult: string;
}

const SegmentPage = () => {
  const router = useRouter();
  const { segment } = router.query;
  const [packages, setPackages] = useState<Pkg[]>([]);

  useEffect(() => {
    if (segment) {
      const fetchedPackages = getPackagesBySegment(segment) as Pkg[];
      setPackages(fetchedPackages);
    }
  }, [segment]);

  if (!packages.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{segment} Business Packages</h1>
      <div>
        {packages.map((pkg, idx) => (
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
  );
};

export default SegmentPage;