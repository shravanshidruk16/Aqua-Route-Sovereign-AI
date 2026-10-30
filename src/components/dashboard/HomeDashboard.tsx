'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Cpu, 
  HardDrive, 
  BarChart3, 
  Sparkles, 
  Paperclip, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Droplet, 
  DollarSign, 
  Activity, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight,
  Info
} from 'lucide-react';
import { SensitivityLevel, HardwareProfile, Model, RoutingDecision } from '@/types';
import { SAMPLE_PROMPTS } from '@/data/samplePrompts';
import { MODELS_CATALOGUE } from '@/data/modelsData';
import { getRecentDecisions } from '@/lib/storage';
import { AppView } from '../layout/Sidebar';

interface HomeDashboardProps {
  hardware: HardwareProfile;
  ollamaConnected: boolean;
  onNavigate: (view: AppView) => void;
  onLaunchTaskWithPrompt: (promptText: string, sensitivity: SensitivityLevel) => void;
  onOpenModelDetails: (model: Model) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  hardware,
  ollamaConnected,
  onNavigate,
  onLaunchTaskWithPrompt,
  onOpenModelDetails,
}) => {
  const [taskText, setTaskText] = useState('');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('INTERNAL');
  const [recentDecisions, setRecentDecisions] = useState<RoutingDecision[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setRecentDecisions(getRecentDecisions());
    setHasMounted(true);
  }, []);

  const handleRunTask = () => {
    if (!taskText.trim()) return;
    onLaunchTaskWithPrompt(taskText, sensitivity);
  };

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setTaskText(sample.prompt);
    setSensitivity(sample.defaultSensitivity);
    onLaunchTaskWithPrompt(sample.prompt, sample.defaultSensitivity);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111318] tracking-tight">
          Your AI. Your Rules.
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Discover, compare and execute AI workloads through the most suitable execution path.
        </p>
      </div>

      {/* Central AI Task Input Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="What do you want to accomplish today?"
            className="w-full p-4 rounded-2xl bg-[#F8F9FB] border border-[#CBD5E1] text-sm text-[#111318] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#0D9488] resize-none leading-relaxed"
          />
        </div>

        {/* Input Controls Bar: Attachment, Privacy Selector, Submit */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            {/* Attachment Button */}
            <button
              onClick={() => alert('AquaRoute local file analysis: Select a PDF, CSV, or code file for sandboxed evaluation.')}
              className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] text-[#717784] hover:text-[#111318] hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Attach confidential document or file"
            >
              <Paperclip size={15} />
              <span className="hidden sm:inline">Attach File</span>
            </button>

            {/* Privacy Sensitivity Selector */}
            <div className="flex items-center gap-1.5 bg-[#F8F9FB] border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs">
              <ShieldCheck size={14} className="text-teal-600" />
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value as SensitivityLevel)}
                className="bg-transparent font-semibold text-[#111318] focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="PUBLIC">PUBLIC (Cloud or Local)</option>
                <option value="INTERNAL">INTERNAL (Approved Cloud)</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL (Local Only)</option>
                <option value="HIGHLY_SENSITIVE">HIGHLY SENSITIVE (Air-Gapped)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunTask}
            disabled={!taskText.trim()}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              !taskText.trim()
                ? 'bg-[#CBD5E1] text-white cursor-not-allowed'
                : 'bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-2xs active:scale-98'
            }`}
          >
            <Sparkles size={14} />
            <span>Analyze Task</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Example Quick Prompts */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-[#717784] block mb-2 uppercase tracking-wider">
            Quick Architecture Scenarios:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectSample(p)}
                className="px-2.5 py-1 rounded-full text-xs bg-[#F1F4F8] hover:bg-teal-50 hover:text-teal-800 text-[#475569] transition-colors border border-transparent hover:border-teal-200"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Action Cards (Section 4 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('navigator')}
          className="p-5 rounded-3xl bg-white border border-[#E2E8F0] hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#111318]">AI Navigator</h3>
            <p className="text-xs text-[#717784] leading-relaxed">
              Task routing engine with explainable multi-objective optimization.
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 mt-4">
            Route Workload <ChevronRight size={13} />
          </span>
        </button>

        <button
          onClick={() => onNavigate('models')}
          className="p-5 rounded-3xl bg-white border border-[#E2E8F0] hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#111318]">Discover Models</h3>
            <p className="text-xs text-[#717784] leading-relaxed">
              Open-weight and hosted catalog across Qwen, Llama, Mistral, and DeepSeek.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-4">
            Browse Catalogue <ChevronRight size={13} />
          </span>
        </button>

        <button
          onClick={() => onNavigate('local-ai')}
          className="p-5 rounded-3xl bg-white border border-[#E2E8F0] hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HardDrive size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#111318]">Install Local AI</h3>
            <p className="text-xs text-[#717784] leading-relaxed">
              Check device compatibility, configure Ollama, and run models locally.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-4">
            Setup Local Runtime <ChevronRight size={13} />
          </span>
        </button>

        <button
          onClick={() => onNavigate('benchmarks')}
          className="p-5 rounded-3xl bg-white border border-[#E2E8F0] hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#111318]">Explore Benchmarks</h3>
            <p className="text-xs text-[#717784] leading-relaxed">
              Compare HumanEval, MMLU, GPQA, and latency radar matrices.
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-700 flex items-center gap-1 mt-4">
            View Radar Lab <ChevronRight size={13} />
          </span>
        </button>
      </div>

      {/* Dashboard Metrics (with explicit DEMO DATA label per requirements) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#717784]">
            System Telemetry & Platform Overview
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            DEMO DATA (Unconfigured Telemetry Mode)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#717784] block font-semibold">Total Models</span>
            <span className="text-lg font-extrabold text-[#111318] mt-0.5 block">{MODELS_CATALOGUE.length}</span>
            <span className="text-[10px] text-teal-700 font-medium">Verified</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#717784] block font-semibold">Providers</span>
            <span className="text-lg font-extrabold text-[#111318] mt-0.5 block">5</span>
            <span className="text-[10px] text-blue-600 font-medium">Frontier Cloud</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#717784] block font-semibold">Local Available</span>
            <span className="text-lg font-extrabold text-emerald-700 mt-0.5 block">
              {MODELS_CATALOGUE.filter(m => m.isOpenWeight).length}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Open-Weight</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#717784] block font-semibold">AI Requests</span>
            <span className="text-lg font-extrabold text-[#111318] mt-0.5 block">1,428</span>
            <span className="text-[10px] text-slate-500 font-medium">Sovereign routed</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#717784] block font-semibold">Est. Cost</span>
            <span className="text-lg font-extrabold text-emerald-600 mt-0.5 block">$14.80</span>
            <span className="text-[10px] text-emerald-700 font-medium">+$38 saved</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#717784] block font-semibold">Energy</span>
            <span className="text-lg font-extrabold text-[#111318] mt-0.5 block">4.82 kWh</span>
            <span className="text-[10px] text-slate-500 font-medium">Combined</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#717784] block font-semibold">Water Footprint</span>
            <span className="text-lg font-extrabold text-cyan-700 mt-0.5 block">12.4 L</span>
            <span className="text-[10px] text-cyan-600 font-medium">[ESTIMATED]</span>
          </div>
        </div>
      </div>

      {/* Recent Activity: Decisions & Tasks */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#717784]">
          Recent Sovereign Routing Activity
        </h2>

        {hasMounted && recentDecisions.length > 0 ? (
          <div className="space-y-2">
            {recentDecisions.slice(0, 4).map((dec) => (
              <div
                key={dec.id}
                className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111318]">{dec.recommendedModel.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      dec.sensitivityLevel === 'CONFIDENTIAL' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {dec.sensitivityLevel}
                    </span>
                    <span className="text-[10px] text-[#717784]">{dec.executionLocation}</span>
                  </div>
                  <p className="text-[11px] text-[#475569] line-clamp-1">{dec.userTask}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    {dec.estimatedCostUSD === 0 ? '$0.00' : `$${dec.estimatedCostUSD}`}
                  </span>
                  <button
                    onClick={() => onLaunchTaskWithPrompt(dec.userTask, dec.sensitivityLevel)}
                    className="text-xs font-semibold text-teal-700 hover:underline flex items-center"
                  >
                    View Result <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] text-center text-xs text-[#717784] space-y-1">
            <Clock size={18} className="mx-auto text-slate-400 mb-1" />
            <p className="font-semibold text-slate-800">No Routing Decisions Executed Yet</p>
            <p>Enter a task in the central prompt box above to generate your first decision.</p>
          </div>
        )}
      </div>
    </div>
  );
};
