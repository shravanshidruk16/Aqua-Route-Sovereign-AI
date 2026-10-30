'use client';

import React, { useState } from 'react';
import { 
  X, 
  HardDrive, 
  Download, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Play
} from 'lucide-react';
import { Model, HardwareProfile } from '@/types';
import { evaluateHardwareCompatibility } from '@/lib/hardwareDetector';

interface InstallModelModalProps {
  model: Model | null;
  isOpen: boolean;
  onClose: () => void;
  hardware: HardwareProfile;
  ollamaConnected: boolean;
  onOpenColab?: (model: Model) => void;
  onOpenWorkspace?: () => void;
}

export const InstallModelModal: React.FC<InstallModelModalProps> = ({
  model,
  isOpen,
  onClose,
  hardware,
  ollamaConnected,
  onOpenColab,
  onOpenWorkspace,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmedDisclosure, setConfirmedDisclosure] = useState(false);
  const [simulatedInstallState, setSimulatedInstallState] = useState<'idle' | 'pulling' | 'complete'>('idle');
  const [installProgress, setInstallProgress] = useState(0);

  if (!isOpen || !model) return null;

  const ollamaTag = model.ollamaTag || `${model.id}`;
  const runCommand = `ollama run ${ollamaTag}`;
  const hwEval = evaluateHardwareCompatibility(model, hardware);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(runCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSimulatePull = () => {
    setSimulatedInstallState('pulling');
    setInstallProgress(10);
    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulatedInstallState('complete');
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <HardDrive size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#111318]">Install Local Model</h2>
              <p className="text-xs text-[#717784]">{model.name} ({model.parameters})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#717784] hover:bg-[#F1F4F8]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Specifications Matrix */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#717784] block font-semibold">Download</span>
            <span className="text-xs font-bold text-[#111318]">{model.downloadSizeFormatted}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#717784] block font-semibold">Required RAM</span>
            <span className="text-xs font-bold text-[#111318]">{model.minRamRequiredGB} GB</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#717784] block font-semibold">Format</span>
            <span className="text-xs font-bold text-[#111318]">{model.defaultQuantization}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#717784] block font-semibold">Inference Engine</span>
            <span className="text-xs font-bold text-teal-700">Ollama</span>
          </div>
        </div>

        {/* Explicit Local Storage Disclosure (Mandatory requirement) */}
        <div className="mt-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-2">
          <div className="flex items-start gap-2.5">
            <Info size={17} className="text-[#0D9488] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Permanent Local Storage Disclosure:</span>
              <p className="mt-1 text-teal-800 leading-relaxed text-[11px]">
                &quot;This model will be downloaded and stored locally. You generally need to download it only once. It will remain available locally until you uninstall it.&quot;
              </p>
              <p className="mt-1 text-teal-700 text-[10px]">
                Note: Updating the model weights or switching to a different quantization variant (e.g. Q8 vs Q4) will require a separate download.
              </p>
            </div>
          </div>
        </div>

        {/* Real Status Check: Is Ollama Installed? */}
        <div className="mt-4">
          {ollamaConnected ? (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400">Ollama Connected & Ready</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy Command'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300 flex items-center justify-between">
                <span>{runCommand}</span>
              </div>

              <p className="text-[11px] text-slate-400">
                Execute this in your terminal to pull and run this model. Ollama will automatically fetch the Q4 quantized weights and mount them in local GPU VRAM.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#CBD5E1] space-y-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle size={16} className="text-amber-600" />
                <span className="text-xs font-bold">Ollama Runtime Not Detected</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Browsers cannot directly spawn background operating system daemons. To run {model.name} locally, install the free open-source Ollama runtime:
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="https://ollama.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#111318] text-white hover:bg-black flex items-center gap-1.5 shadow-2xs"
                >
                  <Download size={13} />
                  Download Ollama for {hardware.os}
                  <ExternalLink size={12} />
                </a>

                {onOpenColab && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenColab(model);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <span>Use Google Colab Instead</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Future Desktop Companion Notice */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-[11px] text-[#475569]">
          <Terminal size={15} className="text-slate-500 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-slate-800">Future Desktop Companion: </span>
            A native Tauri desktop daemon is planned to manage automated background model installations with full OS privileges without browser sandboxing constraints.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-[#F1F4F8]"
          >
            Done
          </button>

          {onOpenWorkspace && (
            <button
              onClick={() => {
                onClose();
                onOpenWorkspace();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm flex items-center gap-1.5"
            >
              <Play size={13} />
              Open in AI Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
