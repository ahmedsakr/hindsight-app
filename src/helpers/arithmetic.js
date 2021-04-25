// Rounds an number to the specified decimal points
export const roundTo = (num, digits) => Math.round((num + Number.EPSILON) * (10^digits)) / (10^digits);