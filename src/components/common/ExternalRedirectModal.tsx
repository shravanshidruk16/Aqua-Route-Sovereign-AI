'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { OnlineProvider } from '@/types';

interface ExternalRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: OnlineProvider | null;
  userPromptText: string;
}

export const ExternalRedirectModal: React.FC<ExternalRedirectModalProps> = ({
  isOpen,
  onClose,
  provider,
  userPromptText,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !provider) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(userPromptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleProceedToProvider = () => {
    window.open(provider.officialUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ExternalLink size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#111318]">External Cloud Redirection</h2>
              <p className="text-xs text-[#717784]">Leaving AquaRoute Sovereign Perimeter</p>
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

        {/* Destination Info */}
        <div className="mt-4 p-4 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#717784] uppercase tracking-wider">Destination</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Verified Official Domain
            </span>
          </div>
          <p className="text-sm font-bold text-[#111318] mt-1">{provider.name}</p>
          <p className="text-xs text-blue-600 font-mono mt-0.5 break-all">{provider.officialUrl}</p>
          <p className="text-xs text-[#475569] mt-2">{provider.reasonForRecommendation}</p>
        </div>

        {/* Privacy Guard Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-950">Privacy & Data Governance Notice:</span>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              You are leaving AquaRoute to open an external third-party cloud service. Your prompt will <strong>never</strong> be passed in URL query parameters, and no local files or API credentials will be transmitted.
            </p>
          </div>
        </div>

        {/* Prompt Copy Section */}
        {userPromptText && (
          <div className="mt-4">
            <label className="text-xs font-semibold text-[#475569] block mb-1.5">
              Copy Your Prompt to Clipboard First:
            </label>
            <div className="relative">
              <div className="max-h-24 overflow-y-auto p-2.5 rounded-xl bg-[#F1F4F8] text-xs font-mono text-[#334155] border border-[#CBD5E1]">
                {userPromptText}
              </div>
              <button
                onClick={handleCopyPrompt}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-[#111318] hover:bg-slate-50 border border-[#CBD5E1] shadow-2xs flex items-center gap-1.5"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-[#F1F4F8]"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedToProvider}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm flex items-center gap-1.5"
          >
            <span>Open {provider.name}</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
