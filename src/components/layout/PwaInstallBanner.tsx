'use client';

import React, { useState } from 'react';
import { Download, X, Smartphone, Monitor, Apple, CheckCircle2, Info } from 'lucide-react';
import { AquaRouteLogo } from '../brand/AquaRouteLogo';

interface PwaInstallBannerProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerNativePrompt?: () => void;
  canPromptNative: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallBannerProps> = ({
  isOpen,
  onClose,
  onTriggerNativePrompt,
  canPromptNative,
}) => {
  const [activeTab, setActiveTab] = useState<'chrome' | 'ios' | 'mac' | 'android'>('chrome');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-scale-up">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <AquaRouteLogo size="sm" showText={false} />
            <div>
              <h2 className="text-base font-semibold text-[#111318]">Install AquaRoute PWA</h2>
              <p className="text-xs text-[#717784]">Run natively with offline access & fast loading</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#717784] hover:bg-[#F1F4F8]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Native 1-click trigger if supported by browser */}
        {canPromptNative && (
          <div className="mt-4 p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-teal-900">Browser Ready</p>
              <p className="text-xs text-teal-700">Install immediately with one click</p>
            </div>
            <button
              onClick={() => {
                onTriggerNativePrompt?.();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm flex items-center gap-1.5"
            >
              <Download size={14} />
              Install Now
            </button>
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div className="mt-4 flex rounded-xl bg-[#F1F4F8] p-1 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('chrome')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'chrome' ? 'bg-white shadow-xs text-[#111318] font-semibold' : 'text-[#717784]'
            }`}
          >
            <Monitor size={14} />
            Windows / PC
          </button>
          <button
            onClick={() => setActiveTab('mac')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'mac' ? 'bg-white shadow-xs text-[#111318] font-semibold' : 'text-[#717784]'
            }`}
          >
            <Apple size={14} />
            macOS
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'android' ? 'bg-white shadow-xs text-[#111318] font-semibold' : 'text-[#717784]'
            }`}
          >
            <Smartphone size={14} />
            Android
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ios' ? 'bg-white shadow-xs text-[#111318] font-semibold' : 'text-[#717784]'
            }`}
          >
            <Apple size={14} />
            iOS
          </button>
        </div>

        {/* Platform Instructions */}
        <div className="mt-4 p-4 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0] text-xs text-[#334155] space-y-2.5">
          {activeTab === 'chrome' && (
            <>
              <p className="font-semibold text-[#111318]">Installing on Windows (Chrome or Edge):</p>
              <ol className="list-decimal pl-4 space-y-1 text-[#475569]">
                <li>Look for the <span className="font-semibold text-teal-700">Install App</span> icon (computer monitor with down arrow) in your browser address bar.</li>
                <li>Click <span className="font-semibold">Install</span> to add AquaRoute to your Start Menu and Desktop taskbar.</li>
                <li>Launches as a standalone window without browser URL tabs.</li>
              </ol>
            </>
          )}

          {activeTab === 'mac' && (
            <>
              <p className="font-semibold text-[#111318]">Installing on macOS (Safari or Chrome):</p>
              <ol className="list-decimal pl-4 space-y-1 text-[#475569]">
                <li>In <strong>Safari</strong>: Click <span className="font-semibold">File</span> → <span className="font-semibold">Add to Dock...</span></li>
                <li>In <strong>Chrome</strong>: Click the three dots (⋮) → <span className="font-semibold">Cast, Save, and Share</span> → <span className="font-semibold">Install AquaRoute AI</span></li>
                <li>AquaRoute will appear as an independent native app in Launchpad and Dock.</li>
              </ol>
            </>
          )}

          {activeTab === 'android' && (
            <>
              <p className="font-semibold text-[#111318]">Installing on Android (Chrome):</p>
              <ol className="list-decimal pl-4 space-y-1 text-[#475569]">
                <li>Tap the three vertical dots (⋮) in the top-right corner of Chrome.</li>
                <li>Select <span className="font-semibold">Add to Home screen</span> or <span className="font-semibold">Install App</span>.</li>
                <li>AquaRoute will install with a native app icon and fullscreen experience.</li>
              </ol>
            </>
          )}

          {activeTab === 'ios' && (
            <>
              <p className="font-semibold text-[#111318]">Installing on iPhone / iPad (Safari):</p>
              <ol className="list-decimal pl-4 space-y-1 text-[#475569]">
                <li>Open this site in <strong>Safari</strong>.</li>
                <li>Tap the <strong>Share</strong> button (box with upward arrow) at the bottom.</li>
                <li>Scroll down and tap <span className="font-semibold text-teal-700">Add to Home Screen</span>.</li>
                <li>Tap <span className="font-semibold">Add</span> in the top right.</li>
              </ol>
            </>
          )}
        </div>

        {/* Offline Disclaimer */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
          <Info size={16} className="text-teal-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800">Offline Capability Notice: </span>
            The cached PWA app shell, saved conversations, and model specs are available offline. However, cloud AI APIs, external redirects, and model downloads require an active internet connection.
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-[#F1F4F8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
