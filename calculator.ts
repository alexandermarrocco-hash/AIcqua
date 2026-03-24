import { WATER_CONSTANTS } from './water-constants';

/**
 * Calculates the total water footprint (milliliters) for cloud-based AI inference.
 * 
 * Formula: tokens * (energyPerToken) * (WUE + GridIntensity)
 * 
 * @param tokens Number of tokens processed.
 * @param provider Data center provider (e.g., 'GOOGLE_US', 'MICROSOFT_OPENAI_US').
 * @param gridIntensity Water intensity of the local grid in L/kWh. Defaults to Global Average.
 * @returns Total water footprint in milliliters (mL).
 */
export function calculateCloudWater(
    tokens: number,
    provider: keyof typeof WATER_CONSTANTS.WUE = 'GLOBAL_AVERAGE',
    gridIntensity: number = WATER_CONSTANTS.GRID_WATER_INTENSITY.GAS // Defaulting to a moderate grid
): number {
    const wue = WATER_CONSTANTS.WUE[provider];
    const energyPerToken = WATER_CONSTANTS.ENERGY_PER_1000_TOKENS / 1000;

    // Calculation in Liters: Token * Energy/Token * (WUE + GridIntensity)
    // Convert Liters to Milliliters (L * 1000)
    const totalLiters = tokens * energyPerToken * (wue + gridIntensity);
    return totalLiters * 1000;
}

/**
 * Calculates the total water footprint (milliliters) for cloud-based AI image generation.
 */
export function calculateImageWater(
    count: number = 1,
    provider: keyof typeof WATER_CONSTANTS.WUE = 'GLOBAL_AVERAGE',
    gridIntensity: number = WATER_CONSTANTS.GRID_WATER_INTENSITY.GAS
): number {
    const wue = WATER_CONSTANTS.WUE[provider];
    const energyPerImage = WATER_CONSTANTS.ENERGY_PER_IMAGE;

    const totalLiters = count * energyPerImage * (wue + gridIntensity);
    return totalLiters * 1000;
}

/**
 * Calculates the total water footprint (milliliters) for local hardware usage (e.g., GPU).
 * 
 * Formula: (Watts * Seconds / 3.6e6) * GridIntensity
 * 
 * @param watts Power consumption of the hardware in Watts.
 * @param durationSeconds Duration of the operation in seconds.
 * @param gridIntensity Water intensity of the local grid (L/kWh).
 * @returns Total water footprint in milliliters (mL).
 */
export function calculateLocalWater(
    watts: number,
    durationSeconds: number,
    gridIntensity: number = WATER_CONSTANTS.GRID_WATER_INTENSITY.GAS
): number {
    // Energy in kWh = (Watts * Seconds) / (1000 * 3600)
    const energyKWh = (watts * durationSeconds) / 3.6e6;

    // Total Liters = Energy * GridIntensity
    const totalLiters = energyKWh * gridIntensity;

    // Convert Liters to Milliliters
    return totalLiters * 1000;
}
