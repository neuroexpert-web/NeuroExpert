import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ServicePackageCard from '../../../components/showcase/ServicePackageCard';
import { getPackagesBySegment, Package } from '../../../data/packages';

const SegmentPage = () => {
  const router = useRouter();
  const { segment } = router.query;
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    if (segment && typeof segment === 'string') {
      const fetchedPackages = getPackagesBySegment(segment);
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
        {packages.map((pkg) => (
          <ServicePackageCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </div>
  );
};

export default SegmentPage;