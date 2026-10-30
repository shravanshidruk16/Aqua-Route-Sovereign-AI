'use client';

import React from 'react';
import { WifiOff, CheckCircle2, AlertTriangle } from 'lucide-react';

interface OfflineNoticeProps {
  isOnline: boolean;
}

export const OfflineNotice: React.FC<OfflineNoticeProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm z-30">
      <div className="flex items-center gap-2">
        <WifiOff size={16} className="shrink-0" />
        <span className="font-semibold">Offline Mode Active:</span>
        <span className="text-amber-100">
          Running from cached PWA service worker. Local models, cached catalog, and saved chats remain accessible.
        </span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-amber-100">
        <span className="flex items-center gap-1">
          <CheckCircle2 size={13} className="text-emerald-300" /> Local Studio
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 size={13} className="text-emerald-300" /> Offline Navigator
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle size={13} className="text-amber-200" /> Cloud APIs Paused
        </span>
      </div>
    </div>
  );
};
