// This file defines types related to business segments.

export type BusinessSegment = 'small' | 'medium' | 'large';

export interface ServicePackage {
    title: string;
    description: string;
    steps: string[];
    benefits: string[];
    exampleResult: string;
    actionLabel: string;
}

export interface BusinessSegmentData {
    segment: BusinessSegment;
    packages: ServicePackage[];
}