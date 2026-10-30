'use client';

import React from 'react';
import { 
  Download, 
  Cpu, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  Settings,
  Sparkles,
  ExternalLink,
  Zap
} from 'lucide-react';
import { AquaRouteLogo } from '../brand/AquaRouteLogo';
import { AppView } from './Sidebar';
import { HardwareProfile } from '@/types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  hardware: HardwareProfile;
  ollamaConnected: boolean;
  onOpenInstallModal: () => void;
  isInstallable: boolean;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  hardware,
  ollamaConnected,
  onOpenInstallModal,
  isInstallable,
  isOnline,
}) => {
  const viewTitles: Record<AppView, { title: string; subtitle: string }> = {
    landing: { title: 'AquaRoute Sovereign AI', subtitle: 'Architecture & Overview' },
    dashboard: { title: 'Executive Dashboard', subtitle: 'Your AI. Your Rules.' },
    navigator: { title: 'AI Navigator', subtitle: 'Autonomous Workload & Execution Path Engine' },
    models: { title: 'Model Explorer', subtitle: 'Verified Open-Weight & Frontier Registry' },
    'local-ai': { title: 'Local AI Studio', subtitle: 'Hardware Profiling & Sovereign Runtimes' },
    workspace: { title: 'AI Workspace', subtitle: 'Multi-Path Chat & Telemetry Console' },
    agents: { title: 'Agent Hub', subtitle: 'Sandboxed Autonomous Workflows' },
    benchmarks: { title: 'Model Benchmark Lab', subtitle: 'Independent Multi-Model Evaluation Matrix' },
    metrics: { title: 'Aqua Metrics', subtitle: 'Green AI & Resource Consumption Telemetry' },
    sovereignty: { title: 'Sovereignty Center', subtitle: 'Data Classification & Governance Gateways' },
    developer: { title: 'API Playground', subtitle: 'OpenAI-Compatible Sovereign Endpoints' },
    'api-keys': { title: 'API Key Management', subtitle: 'Developer Tokens & Scopes' },
    usage: { title: 'Usage Analytics', subtitle: 'Request Volume & Compute Telemetry' },
    docs: { title: 'Documentation', subtitle: 'Engineering Guides & Specifications' },
    settings: { title: 'Settings', subtitle: 'System Preferences & Integrations' },
  };

  const currentInfo = viewTitles[currentView] || { title: 'AquaRoute', subtitle: 'Sovereign AI' };

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left: Mobile Brand & View Title */}
      <div className="flex items-center gap-3">
        {/* On mobile, show logo */}
        <div className="lg:hidden">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-1.5 focus:outline-hidden"
          >
            <AquaRouteLogo size="sm" showText={false} />
          </button>
        </div>

        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base font-semibold text-[#111318] flex items-center gap-2">
            {currentInfo.title}
            {currentView === 'navigator' && (
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                ACTIVE ENGINE
              </span>
            )}
          </h1>
          <p className="text-[11px] sm:text-xs text-[#717784] hidden md:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Hardware badge, Ollama status, Install PWA, Online badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Online / Offline status */}
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <WifiOff size={13} className="text-amber-600" />
            <span className="hidden sm:inline">Offline Mode</span>
          </div>
        )}

        {/* Hardware quick pill */}
        <button
          onClick={() => onNavigate('local-ai')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#F8F9FB] hover:bg-[#F1F4F8] border border-[#E2E8F0] text-[#4A5568] transition-colors"
          title="Detected Hardware Profile (Click to view or edit)"
          suppressHydrationWarning
        >
          <Cpu size={14} className="text-[#0D9488]" />
          <span>{hardware.os} • {hardware.ramGB} GB RAM</span>
        </button>

        {/* Groq Cloud LPU status pill */}
        <button
          onClick={() => onNavigate('workspace')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs"
          title="Groq LPU Free Key Connected: openai/gpt-oss-20b & qwen3.8-27b active"
        >
          <Zap size={13} className="text-emerald-600 fill-emerald-500" />
          <span className="hidden sm:inline">Groq LPU: Live</span>
        </button>

        {/* Ollama runtime indicator */}
        <button
          onClick={() => onNavigate('local-ai')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            ollamaConnected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
          title={ollamaConnected ? 'Ollama runtime connected at localhost:11434' : 'Ollama not detected. Click for installation instructions.'}
        >
          <span className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className="hidden sm:inline">{ollamaConnected ? 'Local Ollama: Live' : 'Local AI: Standby'}</span>
        </button>

        {/* PWA Install Button */}
        <button
          onClick={onOpenInstallModal}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-2xs transition-all active:scale-98"
          title="Install AquaRoute as Desktop or Mobile PWA"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Install App</span>
        </button>
      </div>
    </header>
  );
};
