'use client';

import React from 'react';
import { 
  Droplet, 
  Zap, 
  DollarSign, 
  Leaf, 
  Info, 
  Layers, 
  ArrowUpRight, 
  TrendingDown, 
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Cloud
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { DEMO_SUSTAINABILITY_DATA, WATER_FOOTPRINT_METHODOLOGY } from '@/lib/sustainability';

export const AquaMetrics: React.FC = () => {
  const data = DEMO_SUSTAINABILITY_DATA;

  // Comparison over 7 simulated days (Local vs Cloud water & energy)
  const timelineData = [
    { day: 'Mon', localEnergyKWh: 0.52, cloudEnergyKWh: 0.28, waterSavedL: 2.1 },
    { day: 'Tue', localEnergyKWh: 0.68, cloudEnergyKWh: 0.22, waterSavedL: 2.8 },
    { day: 'Wed', localEnergyKWh: 0.74, cloudEnergyKWh: 0.35, waterSavedL: 3.4 },
    { day: 'Thu', localEnergyKWh: 0.82, cloudEnergyKWh: 0.18, waterSavedL: 3.9 },
    { day: 'Fri', localEnergyKWh: 0.91, cloudEnergyKWh: 0.40, waterSavedL: 4.2 },
    { day: 'Sat', localEnergyKWh: 0.55, cloudEnergyKWh: 0.12, waterSavedL: 2.4 },
    { day: 'Sun', localEnergyKWh: 0.60, cloudEnergyKWh: 0.15, waterSavedL: 2.7 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
          <Droplet size={13} className="text-cyan-600" />
          <span>Green AI & Environmental Telemetry</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
            Aqua Metrics
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
              SIMULATED DEMO DATA
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Tracking the hidden water, energy, and carbon footprint of artificial intelligence workloads. Local models bypass hyperscale evaporative cooling towers completely.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Water Footprint Saved */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#717784]">Estimated Water Footprint</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Droplet size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111318]">
              {data.totalWaterLiters} L
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingDown size={14} /> -{data.savingsFromLocal.savedWaterLiters} L
            </span>
          </div>
          <p className="text-[11px] text-[#717784]">
            Saved by routing 74% of queries locally [ESTIMATED]
          </p>
        </div>

        {/* Energy Consumption */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#717784]">Compute Electricity</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111318]">
              {data.totalEnergyKWh} kWh
            </span>
            <span className="text-xs text-[#717784]">Total</span>
          </div>
          <p className="text-[11px] text-[#717784]">
            ~3.37 Wh per 1k processed tokens
          </p>
        </div>

        {/* Carbon Emissions */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#717784]">Carbon Intensity</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111318]">
              {data.totalCarbonKg} kg
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              -{data.savingsFromLocal.savedCarbonKg} kg saved
            </span>
          </div>
          <p className="text-[11px] text-[#717784]">
            Based on 385 gCO2eq/kWh grid intensity
          </p>
        </div>

        {/* Inference Expenditure Saved */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#717784]">Cloud API Expenditure</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-800">
              ${data.totalCostUSD}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              +${data.savingsFromLocal.savedCostUSD} saved
            </span>
          </div>
          <p className="text-[11px] text-[#717784]">
            Zero API fees for local Ollama runtimes
          </p>
        </div>
      </div>

      {/* Water & Energy Savings Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#111318]">
              Weekly Water Conservation Trend (Liters Saved)
            </h2>
            <p className="text-xs text-[#717784]">
              Local inference eliminates on-site data center cooling tower evaporation
            </p>
          </div>
          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200">
            [ESTIMATED WUE]
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="waterSavedL" 
                name="Water Saved (Liters)" 
                stroke="#0D9488" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#waterGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology and Scientific Basis (Mandatory requirement per Section 12) */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Methodology & Documented Infrastructure Assumptions
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              {WATER_FOOTPRINT_METHODOLOGY.methodologyNotes}
            </p>
            <ul className="list-disc pl-4 text-xs text-[#475569] space-y-1">
              <li>
                <strong>Cloud Data Center Footprint:</strong> Assumes a standard Water Usage Effectiveness (WUE) of 1.8 Liters of water evaporated per kilowatt-hour of server power at cooling towers, plus 2.2 Liters/kWh thermoelectric grid power consumption = ~4.0 Liters total per kWh.
              </li>
              <li>
                <strong>Local Inference Footprint:</strong> Only incurs electricity generation grid water (~2.2 L/kWh), with 0.0 Liters on-site evaporative cooling loss.
              </li>
              <li>
                <strong>Confidence Classification:</strong> Marked as <code>[ESTIMATED]</code>. Live physical hardware sensors (e.g. RAPL energy counters) will promote metrics to <code>[MEASURED]</code> in the future desktop companion.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
