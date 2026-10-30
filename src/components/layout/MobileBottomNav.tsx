'use client';

import React from 'react';
import { Home, Cpu, Compass, HardDrive, MoreHorizontal } from 'lucide-react';
import { AppView } from './Sidebar';

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenMore: () => void;
  isMoreOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenMore,
  isMoreOpen,
}) => {
  const navTabs = [
    { id: 'dashboard' as AppView, label: 'Home', icon: Home },
    { id: 'models' as AppView, label: 'Discover', icon: Cpu },
    { id: 'navigator' as AppView, label: 'Navigator', icon: Compass, isCentral: true },
    { id: 'local-ai' as AppView, label: 'Local AI', icon: HardDrive },
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg safe-pb"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id && !isMoreOpen;

          if (tab.isCentral) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center justify-center relative -top-3 group"
                aria-label={tab.label}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                  isActive 
                    ? 'bg-[#0D9488] text-white shadow-teal-500/25 ring-4 ring-teal-50' 
                    : 'bg-[#111318] text-white'
                }`}>
                  <Icon size={22} />
                </div>
                <span className={`text-[10px] font-semibold mt-1 ${isActive ? 'text-[#0D9488]' : 'text-[#717784]'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors ${
                isActive ? 'text-[#0D9488]' : 'text-[#717784] hover:text-[#111318]'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[#0D9488]' : 'text-[#717784]'} />
              <span className={`text-[11px] font-medium mt-1 ${isActive ? 'font-semibold text-[#0D9488]' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 5th Button: More */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors ${
            isMoreOpen ? 'text-[#0D9488]' : 'text-[#717784] hover:text-[#111318]'
          }`}
          aria-label="More navigation options"
        >
          <MoreHorizontal size={20} className={isMoreOpen ? 'text-[#0D9488]' : 'text-[#717784]'} />
          <span className={`text-[11px] font-medium mt-1 ${isMoreOpen ? 'font-semibold text-[#0D9488]' : ''}`}>
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
