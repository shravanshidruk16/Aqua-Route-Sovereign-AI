'use client';

import React from 'react';
import { 
  Compass, 
  HardDrive, 
  Cpu, 
  ShieldCheck, 
  Droplet, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Terminal, 
  Sparkles, 
  Activity, 
  BarChart3, 
  Code2,
  ExternalLink
} from 'lucide-react';
import { AquaRouteLogo } from '../brand/AquaRouteLogo';
import { AppView } from '../layout/Sidebar';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  onOpenInstallModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenInstallModal,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] text-[#111318]">
      {/* Hero Navigation Bar */}
      <nav className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <AquaRouteLogo size="md" />

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#4A5568]">
          <button onClick={() => onNavigate('navigator')} className="hover:text-[#0D9488] transition-colors">
            AI Navigator
          </button>
          <button onClick={() => onNavigate('models')} className="hover:text-[#0D9488] transition-colors">
            Model Registry
          </button>
          <button onClick={() => onNavigate('local-ai')} className="hover:text-[#0D9488] transition-colors">
            Local AI Studio
          </button>
          <button onClick={() => onNavigate('benchmarks')} className="hover:text-[#0D9488] transition-colors">
            Benchmark Lab
          </button>
          <button onClick={() => onNavigate('metrics')} className="hover:text-[#0D9488] transition-colors">
            Aqua Metrics
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111318] text-white hover:bg-black transition-all shadow-2xs"
          >
            Launch Console
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-16 pb-20 max-w-6xl mx-auto w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs animate-pulse-glow">
          <Sparkles size={14} className="text-[#0D9488]" />
          <span>Next-Generation Sovereign AI Traffic Controller</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#111318] tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Every AI Model Has a Purpose. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D9488] to-[#2563EB]">
            AquaRoute Finds Yours.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#717784] max-w-2xl mx-auto leading-relaxed">
          Discover, compare, and execute AI workloads through the most suitable local, private, or cloud AI environment with hardware-aware routing and sustainability metrics.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('navigator')}
            className="px-6 py-3.5 rounded-2xl text-sm font-semibold bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all active:scale-98"
          >
            <Compass size={18} />
            <span>Explore AI Navigator</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => onNavigate('local-ai')}
            className="px-6 py-3.5 rounded-2xl text-sm font-semibold bg-white hover:bg-slate-50 text-[#111318] border border-[#CBD5E1] shadow-2xs flex items-center gap-2 transition-all active:scale-98"
          >
            <HardDrive size={18} className="text-[#0D9488]" />
            <span>Discover Local AI</span>
          </button>
        </div>

        {/* Interactive Architecture Illustration */}
        <div className="pt-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E2E8F0] relative overflow-hidden">
            <div className="text-left mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">
                Routing Architecture Diagram
              </span>
              <h2 className="text-lg font-bold text-[#111318] mt-0.5">
                Multi-Stage Decision Pipeline
              </h2>
            </div>

            {/* Pipeline Stage Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] space-y-1.5 text-center">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white mx-auto flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span className="font-bold text-[#111318] block">User Workload</span>
                <p className="text-[11px] text-[#717784]">Prompt, task intent, context size & data sensitivity</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5 text-center">
                <span className="w-7 h-7 rounded-full bg-[#0D9488] text-white mx-auto flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span className="font-bold text-teal-950 block">Sovereign Gate</span>
                <p className="text-[11px] text-teal-800">Hard privacy lock: Air-gapped vs approved egress</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] space-y-1.5 text-center">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white mx-auto flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span className="font-bold text-[#111318] block">Hardware Feasibility</span>
                <p className="text-[11px] text-[#717784]">Evaluates RAM, VRAM, KV cache & safety margin</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] space-y-1.5 text-center">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white mx-auto flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <span className="font-bold text-[#111318] block">Pareto Scoring</span>
                <p className="text-[11px] text-[#717784]">Weights Quality, Latency, Cost, Energy & Water</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5 text-center">
                <span className="w-7 h-7 rounded-full bg-[#2563EB] text-white mx-auto flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <span className="font-bold text-blue-950 block">Target Execution</span>
                <p className="text-[11px] text-blue-800">Ollama Local, Private Cluster, or Cloud Frontier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-6 sm:px-12 py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              Why AquaRoute
            </span>
            <h2 className="text-3xl font-extrabold text-[#111318]">
              Engineered for Sovereignty, Efficiency & Quality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#F8F9FB] border border-[#E2E8F0] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-base font-bold text-[#111318]">Data Sovereignty Guarantee</h3>
              <p className="text-xs text-[#717784] leading-relaxed">
                Confidential data stays on-premise or on your local machine. Never risk enterprise IP leakage to public frontier APIs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8F9FB] border border-[#E2E8F0] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Cpu size={22} />
              </div>
              <h3 className="text-base font-bold text-[#111318]">Hardware-Aware Intelligence</h3>
              <p className="text-xs text-[#717784] leading-relaxed">
                Evaluates system RAM, VRAM, and KV cache overhead so your machine never experiences out-of-memory freeze-ups.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8F9FB] border border-[#E2E8F0] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Droplet size={22} />
              </div>
              <h3 className="text-base font-bold text-[#111318]">Green AI & Water Footprint</h3>
              <p className="text-xs text-[#717784] leading-relaxed">
                Measure energy kilowatt-hours and water milliliters used by hyperscale data center cooling towers versus local execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="px-6 sm:px-12 py-16 max-w-5xl mx-auto w-full text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111318]">
          Ready to Route Your AI Workloads?
        </h2>
        <p className="text-xs sm:text-sm text-[#717784] max-w-md mx-auto">
          Start executing tasks through the optimal execution path on desktop or mobile PWA.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 rounded-2xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm flex items-center gap-2"
          >
            <span>Open Executive Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};
