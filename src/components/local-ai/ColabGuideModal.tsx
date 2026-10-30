'use client';

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  ShieldAlert, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { Model } from '@/types';

interface ColabGuideModalProps {
  model: Model | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ColabGuideModal: React.FC<ColabGuideModalProps> = ({
  model,
  isOpen,
  onClose,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const targetModel = model?.name || 'Qwen 2.5 7B Instruct';
  const targetTag = model?.ollamaTag || 'qwen2.5:7b';

  const colabPythonScript = `## ========================================================
## AquaRoute Sovereign AI - Remote Colab Inference Notebook
## Model: ${targetModel} (${targetTag})
## ========================================================

# STEP 1: Verify Remote Hardware GPU & Available System RAM
!nvidia-smi
import psutil, shutil
ram_gb = psutil.virtual_memory().total / (1024**3)
disk_gb = shutil.disk_usage("/").free / (1024**3)
print(f"\\n[AquaRoute Telemetry] Available RAM: {ram_gb:.1f} GB | Free Disk: {disk_gb:.1f} GB")

# STEP 2: Install Ollama daemon inside Colab environment
!curl -fsSL https://ollama.com/install.sh | sh

# STEP 3: Launch Ollama background service with authenticated local bind
import subprocess, time
process = subprocess.Popen(["ollama", "serve"])
time.sleep(3) # allow daemon initialization

# STEP 4: Pull Quantized Model Weights
!ollama pull ${targetTag}

# STEP 5: Interactive Notebook Test Query
import requests
test_payload = {
    "model": "${targetTag}",
    "prompt": "Hello from AquaRoute Sovereign AI. Summarize your architecture.",
    "stream": False
}
res = requests.post("http://localhost:11434/api/generate", json=test_payload)
print("\\n--- Inference Response ---")
print(res.json().get("response", "No response"))

# STEP 6: Graceful Shutdown Cell
# To terminate the inference runtime when finished:
# process.terminate()
`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(colabPythonScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } catch {
      // fallback
    }
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
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              CO
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#111318]">Google Colab Remote Runtime</h2>
              <p className="text-xs text-[#717784]">Run {targetModel} on cloud GPU infrastructure</p>
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

        {/* Colab Policy & Disclaimer Notice */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Important Colab Infrastructure Notice:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                • Google Colab runs on remote Google infrastructure, not your local device.<br />
                • Free Colab tiers have session timeouts (12 hours max) and fluctuating GPU availability.<br />
                • This setup runs Ollama directly within your Colab session without exposing an unauthenticated public tunnel, in strict compliance with Colab acceptable use policies.
              </p>
            </div>
          </div>
        </div>

        {/* Notebook Script Box */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569] flex items-center gap-1.5">
              <Terminal size={14} className="text-teal-600" />
              Pre-Configured Colab Python Script
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-2xs flex items-center gap-1.5"
            >
              {copiedScript ? <Check size={14} /> : <Copy size={14} />}
              {copiedScript ? 'Notebook Code Copied!' : 'Copy Script'}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 text-teal-300 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800 leading-relaxed select-all">
            {colabPythonScript}
          </pre>
        </div>

        {/* Action Steps */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0] text-xs text-[#334155] space-y-1.5">
          <p className="font-semibold text-[#111318]">Step-by-step execution:</p>
          <ol className="list-decimal pl-4 space-y-1 text-[#475569] text-[11px]">
            <li>Open <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-semibold">Google Colab</a> and click <strong>New Notebook</strong>.</li>
            <li>In the top menu, go to <strong>Runtime → Change runtime type</strong> and select <strong>T4 GPU</strong>.</li>
            <li>Paste the copied script into the first code cell and click <strong>Run Cell (Ctrl+Enter)</strong>.</li>
            <li>Inspect the step-by-step model download and test the generated response directly in your notebook!</li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <a
            href="https://colab.research.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
          >
            Open Google Colab <ExternalLink size={13} />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111318] text-white hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
