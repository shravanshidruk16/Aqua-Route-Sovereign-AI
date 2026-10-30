'use client';

import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Terminal, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Play, 
  Sliders, 
  Layers, 
  Copy, 
  Check,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { HardwareProfile, Model } from '@/types';
import { MODELS_CATALOGUE } from '@/data/modelsData';
import { 
  evaluateHardwareCompatibility, 
  saveHardwareProfile 
} from '@/lib/hardwareDetector';
import { 
  checkOllamaConnection, 
  getOllamaEndpoint, 
  setOllamaEndpoint, 
  OllamaModelTag 
} from '@/lib/ollamaClient';
import { InstallModelModal } from './InstallModelModal';
import { ColabGuideModal } from './ColabGuideModal';

interface LocalAiStudioProps {
  hardware: HardwareProfile;
  onUpdateHardware: (profile: HardwareProfile) => void;
  ollamaConnected: boolean;
  onRefreshOllama: () => void;
  onOpenWorkspaceWithModel: (model: Model) => void;
}

export const LocalAiStudio: React.FC<LocalAiStudioProps> = ({
  hardware,
  onUpdateHardware,
  ollamaConnected,
  onRefreshOllama,
  onOpenWorkspaceWithModel,
}) => {
  const [isEditingHardware, setIsEditingHardware] = useState(false);
  const [manualForm, setManualForm] = useState<HardwareProfile>(hardware);

  // Ollama local tags
  const [localOllamaModels, setLocalOllamaModels] = useState<OllamaModelTag[]>([]);
  const [ollamaEndpointInput, setOllamaEndpointInput] = useState(getOllamaEndpoint());
  const [isCheckingOllama, setIsCheckingOllama] = useState(false);
  const [ollamaError, setOllamaError] = useState<string | null>(null);

  // Modals
  const [selectedModelForInstall, setSelectedModelForInstall] = useState<Model | null>(null);
  const [selectedModelForColab, setSelectedModelForColab] = useState<Model | null>(null);

  // Check Ollama tags on mount
  useEffect(() => {
    handleCheckOllama();
  }, []);

  const handleCheckOllama = async () => {
    setIsCheckingOllama(true);
    setOllamaError(null);
    const result = await checkOllamaConnection(ollamaEndpointInput);
    setLocalOllamaModels(result.models);
    if (!result.isConnected) {
      setOllamaError(result.error || 'Cannot reach Ollama at endpoint.');
    } else {
      setOllamaEndpoint(ollamaEndpointInput);
      onRefreshOllama();
    }
    setIsCheckingOllama(false);
  };

  const handleSaveManualHardware = () => {
    const updated: HardwareProfile = {
      ...manualForm,
      isAutoDetected: false,
      detectionAccuracy: 'exact',
    };
    saveHardwareProfile(updated);
    onUpdateHardware(updated);
    setIsEditingHardware(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <HardDrive size={13} className="text-[#0D9488]" />
          <span>Sovereign Local Inference Runtime</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          Local AI Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Inspect device memory limits, connect local Ollama inference, configure hardware specifications, and deploy open-weight foundation models safely without cloud dependencies.
        </p>
      </div>

      {/* Grid: Left: Hardware Detector | Right: Ollama Runtime Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Capability Detector */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Cpu size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111318]">Device Capability Profiler</h2>
                <span className="text-[11px] text-[#717784]">
                  {hardware.isAutoDetected ? 'Auto-detected via browser APIs' : 'User-configured manual profile'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingHardware(!isEditingHardware)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200"
            >
              {isEditingHardware ? 'Cancel Edit' : 'Edit Specs'}
            </button>
          </div>

          {hardware.detectionAccuracy === 'estimated' && !isEditingHardware && (
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Browser Privacy Notice:</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  &quot;Hardware information requires additional permission or manual confirmation.&quot; Browsers cap reported RAM at 8GB for fingerprinting defense. Click <strong>Edit Specs</strong> to input your exact system RAM.
                </p>
              </div>
            </div>
          )}

          {isEditingHardware ? (
            /* Manual Hardware Configuration Form */
            <div className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#475569] block mb-1">Operating System</label>
                  <select
                    value={manualForm.os}
                    onChange={(e) => setManualForm({ ...manualForm, os: e.target.value as HardwareProfile['os'] })}
                    className="w-full p-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] font-semibold"
                  >
                    <option value="Windows">Windows</option>
                    <option value="macOS">macOS</option>
                    <option value="Linux">Linux</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#475569] block mb-1">System RAM (GB)</label>
                  <input
                    type="number"
                    value={manualForm.ramGB}
                    onChange={(e) => setManualForm({ ...manualForm, ramGB: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] font-semibold"
                    min={2}
                    max={256}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#475569] block mb-1">CPU Cores</label>
                  <input
                    type="number"
                    value={manualForm.cpuCores}
                    onChange={(e) => setManualForm({ ...manualForm, cpuCores: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#475569] block mb-1">GPU VRAM (GB)</label>
                  <input
                    type="number"
                    value={manualForm.vramGB || 6}
                    onChange={(e) => setManualForm({ ...manualForm, vramGB: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">Available Disk Space (GB)</label>
                <input
                  type="number"
                  value={manualForm.diskFreeGB || 80}
                  onChange={(e) => setManualForm({ ...manualForm, diskFreeGB: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveManualHardware}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E]"
                >
                  Save Hardware Profile
                </button>
              </div>
            </div>
          ) : (
            /* Current Profile Metrics Display */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#717784] block font-semibold">OS & Platform</span>
                <span className="text-xs font-bold text-[#111318] mt-0.5 block">{hardware.os}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#717784] block font-semibold">System RAM</span>
                <span className="text-xs font-bold text-teal-700 mt-0.5 block">{hardware.ramGB} GB RAM</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#717784] block font-semibold">CPU Cores</span>
                <span className="text-xs font-bold text-[#111318] mt-0.5 block">{hardware.cpuCores} Threads</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#717784] block font-semibold">WebGPU Acceleration</span>
                <span className={`text-xs font-bold mt-0.5 block ${hardware.webGpuAvailable ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {hardware.webGpuAvailable ? 'Supported' : 'Standard Web'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#717784] block font-semibold">Dedicated VRAM</span>
                <span className="text-xs font-bold text-[#111318] mt-0.5 block">~{hardware.vramGB || 6} GB</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#717784] block font-semibold">Available Storage</span>
                <span className="text-xs font-bold text-[#111318] mt-0.5 block">{hardware.diskFreeGB || 60} GB</span>
              </div>
            </div>
          )}
        </div>

        {/* Local Ollama Integration Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-mono font-bold text-sm">
                OL
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111318]">Ollama Local Inference Server</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-[11px] font-semibold text-[#717784]">
                    {ollamaConnected ? 'Connected & Operational' : 'Not Connected'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckOllama}
              disabled={isCheckingOllama}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#F1F4F8] hover:bg-slate-200 text-[#475569] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={12} className={isCheckingOllama ? 'animate-spin' : ''} />
              Re-check
            </button>
          </div>

          {/* Endpoint Input */}
          <div>
            <label className="text-[11px] font-semibold text-[#475569] block mb-1">
              Ollama Server Endpoint
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ollamaEndpointInput}
                onChange={(e) => setOllamaEndpointInput(e.target.value)}
                placeholder="http://localhost:11434"
                className="flex-1 px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-mono text-[#111318] focus:bg-white focus:outline-hidden focus:border-[#0D9488]"
              />
              <button
                onClick={handleCheckOllama}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E]"
              >
                Test Endpoint
              </button>
            </div>
          </div>

          {/* Connected Models List or Troubleshooting */}
          {ollamaConnected ? (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717784] block">
                Installed Local Models ({localOllamaModels.length})
              </span>
              {localOllamaModels.length > 0 ? (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {localOllamaModels.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#111318]">{m.name}</span>
                        <span className="text-[10px] text-[#717784] ml-2">
                          {(m.size / (1024 * 1024 * 1024)).toFixed(1)} GB
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Ready in RAM
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#717784] italic">
                  Ollama is connected, but no models are downloaded yet. Select a model below to install it.
                </p>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#475569] space-y-2">
              <p className="font-semibold text-slate-800">CORS Setup Guidance for Browser Access:</p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                To allow AquaRoute in your browser to interact with local Ollama, launch Ollama with CORS origins enabled:
              </p>
              <code className="text-[11px] font-mono text-teal-800 bg-white p-2 rounded-lg border border-slate-200 block select-all">
                {hardware.os === 'Windows'
                  ? 'set OLLAMA_ORIGINS="*" && ollama serve'
                  : 'OLLAMA_ORIGINS="*" ollama serve'}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Model Installation Catalogue for Hardware */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#111318]">
              Recommended Local Models for Your System
            </h2>
            <p className="text-xs text-[#717784]">
              Validated memory footprints for {hardware.os} with {hardware.ramGB} GB RAM.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODELS_CATALOGUE.filter((m) => m.isOpenWeight).map((model) => {
            const hwEval = evaluateHardwareCompatibility(model, hardware);

            return (
              <div
                key={model.id}
                className="bg-white rounded-3xl p-5 border border-[#E2E8F0] hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {model.family}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      hwEval.state === 'COMPATIBLE' ? 'bg-emerald-50 text-emerald-700' :
                      hwEval.state === 'COMPATIBLE_WITH_LIMITATIONS' ? 'bg-blue-50 text-blue-700' :
                      hwEval.state === 'POSSIBLE_WITH_QUANTIZATION' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {hwEval.state.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#111318]">{model.name}</h3>
                  <p className="text-[11px] text-[#717784] mt-0.5">
                    {model.parameters} • Download: {model.downloadSizeFormatted} • Needs {model.minRamRequiredGB} GB RAM
                  </p>
                  <p className="text-xs text-[#475569] mt-2 line-clamp-2 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F1F4F8] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedModelForInstall(model)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <Download size={13} />
                    Install Model
                  </button>

                  <button
                    onClick={() => setSelectedModelForColab(model)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                    title="Launch on Google Colab remote GPU"
                  >
                    Colab
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Installation Modals */}
      <InstallModelModal
        model={selectedModelForInstall}
        isOpen={Boolean(selectedModelForInstall)}
        onClose={() => setSelectedModelForInstall(null)}
        hardware={hardware}
        ollamaConnected={ollamaConnected}
        onOpenColab={(m) => setSelectedModelForColab(m)}
        onOpenWorkspace={() => {
          if (selectedModelForInstall) {
            onOpenWorkspaceWithModel(selectedModelForInstall);
          }
        }}
      />

      <ColabGuideModal
        model={selectedModelForColab}
        isOpen={Boolean(selectedModelForColab)}
        onClose={() => setSelectedModelForColab(null)}
      />
    </div>
  );
};
