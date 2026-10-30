import React from 'react';

interface AquaRouteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AquaRouteLogo: React.FC<AquaRouteLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 24, font: 'text-base', sub: 'text-[9px]' },
    md: { icon: 32, font: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 42, font: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 56, font: 'text-3xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-sm"
        style={{ width: current.icon, height: current.icon }}
      >
        <svg viewBox="0 0 512 512" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#14B8A6"/>
              <stop offset="50%" stopColor="#0D9488"/>
              <stop offset="100%" stopColor="#2563EB"/>
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect width="512" height="512" rx="112" fill="#0F172A"/>
          {/* Subtle neural background circuits */}
          <path d="M100 256 H180 L220 296 V370" stroke="#334155" strokeWidth="12" strokeLinecap="round"/>
          <path d="M412 256 H332 L292 216 V142" stroke="#334155" strokeWidth="12" strokeLinecap="round"/>
          {/* Droplet Body */}
          <path 
            d="M256 84 C256 84 150 216 150 310 C150 370 198 418 256 418 C314 418 362 370 362 310 C362 216 256 84 256 84 Z" 
            fill="url(#logoGrad)" 
            filter="url(#logoGlow)"
          />
          {/* Neural Route pathways */}
          <path d="M256 160 V260 M256 260 L204 316 M256 260 L308 316" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="256" cy="160" r="16" fill="#FFFFFF"/>
          <circle cx="256" cy="260" r="14" fill="#FFFFFF"/>
          <circle cx="204" cy="316" r="16" fill="#A7F3D0"/>
          <circle cx="308" cy="316" r="16" fill="#BFDBFE"/>
          <circle cx="256" cy="260" r="7" fill="#0D9488"/>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col select-none leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold tracking-tight text-[#111318] ${current.font}`}>
              Aqua<span className="text-[#0D9488]">Route</span>
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-teal-50 text-teal-700 border border-teal-200">
              SOVEREIGN
            </span>
          </div>
          <span className={`font-medium text-[#717784] tracking-wider uppercase mt-0.5 ${current.sub}`}>
            AI Routing Infrastructure
          </span>
        </div>
      )}
    </div>
  );
};
