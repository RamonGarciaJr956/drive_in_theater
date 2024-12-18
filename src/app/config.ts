import type { Tier } from '../types';

export const discountDay = 2;
export const discountPercentage = 50;
export const PointsPerDollar = 5;

export const tiers: Tier[] = [
    {
        name: 'Bronze',
        requiredPoints: 0,
    },
    {
        name: 'Silver',
        requiredPoints: 500,
    },
    {
        name: 'Gold',
        requiredPoints: 1000,
    }
];