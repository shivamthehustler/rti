'use client';

export default function DashboardBackgroundWave({ className = "" }) {
  // Soft, elegant top-right dotted mesh particle waves
  const ribbon1 = [];
  const ribbon2 = [];
  const ribbon3 = [];
  const count1 = 34;
  const count2 = 28;
  const count3 = 20;

  // Primary undulating top-right ribbon stream
  for (let i = 0; i < count1; i++) {
    const opacity = Math.max(0.10, 0.52 - (i / count1) * 0.38);
    const strokeWidth = 1.15;
    const dash = "1.4 4.4";

    const startX = 340 + i * 16;
    const startY = -80 + i * 7;
    const cp1X = 580 + i * 18;
    const cp1Y = 110 + i * 13;
    const cp2X = 840 + i * 17;
    const cp2Y = -40 + i * 15;
    const cp3X = 1080 + i * 13;
    const cp3Y = 210 + i * 17;
    const endX = 1440 + i * 9;
    const endY = 560 + i * 19;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${cp3X} ${cp3Y} S ${endX - 80} ${endY - 60}, ${endX} ${endY}`;

    ribbon1.push(
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

  // Interweaving crossing secondary ribbon
  for (let j = 0; j < count2; j++) {
    const opacity = Math.max(0.08, 0.42 - (j / count2) * 0.32);
    const strokeWidth = 1.0;
    const dash = "1.2 4.0";

    const startX = 420 + j * 15;
    const startY = 130 + j * 9;
    const cp1X = 710 + j * 17;
    const cp1Y = 20 + j * 15;
    const cp2X = 960 + j * 16;
    const cp2Y = 260 + j * 13;
    const cp3X = 1220 + j * 13;
    const cp3Y = 140 + j * 17;
    const endX = 1490 + j * 9;
    const endY = 660 + j * 15;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${cp3X} ${cp3Y} S ${endX - 60} ${endY - 40}, ${endX} ${endY}`;

    ribbon2.push(
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

  // Outer accent stream
  for (let k = 0; k < count3; k++) {
    const opacity = Math.max(0.06, 0.32 - (k / count3) * 0.24);
    const startX = 600 + k * 19;
    const startY = -50 + k * 9;
    const cp1X = 860 + k * 17;
    const cp1Y = 180 + k * 15;
    const cp2X = 1140 + k * 13;
    const cp2Y = 70 + k * 17;
    const endX = 1540 + k * 9;
    const endY = 460 + k * 19;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

    ribbon3.push(
      <path
        key={`dw-r3-${k}`}
        d={pathData}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={0.9}
        strokeDasharray="1.0 4.6"
        strokeLinecap="round"
        opacity={opacity}
      />
    );
  }

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 rounded-[inherit] ${className}`}
      aria-hidden="true"
    >
      {/* Soft, delicate light blue background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #F0F6FD 0%, #F7FAFE 45%, #ECF3FD 100%)'
        }}
      />

      {/* Subtle Top-Right Soft Blue Aura */}
      <div 
        className="absolute -top-24 -right-24 w-[750px] h-[750px] rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 65% 35%, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.05) 45%, transparent 75%)',
          filter: 'blur(30px)'
        }}
      />

      {/* Top-Right Dotted Wave Pattern Mesh */}
      <div 
        className="absolute -top-12 -right-12 sm:top-0 sm:right-0 w-[600px] sm:w-[800px] md:w-[980px] lg:w-[1200px] h-[520px] sm:h-[700px] md:h-[880px] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at 80% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 78%, transparent 94%)',
          WebkitMaskImage: 'radial-gradient(circle at 80% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 78%, transparent 94%)',
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

      {/* Micro-Dot Security Print Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1D4ED8 1.1px, transparent 1.1px)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
