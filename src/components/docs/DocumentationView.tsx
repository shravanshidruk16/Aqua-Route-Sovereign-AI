'use client';

import React from 'react';
import { 
  BookOpen, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Droplet, 
  HardDrive, 
  Layers, 
  ExternalLink,
  Code2
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          <BookOpen size={13} className="text-slate-600" />
          <span>Architecture & Engineering Manual</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          AquaRoute System Documentation
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Comprehensive reference for the AquaRoute Sovereign AI routing engine, hardware profiler, local runtimes, and Netlify deployment specifications.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E2E8F0] space-y-8 text-xs text-[#334155] leading-relaxed">
        {/* Section 1: Overview */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#111318] flex items-center gap-2">
            <Layers size={17} className="text-teal-600" />
            1. Platform Architectural Overview
          </h2>
          <p>
            AquaRoute is an intelligent AI infrastructure routing engine designed to decouple user workloads from single-provider lock-in. Instead of forcing every query to costly proprietary cloud endpoints, AquaRoute dynamically evaluates user intent, data sensitivity, local device hardware, and environmental resource footprints to dispatch the workload to its optimal execution path.
          </p>
        </div>

        {/* Section 2: Routing Engine Stages */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#111318] flex items-center gap-2">
            <Cpu size={17} className="text-teal-600" />
            2. Multi-Stage Routing Engine Pipeline
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Workload Intent & Complexity Analysis:</strong> Evaluates prompt length, syntactic structure, keywords (coding, reasoning, math, documents, vision), and estimated token volume.
            </li>
            <li>
              <strong>Hard Sovereignty Gate:</strong> Evaluates data sensitivity (PUBLIC, INTERNAL, CONFIDENTIAL, HIGHLY SENSITIVE). A task marked CONFIDENTIAL strictly blocks cloud transmission; no model can override this gate.
            </li>
            <li>
              <strong>Hardware Feasibility Filter:</strong> Evaluates client device memory using conservative safety margins (model Q4 weights + 2.0 GB OS and KV cache overhead buffer).
            </li>
            <li>
              <strong>Pareto Multi-Objective Optimization:</strong> Balances capability benchmark scores against monetary cost, tokens/second latency, and environmental water footprints.
            </li>
            <li>
              <strong>Explainable Transparent Output:</strong> Generates rationale explaining both why the top model was recommended and why rejected models were excluded.
            </li>
          </ol>
        </div>

        {/* Section 3: Local AI & Ollama Integration */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#111318] flex items-center gap-2">
            <HardDrive size={17} className="text-teal-600" />
            3. Local Runtime & Ollama Integration
          </h2>
          <p>
            Local inference is executed via Ollama (<a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-semibold">ollama.com</a>). Due to browser security sandboxing, web applications cannot spawn background OS daemon processes. To allow browser communication with localhost:
          </p>
          <div className="p-3 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] space-y-1">
            <p># Windows (cmd / powershell):</p>
            <p>set OLLAMA_ORIGINS=&quot;*&quot; &amp;&amp; ollama serve</p>
            <p className="pt-1"># macOS / Linux:</p>
            <p>OLLAMA_ORIGINS=&quot;*&quot; ollama serve</p>
          </div>
        </div>

        {/* Section 4: Netlify Deployment */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#111318] flex items-center gap-2">
            <Code2 size={17} className="text-teal-600" />
            4. Netlify Deployment Architecture
          </h2>
          <p>
            AquaRoute is engineered for frictionless hosting on Netlify. The frontend and installable PWA are built as static or serverless Next.js artifacts with Service Worker caching. The Python FastAPI backend reference is isolated in <code>/backend</code> for standalone containerized deployment on private server clusters.
          </p>
        </div>
      </div>
    </div>
  );
};
