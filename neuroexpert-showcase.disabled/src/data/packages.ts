export interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  segment: string;
}

export const packages: Package[] = [
  {
    id: '1',
    name: 'Starter Package',
    description: 'Perfect for small businesses',
    price: '$99/month',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    segment: 'starter'
  },
  {
    id: '2',
    name: 'Professional Package',
    description: 'For growing companies',
    price: '$299/month',
    features: ['All Starter features', 'Feature 4', 'Feature 5'],
    segment: 'professional'
  },
  {
    id: '3',
    name: 'Enterprise Package',
    description: 'Complete solution for large organizations',
    price: 'Custom',
    features: ['All Professional features', 'Custom integrations', 'Dedicated support'],
    segment: 'enterprise'
  }
];

export function getPackagesBySegment(segment: string): Package[] {
  return packages.filter(pkg => pkg.segment === segment);
}