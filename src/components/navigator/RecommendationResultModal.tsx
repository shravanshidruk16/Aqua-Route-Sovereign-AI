'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HardDrive, 
  Cloud, 
  Cpu, 
  Zap, 
  Droplet, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  Bot,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RoutingDecision, Model, HardwareProfile } from '@/types';
import { ONLINE_PROVIDERS } from '@/data/providersData';

interface RecommendationResultModalProps {
  decision: RoutingDecision | null;
  isOpen: boolean;
  onClose: () => void;
  hardware: HardwareProfile;
  onInstallModel: (model: Model) => void;
  onOpenLocalAi: () => void;
  onOpenWorkspace: (model: Model) => void;
  onSelectAlternative: (model: Model) => void;
  onOpenCloudRedirect: (providerId: string) => void;
  onOpenModelDetails: (model: Model) => void;
}

export const RecommendationResultModal: React.FC<RecommendationResultModalProps> = ({
  decision,
  isOpen,
  onClose,
  hardware,
  onInstallModel,
  onOpenLocalAi,
  onOpenWorkspace,
  onSelectAlternative,
  onOpenCloudRedirect,
  onOpenModelDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'decision' | 'rejected' | 'sustainability'>('decision');

  if (!isOpen || !decision) return null;

  const model = decision.recommendedModel;
  const isLocal = decision.executionPath === 'LOCAL_MODEL' || decision.executionPath === 'AGENT_WORKFLOW';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2E8F0] z-10 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-teal-50/50 via-white to-blue-50/30 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-600 text-white flex items-center gap-1">
                <Sparkles size={12} />
                Recommended Execution Path
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isLocal ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {decision.executionPath.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                Confidence: {decision.confidenceScore}%
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111318] flex items-center gap-2">
              {model.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#717784]">
              Location: <span className="font-semibold text-slate-800">{decision.executionLocation}</span> • Data Sensitivity: <span className="font-semibold text-slate-800">{decision.sensitivityLevel}</span>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-[#717784] hover:bg-slate-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-[#E2E8F0] flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('decision')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'decision'
                ? 'border-[#0D9488] text-[#0D9488] font-semibold'
                : 'border-transparent text-[#717784] hover:text-[#111318]'
            }`}
          >
            Why Selected & Key Metrics
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'rejected'
                ? 'border-[#0D9488] text-[#0D9488] font-semibold'
                : 'border-transparent text-[#717784] hover:text-[#111318]'
            }`}
          >
            Why Other Models Were Rejected ({decision.whyRejected.length})
          </button>
          <button
            onClick={() => setActiveTab('sustainability')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'sustainability'
                ? 'border-[#0D9488] text-[#0D9488] font-semibold'
                : 'border-transparent text-[#717784] hover:text-[#111318]'
            }`}
          >
            Resource & Water Footprint
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'decision' && (
            <>
              {/* Task context & synthesized rationale */}
              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717784] block">
                  Routing Rationale
                </span>
                <p className="text-sm font-medium text-[#111318] leading-relaxed">
                  {decision.reason}
                </p>
              </div>

              {/* Verified Why Selected Points */}
              <div>
                <h3 className="text-xs font-semibold text-[#717784] uppercase tracking-wider mb-2.5">
                  Selection Factors
                </h3>
                <div className="space-y-2">
                  {decision.whySelected.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#334155]">
                      <CheckCircle2 size={16} className="text-teal-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Metrics Grid */}
              <div>
                <h3 className="text-xs font-semibold text-[#717784] uppercase tracking-wider mb-2.5">
                  Estimated Workload Telemetry
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[10px] text-[#717784] block font-semibold">Expected Quality</span>
                    <span className="text-sm font-bold text-[#111318] mt-0.5 block">{decision.expectedQuality}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[10px] text-[#717784] block font-semibold">Latency</span>
                    <span className="text-sm font-bold text-[#111318] mt-0.5 block">~{decision.expectedLatencyMs} ms</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[10px] text-[#717784] block font-semibold">Estimated Cost</span>
                    <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                      {decision.estimatedCostUSD === 0 ? '$0.00 (Local)' : `$${decision.estimatedCostUSD.toFixed(4)}`}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[10px] text-[#717784] block font-semibold">Hardware Status</span>
                    <span className="text-xs font-bold text-teal-700 mt-0.5 block truncate" title={decision.hardwareCompatibilityState}>
                      {decision.hardwareCompatibilityState.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Competing Alternatives */}
              {decision.alternatives.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#717784] uppercase tracking-wider mb-2.5">
                    Alternative Candidates Evaluated
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {decision.alternatives.map((alt) => (
                      <div 
                        key={alt.id}
                        className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] hover:border-teal-300 transition-colors cursor-pointer text-left"
                        onClick={() => onSelectAlternative(alt)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#111318]">{alt.name}</span>
                          <span className="text-[10px] text-[#717784]">{alt.parameters}</span>
                        </div>
                        <p className="text-[11px] text-[#717784] mt-1 line-clamp-1">{alt.description}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-teal-700">
                          <span>{alt.isOpenWeight ? 'Local Q4' : 'Cloud'}</span>
                          <span className="flex items-center">Inspect <ChevronRight size={12} /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'rejected' && (
            <div className="space-y-3">
              <p className="text-xs text-[#717784] leading-relaxed">
                AquaRoute enforces hard policy gates and hardware constraints before ranking candidates. Here is why non-recommended models were excluded:
              </p>
              {decision.whyRejected.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-xs text-[#717784] text-center">
                  All evaluated models were eligible; top model won on Pareto multi-objective score.
                </div>
              ) : (
                decision.whyRejected.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200 text-xs flex items-start gap-3">
                    <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-950">{item.candidateName}</p>
                      <p className="text-red-800 text-[11px] mt-0.5 leading-relaxed">{item.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sustainability' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-cyan-950 text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <Droplet size={18} className="text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Green AI & Water Footprint Estimation:</span>
                    <p className="text-[11px] text-cyan-800 mt-0.5 leading-relaxed">
                      Every cloud inference query requires electricity that evaporates water at hyperscale data center cooling towers and thermoelectric power stations. Local inference bypasses data center cooling towers completely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#717784] block font-semibold">Estimated Energy</span>
                  <span className="text-base font-extrabold text-[#111318] mt-1 block">
                    {decision.estimatedEnergyWh} Wh
                  </span>
                  <span className="text-[10px] text-[#717784] block mt-0.5">[ESTIMATED]</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#717784] block font-semibold">Carbon Emissions</span>
                  <span className="text-base font-extrabold text-[#111318] mt-1 block">
                    {decision.estimatedCarbonG} g CO2
                  </span>
                  <span className="text-[10px] text-[#717784] block mt-0.5">[ESTIMATED]</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#717784] block font-semibold">Water Footprint</span>
                  <span className="text-base font-extrabold text-blue-600 mt-1 block">
                    {decision.estimatedWaterMl} mL
                  </span>
                  <span className="text-[10px] text-[#717784] block mt-0.5">[ESTIMATED WUE]</span>
                </div>
              </div>

              <p className="text-[11px] text-[#717784] italic">
                * Methodological confidence: ESTIMATED. Assumes typical request size of ~2,100 tokens and 1.8 L/kWh data center WUE.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action Buttons (Mandatory per Section 5) */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-slate-50/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenModelDetails(model)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-200 transition-colors"
            >
              Technical Details
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-200"
            >
              Close
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {model.groqModelId ? (
              <button
                onClick={() => onOpenWorkspace(model)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm flex items-center gap-1.5"
              >
                <Zap size={14} className="fill-white" />
                Run on Groq LPU (Live Free)
              </button>
            ) : isLocal ? (
              <>
                <button
                  onClick={() => onOpenCloudRedirect('anthropic-claude')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                >
                  Use Cloud AI Instead
                </button>
                <button
                  onClick={() => onInstallModel(model)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm flex items-center gap-1.5"
                >
                  <HardDrive size={14} />
                  Install This Model
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenLocalAi}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                >
                  Use Local AI Instead
                </button>
                <button
                  onClick={() => onOpenCloudRedirect('anthropic-claude')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm flex items-center gap-1.5"
                >
                  <ExternalLink size={14} />
                  Open Cloud Provider
                </button>
              </>
            )}

            <button
              onClick={() => onOpenWorkspace(model)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111318] text-white hover:bg-black shadow-sm flex items-center gap-1.5"
            >
              Execute in Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
