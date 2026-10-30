'use client';

import React, { useEffect } from 'react';
import { 
  MessageSquare, 
  BarChart3, 
  Bot, 
  Droplet, 
  ShieldCheck, 
  Code2, 
  Settings, 
  X, 
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { AppView } from './Sidebar';

interface MoreBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  currentView: AppView;
}

export const MoreBottomSheet: React.FC<MoreBottomSheetProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentView,
}) => {
  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const moreItems = [
    {
      id: 'workspace' as AppView,
      title: 'AI Workspace',
      desc: 'Interactive chat & prompt execution',
      icon: MessageSquare,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      id: 'benchmarks' as AppView,
      title: 'Model Benchmarks',
      desc: 'Compare HumanEval, MMLU & tokens/sec',
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'agents' as AppView,
      title: 'Agent Hub',
      desc: 'Autonomous tools & human approval gates',
      icon: Bot,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'metrics' as AppView,
      title: 'Aqua Metrics',
      desc: 'Real energy, carbon & water tracking',
      icon: Droplet,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      id: 'sovereignty' as AppView,
      title: 'Sovereignty Center',
      desc: 'Privacy policies & immutable audit logs',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'developer' as AppView,
      title: 'API Playground',
      desc: 'REST API, SDKs & token telemetry',
      icon: Code2,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 'docs' as AppView,
      title: 'Documentation',
      desc: 'Architecture, guides & deployment',
      icon: BookOpen,
      color: 'text-slate-600 bg-slate-50',
    },
    {
      id: 'settings' as AppView,
      title: 'Settings',
      desc: 'Hardware specs & Ollama endpoint',
      icon: Settings,
      color: 'text-slate-700 bg-slate-100',
    },
  ];

  const handleSelect = (view: AppView) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl z-10 animate-slide-up safe-pb">
        {/* Grab Handle & Header */}
        <div className="pt-3 pb-2 px-5 border-b border-[#E2E8F0]">
          <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#111318]">AquaRoute Platform</h2>
              <p className="text-xs text-[#717784]">Advanced modules & enterprise tools</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F1F4F8] text-[#717784]"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Items */}
        <div className="p-4 overflow-y-auto space-y-2">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  isActive 
                    ? 'bg-teal-50 border border-teal-200' 
                    : 'bg-[#F8F9FB] hover:bg-[#F1F4F8] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isActive ? 'text-teal-900' : 'text-[#111318]'}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#717784] line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#94A3B8] shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
