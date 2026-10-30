'use client';

import React from 'react';
import { 
  Home, 
  Compass, 
  Cpu, 
  HardDrive, 
  MessageSquare, 
  Bot, 
  BarChart3, 
  Droplet, 
  ShieldCheck, 
  Code2, 
  KeyRound, 
  Activity, 
  BookOpen, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AquaRouteLogo } from '../brand/AquaRouteLogo';

export type AppView = 
  | 'landing'
  | 'dashboard' 
  | 'navigator' 
  | 'models' 
  | 'local-ai' 
  | 'workspace' 
  | 'agents' 
  | 'benchmarks' 
  | 'metrics' 
  | 'sovereignty' 
  | 'developer' 
  | 'api-keys' 
  | 'usage' 
  | 'docs' 
  | 'settings';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  ollamaConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  ollamaConnected,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as AppView, label: 'Overview', icon: Home },
    { id: 'navigator' as AppView, label: 'AI Navigator', icon: Compass, badge: 'Core' },
    { id: 'models' as AppView, label: 'Model Explorer', icon: Cpu },
    { id: 'local-ai' as AppView, label: 'Local AI Studio', icon: HardDrive },
    { id: 'workspace' as AppView, label: 'AI Workspace', icon: MessageSquare },
    { id: 'agents' as AppView, label: 'Agent Hub', icon: Bot },
    { id: 'benchmarks' as AppView, label: 'Benchmark Lab', icon: BarChart3 },
    { id: 'metrics' as AppView, label: 'Aqua Metrics', icon: Droplet },
    { id: 'sovereignty' as AppView, label: 'Sovereignty Center', icon: ShieldCheck },
  ];

  const devNavItems = [
    { id: 'developer' as AppView, label: 'API Playground', icon: Code2 },
    { id: 'api-keys' as AppView, label: 'API Keys', icon: KeyRound },
    { id: 'usage' as AppView, label: 'Usage Analytics', icon: Activity },
    { id: 'docs' as AppView, label: 'Documentation', icon: BookOpen },
  ];

  return (
    <aside 
      className={`hidden lg:flex flex-col border-r border-[#E2E8F0] bg-[#FFFFFF] transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Desktop Sidebar"
    >
      {/* Header / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity"
          title="Back to Landing Page"
        >
          <AquaRouteLogo size="sm" showText={!isCollapsed} />
        </button>

        <button 
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#717784] hover:bg-[#F1F4F8] hover:text-[#111318] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#717784]">
              Platform
            </p>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs'
                      : 'text-[#4A5568] hover:bg-[#F8F9FB] hover:text-[#111318]'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon 
                    size={19} 
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[#0D9488]' : 'text-[#717784]'
                    }`} 
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[#0D9488] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Developer Section */}
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#717784]">
              Developer
            </p>
          )}
          <nav className="space-y-1">
            {devNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs'
                      : 'text-[#4A5568] hover:bg-[#F8F9FB] hover:text-[#111318]'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon 
                    size={19} 
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[#0D9488]' : 'text-[#717784]'
                    }`} 
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Runtime Connection Indicator & Settings */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#FAFAFC] space-y-2">
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${ollamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#111318]">
                  {ollamaConnected ? 'Ollama Online' : 'Local Standby'}
                </span>
                <span className="text-[10px] text-[#717784]">
                  {ollamaConnected ? 'localhost:11434' : 'Click to configure'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('local-ai')}
              className="text-[11px] font-medium text-teal-700 hover:text-teal-800 hover:underline"
            >
              Setup
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span 
              className={`w-3 h-3 rounded-full ${ollamaConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} 
              title={ollamaConnected ? 'Ollama Online' : 'Local Standby'} 
            />
          </div>
        )}

        <button
          onClick={() => onNavigate('settings')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'settings'
              ? 'bg-teal-50 text-teal-800 font-semibold'
              : 'text-[#4A5568] hover:bg-white hover:text-[#111318]'
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <Settings size={19} className="shrink-0 text-[#717784]" />
          {!isCollapsed && <span className="flex-1 text-left">Settings</span>}
        </button>
      </div>
    </aside>
  );
};
