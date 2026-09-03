'use client';

import React, { memo } from 'react';

// Precomputed static ribbons at module load for 0ms render latency
const buildRibbons = () => {
  const r1 = [];
  const r2 = [];
  const r3 = [];
  const count1 = 28;
  const count2 = 22;
  const count3 = 16;

  for (let i = 0; i < count1; i++) {
    const opacity = Math.max(0.08, 0.45 - (i / count1) * 0.35);
    const strokeWidth = 1.1;
    const dash = "1.4 4.4";

    const startX = 340 + i * 18;
    const startY = -80 + i * 8;
    const cp1X = 580 + i * 20;
    const cp1Y = 110 + i * 14;
    const cp2X = 840 + i * 18;
    const cp2Y = -40 + i * 16;
    const cp3X = 1080 + i * 14;
    const cp3Y = 210 + i * 18;
    const endX = 1440 + i * 10;
    const endY = 560 + i * 20;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${cp3X} ${cp3Y} S ${endX - 80} ${endY - 60}, ${endX} ${endY}`;

    r1.push(
      <path
        key={`dw-r1-${i}`}
        d={pathData}
        fill="none"
        stroke={i % 2 === 0 ? "#2563EB" : "#3B82F6"}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        opacity={opacity}
      />
    );
  }

  for (let j = 0; j < count2; j++) {
    const opacity = Math.max(0.06, 0.36 - (j / count2) * 0.30);
    const strokeWidth = 0.95;
    const dash = "1.2 4.0";

    const startX = 420 + j * 16;
    const startY = 130 + j * 10;
    const cp1X = 710 + j * 18;
    const cp1Y = 20 + j * 16;
    const cp2X = 960 + j * 17;
    const cp2Y = 260 + j * 14;
    const cp3X = 1220 + j * 14;
    const cp3Y = 140 + j * 18;
    const endX = 1490 + j * 10;
    const endY = 660 + j * 16;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${cp3X} ${cp3Y} S ${endX - 60} ${endY - 40}, ${endX} ${endY}`;

    r2.push(
      <path
        key={`dw-r2-${j}`}
        d={pathData}
        fill="none"
        stroke={j % 2 === 0 ? "#60A5FA" : "#93C5FD"}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        opacity={opacity}
      />
    );
  }

  for (let k = 0; k < count3; k++) {
    const opacity = Math.max(0.05, 0.28 - (k / count3) * 0.22);
    const startX = 600 + k * 20;
    const startY = -50 + k * 10;
    const cp1X = 860 + k * 18;
    const cp1Y = 180 + k * 16;
    const cp2X = 1140 + k * 14;
    const cp2Y = 70 + k * 18;
    const endX = 1540 + k * 10;
    const endY = 460 + k * 20;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

    r3.push(
      <path
        key={`dw-r3-${k}`}
        d={pathData}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={0.85}
        strokeDasharray="1.0 4.6"
        strokeLinecap="round"
        opacity={opacity}
      />
    );
  }

  // Precomputed bottom-complementary flowing ribbon wave
  const bottomRibbons = [];
  const countBottom = 22;
  for (let b = 0; b < countBottom; b++) {
    const opacity = Math.max(0.05, 0.35 - (b / countBottom) * 0.28);
    const strokeWidth = 1.0;
    const dash = "1.3 4.2";

    const startX = 180 + b * 22;
    const startY = 880 + b * 6;
    const cp1X = 460 + b * 18;
    const cp1Y = 620 + b * 14;
    const cp2X = 780 + b * 16;
    const cp2Y = 840 + b * 12;
    const cp3X = 1120 + b * 14;
    const cp3Y = 600 + b * 16;
    const endX = 1480 + b * 10;
    const endY = 820 + b * 14;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${cp3X} ${cp3Y} S ${endX - 70} ${endY - 40}, ${endX} ${endY}`;

    bottomRibbons.push(
      <path
        key={`dw-br-${b}`}
        d={pathData}
        fill="none"
        stroke={b % 2 === 0 ? "#3B82F6" : "#60A5FA"}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        opacity={opacity}
      />
    );
  }

  return { ribbon1: r1, ribbon2: r2, ribbon3: r3, bottomRibbons };
};

const STATIC_RIBBONS = buildRibbons();

function DashboardBackgroundWaveComponent({ className = "" }) {
  const { ribbon1, ribbon2, ribbon3, bottomRibbons } = STATIC_RIBBONS;

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 rounded-[inherit] ${className}`}
      style={{
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Original Light Ice/Sky Blue Delicate Background Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #F0F6FD 0%, #F7FAFE 45%, #ECF3FD 100%)'
        }}
      />

      {/* Top-Right Soft Blue Aura */}
      <div 
        className="absolute -top-24 -right-24 w-[700px] h-[700px] rounded-full pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle at 65% 35%, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.04) 45%, transparent 75%)',
          transform: 'translateZ(0)'
        }}
      />

      {/* Center-Right Soft Flow Aura */}
      <div 
        className="absolute top-1/3 -right-20 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.02) 45%, transparent 75%)',
          transform: 'translateZ(0)'
        }}
      />

      {/* Bottom-Right Soft Blue Aura */}
      <div 
        className="absolute -bottom-28 -right-28 w-[650px] h-[650px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.02) 50%, transparent 80%)',
          transform: 'translateZ(0)'
        }}
      />

      {/* Bottom-Left Soft Azure Aura */}
      <div 
        className="absolute -bottom-24 -left-24 w-[550px] h-[550px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.06) 0%, rgba(37, 99, 235, 0.02) 50%, transparent 75%)',
          transform: 'translateZ(0)'
        }}
      />

      {/* Top-Right Dotted Wave Pattern Mesh */}
      <div 
        className="absolute -top-12 -right-12 sm:top-0 sm:right-0 w-[600px] sm:w-[850px] md:w-[1050px] lg:w-[1300px] h-[600px] sm:h-[800px] md:h-[1000px] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at 80% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.25) 80%, transparent 98%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 80% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.25) 80%, transparent 98%)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMaxYMin meet"
        >
          <g>{ribbon1}</g>
          <g>{ribbon2}</g>
          <g>{ribbon3}</g>
        </svg>
      </div>

      {/* Bottom-Right Dotted Wave Pattern Mesh */}
      <div 
        className="absolute -bottom-16 -right-12 sm:bottom-0 sm:right-0 w-[600px] sm:w-[850px] md:w-[1050px] lg:w-[1300px] h-[450px] sm:h-[600px] md:h-[750px] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at 80% 80%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.25) 80%, transparent 98%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 80% 80%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.25) 80%, transparent 98%)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMaxYMax meet"
        >
          <g>{bottomRibbons}</g>
        </svg>
      </div>

      {/* Micro-Dot Security Print Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1D4ED8 1.1px, transparent 1.1px)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}

export default memo(DashboardBackgroundWaveComponent);


