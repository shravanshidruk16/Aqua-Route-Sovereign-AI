'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Cpu, 
  HardDrive, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Model, HardwareProfile, TaskCategory } from '@/types';
import { MODELS_CATALOGUE } from '@/data/modelsData';
import { evaluateHardwareCompatibility } from '@/lib/hardwareDetector';
import { ModelDetailModal } from './ModelDetailModal';

interface ModelExplorerProps {
  hardware: HardwareProfile;
  onInstallModel: (model: Model) => void;
  onOpenWorkspace: (model: Model) => void;
}

export const ModelExplorer: React.FC<ModelExplorerProps> = ({
  hardware,
  onInstallModel,
  onOpenWorkspace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<string>('All');
  const [selectedRuntime, setSelectedRuntime] = useState<string>('All');
  const [openWeightOnly, setOpenWeightOnly] = useState<boolean>(false);
  const [compatibleOnly, setCompatibleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedModelForModal, setSelectedModelForModal] = useState<Model | null>(null);

  const families = ['All', 'Qwen', 'Llama', 'Mistral', 'DeepSeek', 'Gemma', 'Phi', 'Anthropic', 'OpenAI', 'Google'];
  const tasks: (string)[] = [
    'All',
    'Coding',
    'Reasoning',
    'Mathematics',
    'Research',
    'Document Analysis',
    'Vision',
    'Agentic Tool Use',
  ];

  const filteredModels = useMemo(() => {
    return MODELS_CATALOGUE.filter((m) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          m.name.toLowerCase().includes(q) ||
          m.creator.toLowerCase().includes(q) ||
          m.family.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Family filter
      if (selectedFamily !== 'All' && m.family !== selectedFamily) {
        return false;
      }

      // Task filter
      if (selectedTask !== 'All') {
        if (!m.taskCapabilities.includes(selectedTask as TaskCategory)) {
          return false;
        }
      }

      // Open weight only
      if (openWeightOnly && !m.isOpenWeight) {
        return false;
      }

      // Hardware compatibility filter
      if (compatibleOnly) {
        const evalState = evaluateHardwareCompatibility(m, hardware).state;
        if (evalState !== 'COMPATIBLE' && evalState !== 'COMPATIBLE_WITH_LIMITATIONS') {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      } else if (sortBy === 'coding') {
        return (b.benchmarks.humanEval || 0) - (a.benchmarks.humanEval || 0);
      } else if (sortBy === 'reasoning') {
        return (b.benchmarks.gsm8k || 0) - (a.benchmarks.gsm8k || 0);
      } else if (sortBy === 'context') {
        return b.contextLength - a.contextLength;
      } else if (sortBy === 'params') {
        return b.rawParamsInBillions - a.rawParamsInBillions;
      } else if (sortBy === 'size') {
        return a.downloadSizeBytes - b.downloadSizeBytes;
      }
      return 0;
    });
  }, [searchQuery, selectedFamily, selectedTask, openWeightOnly, compatibleOnly, sortBy, hardware]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-1.5">
            <Cpu size={13} className="text-[#0D9488]" />
            <span>AI Model Discovery Centre</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
            Model Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#717784] mt-0.5">
            Explore verified open-weight and frontier models with precise hardware footprints and published benchmarks.
          </p>
        </div>

        {/* Quick Hardware Context */}
        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs text-xs flex items-center gap-3">
          <Cpu size={16} className="text-[#0D9488] shrink-0" />
          <div>
            <span className="font-semibold text-slate-800">Your Hardware Target</span>
            <p className="text-[11px] text-[#717784]">{hardware.os} • {hardware.ramGB} GB RAM Available</p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E2E8F0] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model name, creator, architecture, or benchmark..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs text-[#111318] focus:bg-white focus:outline-hidden focus:border-[#0D9488]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={15} className="text-[#717784]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-semibold text-[#111318] focus:outline-hidden focus:border-[#0D9488]"
            >
              <option value="newest">Sort: Newest Release</option>
              <option value="coding">Sort: Coding (HumanEval)</option>
              <option value="reasoning">Sort: Reasoning (GSM8K)</option>
              <option value="context">Sort: Context Length</option>
              <option value="params">Sort: Parameter Count</option>
              <option value="size">Sort: Download Size</option>
            </select>
          </div>
        </div>

        {/* Filter Badges: Families & Tasks */}
        <div className="space-y-2.5 pt-1">
          {/* Family Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-[#717784] mr-1">Family:</span>
            {families.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFamily(f)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedFamily === f
                    ? 'bg-[#111318] text-white font-semibold'
                    : 'bg-[#F1F4F8] text-[#475569] hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Task Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-[#717784] mr-1">Task:</span>
            {tasks.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTask(t)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedTask === t
                    ? 'bg-[#0D9488] text-white font-semibold'
                    : 'bg-[#F1F4F8] text-[#475569] hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#F1F4F8] text-xs text-[#334155]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openWeightOnly}
                onChange={(e) => setOpenWeightOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D9488] focus:ring-teal-500"
              />
              <span className="font-medium">Open-Weight Models Only (Downloadable)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={compatibleOnly}
                onChange={(e) => setCompatibleOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D9488] focus:ring-teal-500"
              />
              <span className="font-medium">Compatible with My {hardware.ramGB} GB RAM</span>
            </label>

            <span className="ml-auto text-[#717784] font-medium">
              Showing {filteredModels.length} of {MODELS_CATALOGUE.length} models
            </span>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => {
          const hw = evaluateHardwareCompatibility(model, hardware);

          return (
            <div
              key={model.id}
              className="bg-white rounded-3xl p-5 border border-[#E2E8F0] hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {model.family}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {model.parameters}
                    </span>
                    {model.groqModelId ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Groq LPU (Active)
                      </span>
                    ) : model.isOpenWeight ? (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        Local Q4
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Cloud
                      </span>
                    )}
                  </div>
                </div>

                {/* Model Title & Creator */}
                <h3 className="text-base font-bold text-[#111318] group-hover:text-[#0D9488] transition-colors">
                  {model.name}
                </h3>
                <p className="text-[11px] text-[#717784] mt-0.5">
                  by {model.creator} • {model.releaseDate}
                </p>

                {/* Description */}
                <p className="text-xs text-[#475569] mt-2.5 line-clamp-2 leading-relaxed">
                  {model.description}
                </p>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#F1F4F8] text-center">
                  <div className="p-1.5 rounded-xl bg-[#F8F9FB]">
                    <span className="text-[9px] text-[#717784] block">Context</span>
                    <span className="text-[11px] font-bold text-[#111318]">
                      {(model.contextLength / 1024).toFixed(0)}k
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#F8F9FB]">
                    <span className="text-[9px] text-[#717784] block">HumanEval</span>
                    <span className="text-[11px] font-bold text-teal-700">
                      {model.benchmarks.humanEval}%
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#F8F9FB]">
                    <span className="text-[9px] text-[#717784] block">Min RAM</span>
                    <span className="text-[11px] font-bold text-[#111318]">
                      {model.minRamRequiredGB > 0 ? `${model.minRamRequiredGB} GB` : 'Cloud'}
                    </span>
                  </div>
                </div>

                {/* Hardware Status Tag */}
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-[#717784]">Hardware Match:</span>
                  <span className={`font-semibold ${
                    hw.state === 'COMPATIBLE' ? 'text-emerald-600' :
                    hw.state === 'COMPATIBLE_WITH_LIMITATIONS' ? 'text-blue-600' :
                    hw.state === 'POSSIBLE_WITH_QUANTIZATION' ? 'text-amber-600' : 'text-red-500'
                  }`}>
                    {hw.state.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-4 pt-3 border-t border-[#F1F4F8] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedModelForModal(model)}
                  className="text-xs font-semibold text-slate-700 hover:text-black flex items-center gap-1"
                >
                  Specs & Benchmarks <ChevronRight size={13} />
                </button>

                {model.groqModelId ? (
                  <button
                    onClick={() => onOpenWorkspace(model)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Chat (Groq Live)
                  </button>
                ) : model.isOpenWeight ? (
                  <button
                    onClick={() => onInstallModel(model)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                  >
                    Install
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenWorkspace(model)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    Use in Chat
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Detail Modal */}
      <ModelDetailModal
        model={selectedModelForModal}
        isOpen={Boolean(selectedModelForModal)}
        onClose={() => setSelectedModelForModal(null)}
        hardware={hardware}
        onInstallClick={onInstallModel}
      />
    </div>
  );
};
