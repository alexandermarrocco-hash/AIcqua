import { calculateCloudWater, calculateLocalWater } from './calculator';
import { WATER_CONSTANTS } from './water-constants';

console.log("--- AI Water Footprint Verification ---");

// Test 1: Cloud Calculation
// 10,000 tokens, Google US (0.4 WUE), Solar Grid (0.1 L/kWh)
const tokens = 10000;
const cloudWater = calculateCloudWater(tokens, 'GOOGLE_US', WATER_CONSTANTS.GRID_WATER_INTENSITY.SOLAR);
console.log(`Cloud Water (10k tokens, Google US, Solar): ${cloudWater.toFixed(2)} mL`);
// Expected: 10000 * (0.004/1000) * (0.4 + 0.1) * 1000 = 10000 * 0.000004 * 0.5 * 1000 = 20 mL

// Test 2: Local Calculation
// GPU consuming 300W for 1 hour (3600s), Gas Grid (0.7 L/kWh)
const watts = 300;
const duration = 3600;
const localWater = calculateLocalWater(watts, duration, WATER_CONSTANTS.GRID_WATER_INTENSITY.GAS);
console.log(`Local Water (300W, 1 hour, Gas Grid): ${localWater.toFixed(2)} mL`);
// Expected: (300 * 3600 / 3.6e6) * 0.7 * 1000 = 0.3 kWh * 0.7 * 1000 = 210 mL

console.log("-----------------------------------------");
