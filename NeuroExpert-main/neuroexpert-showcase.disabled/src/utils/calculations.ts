export function calculateROI(investment: number, returnAmount: number): number {
    if (investment <= 0) {
        throw new Error("Investment must be greater than zero.");
    }
    return ((returnAmount - investment) / investment) * 100;
}

export function calculateTotalCost(services: Array<{ cost: number }>): number {
    return services.reduce((total, service) => total + service.cost, 0);
}

export function calculatePotentialSavings(currentCost: number, newCost: number): number {
    return currentCost - newCost;
}