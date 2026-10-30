export interface SustainabilitySummary {
  totalRequests: number;
  totalTokens: number;
  totalEnergyKWh: number;
  totalCarbonKg: number;
  totalWaterLiters: number;
  totalCostUSD: number;
  localVsCloudRatio: {
    localPercent: number;
    cloudPercent: number;
  };
  savingsFromLocal: {
    savedCostUSD: number;
    savedWaterLiters: number;
    savedCarbonKg: number;
  };
}

export const WATER_FOOTPRINT_METHODOLOGY = {
  cloudWaterPerKWhLiters: 4.0, // 1.8L on-site data center cooling tower evaporation + 2.2L power generation grid footprint
  localWaterPerKWhLiters: 2.2, // Grid thermoelectric generation only (zero on-site cooling tower evaporation)
  averageCarbonGridGramsPerKWh: 385, // Global weighted average grid carbon intensity (gCO2eq/kWh)
  confidence: 'ESTIMATED' as const,
  methodologyNotes: 'Calculated using peer-reviewed methodology based on Shaolei Ren et al. (2023) "Making AI Less Thirsty" and Lawrence Berkeley National Laboratory data center energy telemetry.',
};

export const DEMO_SUSTAINABILITY_DATA: SustainabilitySummary = {
  totalRequests: 1428,
  totalTokens: 2_840_000,
  totalEnergyKWh: 4.82,
  totalCarbonKg: 1.85,
  totalWaterLiters: 12.4,
  totalCostUSD: 14.80,
  localVsCloudRatio: {
    localPercent: 74,
    cloudPercent: 26,
  },
  savingsFromLocal: {
    savedCostUSD: 38.60,
    savedWaterLiters: 19.8,
    savedCarbonKg: 3.42,
  },
};
