'use client';

export default function ThreeDFlashLogo({ className = "" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer Fast Energy Rings */}
      <div className="absolute -inset-4 rounded-full border border-blue-400/25 animate-[spin_12s_linear_infinite] pointer-events-none" />
      <div className="absolute -inset-2 rounded-full border border-dashed border-blue-500/35 animate-[spin_8s_linear_infinite_reverse] pointer-events-none" />

      {/* Speed & Motion Lines Extending Left */}
      <div className="absolute -left-6 top-[28%] w-6 h-[2px] bg-gradient-to-r from-transparent to-blue-500/80 rounded-full" />
      <div className="absolute -left-10 top-[45%] w-10 h-[2.5px] bg-gradient-to-r from-transparent to-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
      <div className="absolute -left-12 top-[58%] w-12 h-[3px] bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full" />
      <div className="absolute -left-7 top-[72%] w-7 h-[2px] bg-gradient-to-r from-transparent to-blue-500/80 rounded-full" />

      {/* Speed & Motion Lines Extending Right */}
      <div className="absolute -right-6 top-[32%] w-6 h-[2px] bg-gradient-to-l from-transparent to-blue-400/60 rounded-full" />
      <div className="absolute -right-9 top-[52%] w-9 h-[2.5px] bg-gradient-to-l from-transparent to-blue-500/70 rounded-full" />
      <div className="absolute -right-5 top-[68%] w-5 h-[2px] bg-gradient-to-l from-transparent to-blue-400/60 rounded-full" />

      {/* 3D Deep Shadow Plate */}
      <div className="absolute w-16 h-16 bg-blue-950/25 rounded-2xl translate-y-3 blur-md transform rotate-6" />

      {/* 3D Deep Bottom Thickness Plate */}
      <div className="absolute w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl translate-y-[5px] shadow-lg transform rotate-3" />

      {/* 3D Main Front Plate with Glassmorphism & Metallic Lighting */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl border-t-2 border-l-2 border-white/90 border-r border-b border-blue-200/60 flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.22),inset_0_2px_4px_rgba(255,255,255,1)] transform hover:scale-105 transition-transform duration-300">
        
        {/* Ambient Inner Center Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-blue-600/15 rounded-2xl" />

        {/* 3D Lightning Bolt SVG with Glow */}
        <svg 
          className="w-8 h-8 text-[#2563EB] drop-shadow-[0_2px_8px_rgba(37,99,235,0.45)] relative z-10" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>

        {/* Highlight Specular Glint */}
        <div className="absolute top-1.5 left-2 w-3 h-1.5 bg-white/80 rounded-full blur-[0.5px] transform -rotate-12" />
      </div>
    </div>
  );
}
