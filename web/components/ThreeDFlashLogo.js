'use client';

import React, { memo } from 'react';

function ThreeDFlashLogo({ className = "" }) {
  return (
    <div className={`relative w-28 h-28 flex items-center justify-center shrink-0 select-none ${className}`}>
      {/* Outer Circular Dotted & Hairline Halo Rings */}
      <div className="absolute w-26 h-26 rounded-full border border-dashed border-blue-400/35 pointer-events-none" />
      <div className="absolute w-22 h-22 rounded-full border border-blue-400/25 pointer-events-none" />

      {/* Speed & Motion Lines Extending Left */}
      <div className="absolute -left-5 top-[32%] w-7 h-[2px] bg-gradient-to-r from-transparent to-blue-400/80 rounded-full" />
      <div className="absolute -left-9 top-[44%] w-11 h-[2.5px] bg-gradient-to-r from-transparent via-blue-400 to-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
      <div className="absolute -left-11 top-[56%] w-13 h-[3px] bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full" />
      <div className="absolute -left-6 top-[68%] w-8 h-[2px] bg-gradient-to-r from-transparent to-blue-400/80 rounded-full" />

      {/* Speed & Motion Lines Extending Right */}
      <div className="absolute -right-5 top-[36%] w-6 h-[2px] bg-gradient-to-l from-transparent to-blue-400/70 rounded-full" />
      <div className="absolute -right-8 top-[48%] w-9 h-[2.5px] bg-gradient-to-l from-transparent to-blue-500/80 rounded-full shadow-[0_0_6px_rgba(37,99,235,0.4)]" />
      <div className="absolute -right-4 top-[62%] w-5 h-[2px] bg-gradient-to-l from-transparent to-blue-400/70 rounded-full" />

      {/* 3D Soft Ambient Drop Shadow */}
      <div className="absolute w-15 h-15 bg-blue-950/20 rounded-[20px] translate-y-3.5 blur-md pointer-events-none" />

      {/* 3D Deep Royal Blue Bottom Thickness Plate */}
      <div className="absolute w-15 h-15 bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] rounded-[20px] translate-y-[6px] shadow-md pointer-events-none" />

      {/* 3D Front Glossy Squircle Plate */}
      <div className="relative w-15 h-15 bg-gradient-to-b from-white via-[#F4F8FF] to-[#E6F0FF] rounded-[20px] border border-white/90 shadow-[0_4px_16px_rgba(37,99,235,0.18),inset_0_2px_4px_rgba(255,255,255,1)] flex items-center justify-center z-10">
        
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/5 to-blue-600/10 rounded-[20px] pointer-events-none" />

        {/* Sharp Electric Blue Lightning Bolt */}
        <svg 
          className="w-7.5 h-7.5 text-[#2563EB] fill-[#2563EB] drop-shadow-[0_2px_4px_rgba(37,99,235,0.3)] relative z-10" 
          viewBox="0 0 24 24" 
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>

        {/* Specular Highlight Glint */}
        <div className="absolute top-1.5 left-2 w-3.5 h-1.5 bg-white/90 rounded-full blur-[0.3px] -rotate-12 pointer-events-none" />
      </div>
    </div>
  );
}

export default memo(ThreeDFlashLogo);
