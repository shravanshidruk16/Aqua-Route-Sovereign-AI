'use client';

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  BookOpen, 
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Droplet
} from 'lucide-react';
import { Model, HardwareProfile } from '@/types';
import { evaluateHardwareCompatibility } from '@/lib/hardwareDetector';

interface ModelDetailModalProps {
  model: Model | null;
  isOpen: boolean;
  onClose: () => void;
  hardware: HardwareProfile;
  onInstallClick?: (model: Model) => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  isOpen,
  onClose,
  hardware,
  onInstallClick,
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen || !model) return null;

  const hwEval = evaluateHardwareCompatibility(model, hardware);

  const ollamaCmd = model.ollamaTag ? `ollama run ${model.ollamaTag}` : `ollama run ${model.id}`;

  const handleCopyCmd = async () => {
    try {
      await navigator.clipboard.writeText(ollamaCmd);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8F0] z-10 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                {model.family}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                {model.parameters} Parameters
              </span>
              {model.isOpenWeight ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Open-Weight
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Cloud Hosted
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111318]">{model.name}</h2>
            <p className="text-xs sm:text-sm text-[#717784] mt-0.5">
              Created by <span className="font-semibold text-slate-800">{model.creator}</span> • Released {model.releaseDate}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-[#717784] uppercase tracking-wider mb-2">Overview</h3>
            <p className="text-sm text-[#334155] leading-relaxed">{model.description}</p>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
              <span className="text-[11px] text-[#717784] block font-medium">Context Window</span>
              <span className="text-sm font-bold text-[#111318] mt-0.5 block">
                {(model.contextLength / 1024).toLocaleString()}k tokens
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
              <span className="text-[11px] text-[#717784] block font-medium">Download Size</span>
              <span className="text-sm font-bold text-[#111318] mt-0.5 block">
                {model.downloadSizeFormatted}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
              <span className="text-[11px] text-[#717784] block font-medium">Min RAM Needed</span>
              <span className="text-sm font-bold text-[#111318] mt-0.5 block">
                {model.minRamRequiredGB > 0 ? `${model.minRamRequiredGB} GB` : 'Cloud Hosted'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
              <span className="text-[11px] text-[#717784] block font-medium">License</span>
              <span className="text-sm font-bold text-[#111318] mt-0.5 block truncate" title={model.license}>
                {model.license}
              </span>
            </div>
          </div>

          {/* Hardware Compatibility Banner */}
          <div className={`p-4 rounded-2xl border ${
            hwEval.state === 'COMPATIBLE'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : hwEval.state === 'COMPATIBLE_WITH_LIMITATIONS'
              ? 'bg-blue-50/70 border-blue-200 text-blue-950'
              : hwEval.state === 'POSSIBLE_WITH_QUANTIZATION'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-red-50/70 border-red-200 text-red-950'
          }`}>
            <div className="flex items-start gap-3">
              {hwEval.state === 'COMPATIBLE' ? (
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">
                    Hardware Status: {hwEval.state.replace(/_/g, ' ')}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 font-mono font-medium">
                    Your System: {hardware.ramGB} GB RAM ({hardware.os})
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed opacity-90">{hwEval.reason}</p>
              </div>
            </div>
          </div>

          {/* Benchmark Results Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#717784] uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 size={14} className="text-[#0D9488]" />
                Standardized Benchmark Scores
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-[#475569] font-medium">
                Source: {model.benchmarks.source.replace(/_/g, ' ')} ({model.benchmarks.evaluationDate})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-[#717784] block font-semibold">HumanEval (Code)</span>
                <span className="text-base font-extrabold text-[#111318]">{model.benchmarks.humanEval}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-[#717784] block font-semibold">MMLU (General)</span>
                <span className="text-base font-extrabold text-[#111318]">{model.benchmarks.mmlu}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-[#717784] block font-semibold">GSM8K (Math)</span>
                <span className="text-base font-extrabold text-[#111318]">{model.benchmarks.gsm8k}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-[#717784] block font-semibold">MATH 500</span>
                <span className="text-base font-extrabold text-[#111318]">{model.benchmarks.math500}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-[#717784] block font-semibold">GPQA (Reasoning)</span>
                <span className="text-base font-extrabold text-[#111318]">{model.benchmarks.gpqa}%</span>
              </div>
            </div>
          </div>

          {/* Sustainability & Eco footprint */}
          <div>
            <h3 className="text-xs font-semibold text-[#717784] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Droplet size={14} className="text-[#0D9488]" />
              Resource & Sustainability Footprint
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100">
                <span className="text-[11px] text-teal-800 font-medium block">Energy / 1k Tokens</span>
                <span className="text-sm font-bold text-teal-950 mt-0.5 block">{model.sustainability.energyWhPer1kTokens} Wh</span>
                <span className="text-[10px] text-teal-700">[{model.sustainability.dataType}]</span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-[11px] text-blue-800 font-medium block">Water Footprint</span>
                <span className="text-sm font-bold text-blue-950 mt-0.5 block">{model.sustainability.waterFootprintMlPer1kTokens} mL / 1k tok</span>
                <span className="text-[10px] text-blue-700">[ESTIMATED WUE]</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-700 font-medium block">Inference Cost</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {model.isOpenWeight ? '$0.00 (Free Local)' : `$${model.pricing.outputPerMillion}/1M tok`}
                </span>
                <span className="text-[10px] text-slate-500">Verified Pricing</span>
              </div>
            </div>
          </div>

          {/* Local Runtime Installation Commands */}
          {model.isOpenWeight && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Terminal size={14} className="text-teal-400" />
                  Run Locally via Ollama
                </span>
                <button
                  onClick={handleCopyCmd}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
                >
                  {copiedCmd ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  {copiedCmd ? 'Copied' : 'Copy Command'}
                </button>
              </div>
              <code className="text-xs font-mono text-teal-300 block bg-slate-950 p-2.5 rounded-xl border border-slate-800 select-all">
                {ollamaCmd}
              </code>
            </div>
          )}

          {/* Official External Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={model.officialRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
            >
              <ExternalLink size={13} />
              Official HuggingFace / Model Repository
            </a>
            <span className="text-slate-300">•</span>
            <a
              href={model.officialDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1"
            >
              <BookOpen size={13} />
              Technical Documentation & Paper
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-200"
          >
            Close
          </button>

          {model.isOpenWeight && onInstallClick && (
            <button
              onClick={() => {
                onClose();
                onInstallClick(model);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm flex items-center gap-1.5"
            >
              <HardDrive size={14} />
              Install This Model
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
