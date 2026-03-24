/**
 * AI Water Footprint Constants
 * 
 * Sources:
 * - "Making AI Less 'Thirsty': Uncovering and Addressing the Secret Water Footprint of AI Models" 
 *   (Pengfei Li, Jianyi Yang, Shaolei Ren et al., 2023)
 * - "Water Usage Effectiveness (WUE): A Green Grid Data Center Sustainability Metric"
 * - U.S. Department of Energy (DOE) - Grid Water Intensity estimates.
 */

export const WATER_CONSTANTS = {
  /**
   * WUE (Water Usage Effectiveness) in L/kWh.
   * Measures how much water is used at the data center site to cool the servers.
   */
  WUE: {
    GLOBAL_AVERAGE: 1.8,
    MICROSOFT_OPENAI_US: 0.6, // Based on newer efficiency targets and reporting
    GOOGLE_US: 0.4,           // Based on Google's published 2023 sustainability reports
  },

  /**
   * Energy consumption per image generation.
   * Estimated for high-end models like DALL-E 3 or Midjourney.
   * Unit: kWh per image.
   */
  ENERGY_PER_IMAGE: 0.012,

  /**
   * Energy consumption per token for Large Language Models.
   * Estimated for models like GPT-4 class.
   * Unit: kWh per 1000 tokens.
   */
  ENERGY_PER_1000_TOKENS: 0.004,

  /**
   * Grid Water Intensity (GWI) in L/kWh.
   * Measures the water consumed during electricity generation (off-site).
   * Total Water Footprint = WUE (site) + GWI (off-site).
   */
  GRID_WATER_INTENSITY: {
    COAL: 2.0,        // High consumption due to steam cycle evaporative cooling
    NUCLEAR: 2.5,     // High consumption due to safety and cooling requirements
    HYDROELECTRIC: 4.0, // High consumption due to evaporation from reservoirs
    SOLAR: 0.1,       // Low consumption primarily for panel cleaning
    WIND: 0.01,       // Negligible water consumption
    GAS: 0.7,         // Combined cycle gas turbines are more efficient
  },
};
