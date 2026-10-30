'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Check, 
  Cpu, 
  Zap, 
  Droplet, 
  DollarSign, 
  Layers, 
  Info,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Model, HardwareProfile } from '@/types';
import { MODELS_CATALOGUE } from '@/data/modelsData';
import { evaluateHardwareCompatibility } from '@/lib/hardwareDetector';

interface BenchmarkLabProps {
  hardware: HardwareProfile;
  onSelectModelForWorkspace: (model: Model) => void;
  onInstallModel: (model: Model) => void;
}

export const BenchmarkLab: React.FC<BenchmarkLabProps> = ({
  hardware,
  onSelectModelForWorkspace,
  onInstallModel,
}) => {
  // Pre-select 3 interesting diverse models for comparison
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'qwen-2.5-coder-7b',
    'llama-3.1-8b',
    'claude-3-5-sonnet',
  ]);

  const [activeChartMetric, setActiveChartMetric] = useState<'capabilities' | 'efficiency' | 'sustainability'>('capabilities');

  const selectedModels = selectedIds
    .map((id) => MODELS_CATALOGUE.find((m) => m.id === id))
    .filter((m): m is Model => Boolean(m));

  const handleToggleModel = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // replace last
        setSelectedIds([selectedIds[0], selectedIds[1], id]);
      }
    }
  };

  // 1. Radar Data: Capabilities across selected models
  const radarData = [
    {
      subject: 'Coding',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.scores.coding])),
    },
    {
      subject: 'Reasoning',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.scores.reasoning])),
    },
    {
      subject: 'Mathematics',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.scores.math])),
    },
    {
      subject: 'Knowledge',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.scores.knowledge])),
    },
    {
      subject: 'Instruction',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.scores.instruction])),
    },
    {
      subject: 'Tool Calling',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.scores.toolCalling])),
    },
  ];

  // 2. Bar Chart Data: Standardized Benchmark Percentages
  const benchmarkBarData = [
    {
      benchmark: 'HumanEval (%)',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.benchmarks.humanEval || 0])),
    },
    {
      benchmark: 'MMLU (%)',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.benchmarks.mmlu || 0])),
    },
    {
      benchmark: 'GSM8K (%)',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.benchmarks.gsm8k || 0])),
    },
    {
      benchmark: 'MATH 500 (%)',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.benchmarks.math500 || 0])),
    },
    {
      benchmark: 'GPQA (%)',
      ...Object.fromEntries(selectedModels.map((m) => [m.id, m.benchmarks.gpqa || 0])),
    },
  ];

  // 3. Efficiency Data: Latency & RAM
  const efficiencyBarData = selectedModels.map((m) => ({
    name: m.name.split(' ')[0] + ' ' + m.parameters,
    ramGB: m.minRamRequiredGB,
    latencyMs: m.benchmarks.avgLatencyMs,
    energyWh: m.sustainability.energyWhPer1kTokens,
    waterMl: m.sustainability.waterFootprintMlPer1kTokens,
  }));

  const modelColors = ['#0D9488', '#2563EB', '#8B5CF6'];

  // "Which model is best for my hardware?" quick recommendation
  const hardwareBestModel = MODELS_CATALOGUE
    .filter((m) => m.isOpenWeight)
    .filter((m) => {
      const hw = evaluateHardwareCompatibility(m, hardware);
      return hw.state === 'COMPATIBLE' || hw.state === 'COMPATIBLE_WITH_LIMITATIONS';
    })
    .sort((a, b) => (b.scores.coding + b.scores.reasoning) - (a.scores.coding + a.scores.reasoning))[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <BarChart3 size={13} className="text-[#0D9488]" />
          <span>Independent Multi-Model Evaluation Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          Model Benchmark Lab
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Compare standardized published benchmarks, latency, memory footprints, and estimated environmental water consumption side-by-side.
        </p>
      </div>

      {/* Hardware Best Model Callout */}
      {hardwareBestModel && (
        <div className="p-4 rounded-3xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-950">Recommended for Your System:</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-teal-800 font-mono font-bold">
                  {hardware.ramGB} GB RAM
                </span>
              </div>
              <p className="text-xs text-teal-800 mt-0.5 font-medium">
                <strong>{hardwareBestModel.name}</strong> delivers top localized quality within your safe memory headroom.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggleModel(hardwareBestModel.id)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-teal-800 border border-teal-300 hover:bg-teal-50 shadow-2xs self-start sm:self-center"
          >
            Compare in Lab
          </button>
        </div>
      )}

      {/* Model Selection Selector (Pick up to 3) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#717784]">
            Select Models to Compare (Up to 3)
          </label>
          <span className="text-xs text-teal-700 font-semibold">
            {selectedIds.length} / 3 Selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {MODELS_CATALOGUE.map((model) => {
            const isSelected = selectedIds.includes(model.id);
            const index = selectedIds.indexOf(model.id);
            const color = index !== -1 ? modelColors[index] : undefined;

            return (
              <button
                key={model.id}
                onClick={() => handleToggleModel(model.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-[#F1F4F8] text-[#475569] hover:bg-slate-200'
                }`}
                style={isSelected ? { backgroundColor: color } : undefined}
              >
                {isSelected && <Check size={13} />}
                <span>{model.name}</span>
                <span className={`text-[10px] opacity-80 ${isSelected ? 'text-white' : 'text-[#717784]'}`}>
                  ({model.parameters})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Chart Switcher & Graphs */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F4F8] pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveChartMetric('capabilities')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeChartMetric === 'capabilities'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
              }`}
            >
              Capability Radar
            </button>
            <button
              onClick={() => setActiveChartMetric('efficiency')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeChartMetric === 'efficiency'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
              }`}
            >
              Standardized Benchmarks
            </button>
            <button
              onClick={() => setActiveChartMetric('sustainability')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeChartMetric === 'sustainability'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
              }`}
            >
              Resource & Water Footprint
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {selectedModels.map((m, idx) => (
              <span key={m.id} className="flex items-center gap-1.5 font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: modelColors[idx] }} />
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full">
          {activeChartMetric === 'capabilities' && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" />
                {selectedModels.map((m, idx) => (
                  <Radar
                    key={m.id}
                    name={m.name}
                    dataKey={m.id}
                    stroke={modelColors[idx]}
                    fill={modelColors[idx]}
                    fillOpacity={0.25}
                  />
                ))}
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          )}

          {activeChartMetric === 'efficiency' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkBarData}>
                <XAxis dataKey="benchmark" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedModels.map((m, idx) => (
                  <Bar
                    key={m.id}
                    dataKey={m.id}
                    name={m.name}
                    fill={modelColors[idx]}
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartMetric === 'sustainability' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyBarData}>
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="waterMl" name="Water Footprint (mL / 1k tok)" fill="#0D9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="energyWh" name="Energy (Wh / 1k tok)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4 overflow-x-auto">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#717784]">
          Full Side-by-Side Specifications
        </h3>

        <table className="w-full text-left text-xs text-[#334155] border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#717784]">
              <th className="py-2.5 font-semibold">Attribute</th>
              {selectedModels.map((m, idx) => (
                <th key={m.id} className="py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: modelColors[idx] }} />
                    {m.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F4F8]">
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">Execution Location</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-semibold">
                  {m.isOpenWeight ? 'Local Runtime (Ollama)' : 'Cloud API'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">Context Length</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-mono">
                  {(m.contextLength / 1024).toLocaleString()}k tokens
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">Minimum RAM</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-mono">
                  {m.minRamRequiredGB > 0 ? `${m.minRamRequiredGB} GB` : '0 GB (Remote)'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">Download Size (Q4)</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-mono">
                  {m.downloadSizeFormatted}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">HumanEval (Coding)</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-bold text-teal-700">
                  {m.benchmarks.humanEval}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">GSM8K (Math)</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-bold text-blue-700">
                  {m.benchmarks.gsm8k}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">Inference Cost</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-semibold">
                  {m.isOpenWeight ? '$0.00 (Free)' : `$${m.pricing.outputPerMillion}/1M tokens`}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">Water Footprint (mL)</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5 font-mono text-cyan-800">
                  {m.sustainability.waterFootprintMlPer1kTokens} mL / 1k tok
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-medium text-[#717784]">Actions</td>
              {selectedModels.map((m) => (
                <td key={m.id} className="py-2.5">
                  {m.isOpenWeight ? (
                    <button
                      onClick={() => onInstallModel(m)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200"
                    >
                      Install Local
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectModelForWorkspace(m)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
                    >
                      Chat in Workspace
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
