'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  Zap, 
  Droplet, 
  DollarSign, 
  Layers, 
  FileText, 
  Check, 
  Clock, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { 
  SensitivityLevel, 
  HardwareProfile, 
  RoutingDecision, 
  Model 
} from '@/types';
import { SAMPLE_PROMPTS } from '@/data/samplePrompts';
import { executeRoutingAnalysis, RoutingPreferences } from '@/lib/routingEngine';
import { saveRecentDecision, saveAuditLog } from '@/lib/storage';
import { RecommendationResultModal } from './RecommendationResultModal';

interface AiNavigatorProps {
  hardware: HardwareProfile;
  ollamaConnected: boolean;
  onInstallModel: (model: Model) => void;
  onOpenLocalAi: () => void;
  onOpenWorkspace: (model: Model) => void;
  onOpenCloudRedirect: (providerId: string, prompt: string) => void;
  onOpenModelDetails: (model: Model) => void;
}

export const AiNavigator: React.FC<AiNavigatorProps> = ({
  hardware,
  ollamaConnected,
  onInstallModel,
  onOpenLocalAi,
  onOpenWorkspace,
  onOpenCloudRedirect,
  onOpenModelDetails,
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('INTERNAL');
  const [priorityWeight, setPriorityWeight] = useState<RoutingPreferences['priorityWeight']>('balanced');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeDecision, setActiveDecision] = useState<RoutingDecision | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const handleRunAnalysis = (overrideText?: string, overrideSensitivity?: SensitivityLevel) => {
    const textToAnalyze = overrideText || taskInput;
    if (!textToAnalyze.trim()) return;

    const currentSens = overrideSensitivity || sensitivity;

    setIsAnalyzing(true);

    setTimeout(() => {
      const decision = executeRoutingAnalysis(textToAnalyze, currentSens, hardware, {
        priorityWeight,
        allowCloudProviders: true,
      });

      // Save to recent decisions
      saveRecentDecision(decision);

      // Create sovereign audit record
      saveAuditLog({
        requestId: decision.id,
        timestamp: decision.timestamp,
        taskSnippet: decision.userTask.slice(0, 80) + '...',
        sensitivity: decision.sensitivityLevel,
        policyApplied: `Sovereign Gateway: ${decision.sensitivityLevel} Gate`,
        selectedModel: decision.recommendedModel.name,
        executionLocation: decision.executionLocation,
        decisionReason: decision.reason,
        executionStatus: decision.executionPath === 'LOCAL_MODEL' ? 'LOCAL_EXECUTED' : 'REDIRECTED_ONLINE',
      });

      setActiveDecision(decision);
      setIsAnalyzing(false);
      setIsResultOpen(true);
    }, 450); // micro-interaction delay
  };

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setTaskInput(sample.prompt);
    setSensitivity(sample.defaultSensitivity);
    handleRunAnalysis(sample.prompt, sample.defaultSensitivity);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <Compass size={14} className="text-[#0D9488]" />
          <span>Intelligent AI Traffic Controller</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          AI Navigator Engine
        </h1>
        <p className="text-sm text-[#717784] max-w-2xl leading-relaxed">
          Describe what you want to achieve. AquaRoute evaluates task complexity, data sensitivity, hardware constraints, and environmental footprint to select your optimum execution path.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#717784] block mb-2">
            Workload or Prompt Description
          </label>
          <div className="relative">
            <textarea
              rows={4}
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. Audit an internal NDA agreement for indemnification clauses and produce a compliance matrix without sending text outside our firewall..."
              className="w-full p-4 rounded-2xl bg-[#F8F9FB] border border-[#CBD5E1] text-sm text-[#111318] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all resize-none"
            />
          </div>
        </div>

        {/* Configuration Row: Sensitivity + Optimization Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Data Sensitivity Selector */}
          <div>
            <label className="text-xs font-semibold text-[#475569] flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-600" />
                Data Sensitivity Level
              </span>
              <span className="text-[10px] text-[#717784]">Sovereignty Policy</span>
            </label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value as SensitivityLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-semibold text-[#111318] focus:outline-hidden focus:border-[#0D9488]"
            >
              <option value="PUBLIC">PUBLIC — Open domain, cloud & local permitted</option>
              <option value="INTERNAL">INTERNAL — Company non-confidential, approved cloud allowed</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL — Strict local or approved private infra only</option>
              <option value="HIGHLY_SENSITIVE">HIGHLY SENSITIVE — 100% Air-gapped local execution mandatory</option>
            </select>
          </div>

          {/* Pareto Optimization Preference */}
          <div>
            <label className="text-xs font-semibold text-[#475569] flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal size={14} className="text-teal-600" />
                Routing Preference
              </span>
              <span className="text-[10px] text-[#717784]">Multi-Objective Weights</span>
            </label>
            <select
              value={priorityWeight}
              onChange={(e) => setPriorityWeight(e.target.value as RoutingPreferences['priorityWeight'])}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-semibold text-[#111318] focus:outline-hidden focus:border-[#0D9488]"
            >
              <option value="balanced">Balanced (Pareto Quality, Cost & Latency)</option>
              <option value="privacy_first">Privacy First (Prioritize Local & Sovereignty)</option>
              <option value="quality">Maximum Output Quality (Frontier Benchmark Weights)</option>
              <option value="latency">Fastest Latency (Instant Tokens/sec)</option>
              <option value="sustainability">Sustainability (Lowest Energy & Water Footprint)</option>
            </select>
          </div>
        </div>

        {/* System Context Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#717784] border-t border-[#F1F4F8]">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-[#0D9488]" />
            <span>
              Target Hardware: <strong className="text-slate-800">{hardware.os}</strong> • <strong className="text-slate-800">{hardware.ramGB} GB RAM</strong>
              {hardware.webGpuAvailable ? ' • WebGPU Active' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>Ollama: {ollamaConnected ? 'Connected' : 'Standby (Guided Setup)'}</span>
          </div>
        </div>

        {/* Analyze Task Primary Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => handleRunAnalysis()}
            disabled={!taskInput.trim() || isAnalyzing}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
              !taskInput.trim() || isAnalyzing
                ? 'bg-[#CBD5E1] text-white cursor-not-allowed'
                : 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-teal-600/20 active:scale-98'
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Execution Vectors...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Analyze Task & Route</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Quick Task Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#717784]">
            Pre-Configured Architecture Scenarios
          </h2>
          <span className="text-xs text-[#717784]">Click to test instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_PROMPTS.slice(0, 6).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {sample.category}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    sample.defaultSensitivity === 'CONFIDENTIAL' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {sample.defaultSensitivity}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#111318] group-hover:text-[#0D9488] transition-colors">
                  {sample.title}
                </h3>
                <p className="text-[11px] text-[#717784] mt-1 line-clamp-2 leading-relaxed">
                  {sample.prompt}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-teal-700 pt-2 border-t border-[#F8F9FB]">
                <span>Run Test</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendation Modal */}
      <RecommendationResultModal
        decision={activeDecision}
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        hardware={hardware}
        onInstallModel={onInstallModel}
        onOpenLocalAi={onOpenLocalAi}
        onOpenWorkspace={onOpenWorkspace}
        onSelectAlternative={(alt) => {
          setIsResultOpen(false);
          onOpenModelDetails(alt);
        }}
        onOpenCloudRedirect={(providerId) => {
          setIsResultOpen(false);
          onOpenCloudRedirect(providerId, activeDecision?.userTask || taskInput);
        }}
        onOpenModelDetails={onOpenModelDetails}
      />
    </div>
  );
};
