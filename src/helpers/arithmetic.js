// Rounds an number to the specified decimal points
export const roundTo = (num, decimals) => +(Math.round(num + `e+${decimals}`)  + `e-${decimals}`);