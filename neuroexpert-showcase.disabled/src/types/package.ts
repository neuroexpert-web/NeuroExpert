export interface ServicePackage {
    id: string;
    title: string;
    description: string;
    steps: string[];
    benefits: string[];
    exampleResult: string;
    actionLabel: string;
}

export interface BusinessSegment {
    segment: 'small' | 'medium' | 'large';
    packages: ServicePackage[];
}