import React, { memo } from "react";
import { EmblemIcon } from "./Icons";

// Precomputed static SVG paths & circles at module scope (0ms render overhead)
const buildStaticIconArcs = () => {
  const iconArcs = [];
  const arcCount = 14;
  for (let j = 0; j < arcCount; j++) {
    const r = 12 + j * 6;
    const circleOpacity = Math.max(0.12, 0.44 - (j / arcCount) * 0.26);
    iconArcs.push(
      <circle
        key={`ia-${j}`}
        cx="2"
        cy="98"
        r={r}
        fill="none"
        stroke={j % 2 === 0 ? "#3B82F6" : "#60A5FA"}
        strokeWidth={0.7}
        strokeDasharray="0.8 3.2"
        strokeLinecap="round"
        opacity={circleOpacity}
      />
    );
  }
  return iconArcs;
};

const buildStaticCardArcs = () => {
  const topLeftArcs = [];
  const bottomRightArcs = [];
  const count = 12;

  for (let j = 0; j < count; j++) {
    const r = 16 + j * 9;
    const circleOpacity = Math.max(0.08, 0.40 - (j / count) * 0.28);
    topLeftArcs.push(
      <circle
        key={`tla-${j}`}
        cx="-10"
        cy="-10"
        r={r}
        fill="none"
        stroke={j % 2 === 0 ? "#3B82F6" : "#60A5FA"}
        strokeWidth={0.95}
        strokeDasharray="1.2 4"
        strokeLinecap="round"
        opacity={circleOpacity}
      />
    );
    bottomRightArcs.push(
      <circle
        key={`bra-${j}`}
        cx="190"
        cy="190"
        r={r}
        fill="none"
        stroke={j % 2 === 0 ? "#3B82F6" : "#60A5FA"}
        strokeWidth={0.95}
        strokeDasharray="1.2 4"
        strokeLinecap="round"
        opacity={circleOpacity}
      />
    );
  }
  return { topLeftArcs, bottomRightArcs };
};

const buildStaticSectionArcs = () => {
  const topLeftArcs = [];
  const bottomRightArcs = [];
  const arcCount = 18;

  for (let j = 0; j < arcCount; j++) {
    const r = 30 + j * 18;
    const arcOpacity = Math.max(0.08, 0.42 - (j / arcCount) * 0.28);
    const strokeWidth = 1.05;
    const dash = "1.2 4.5";

    topLeftArcs.push(
      <circle
        key={`stla-${j}`}
        cx="-15"
        cy="-15"
        r={r}
        fill="none"
        stroke={j % 2 === 0 ? "#3B82F6" : "#60A5FA"}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        opacity={arcOpacity}
      />
    );
    bottomRightArcs.push(
      <circle
        key={`sbra-${j}`}
        cx="415"
        cy="415"
        r={r}
        fill="none"
        stroke={j % 2 === 0 ? "#3B82F6" : "#60A5FA"}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        opacity={arcOpacity}
      />
    );
  }
  return { topLeftArcs, bottomRightArcs };
};

const buildStaticFullHero = () => {
  const wavePaths = [];
  const arcPaths = [];
  const count = 38;

  for (let i = 0; i < count; i++) {
    const pathOpacity = Math.max(0.10, 0.58 - (i / count) * 0.45);
    const strokeWidth = 1.25;
    const dash = "1.5 5.5";

    const startX = -110 + i * 6;
    const startY = 90 + i * 9;
    const cp1X = 90 + i * 11;
    const cp1Y = -10 + i * 11;
    const cp2X = 170 + i * 12;
    const cp2Y = 210 + i * 8;
    const endX = 340 + i * 14;
    const endY = 460 + i * 4;

    const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

    wavePaths.push(
      <path
        key={`w-${i}`}
        d={pathData}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        opacity={pathOpacity}
      />
    );
  }

  for (let j = 0; j < 30; j++) {
    const r = 90 + j * 14;
    const circleOpacity = Math.max(0.08, 0.50 - (j / 30) * 0.40);
    arcPaths.push(
      <circle
        key={`a-${j}`}
        cx="-80"
        cy="270"
        r={r}
        fill="none"
        stroke="#60A5FA"
        strokeWidth={1.2}
        strokeDasharray="1.5 5.5"
        strokeLinecap="round"
        opacity={circleOpacity}
      />
    );
  }
  return { wavePaths, arcPaths };
};

const STATIC_ICON_ARCS = buildStaticIconArcs();
const STATIC_CARD_ARCS = buildStaticCardArcs();
const STATIC_SECTION_ARCS = buildStaticSectionArcs();
const STATIC_FULL_HERO = buildStaticFullHero();

function DottedWaveComponent({ 
  className = "", 
  opacity,
  hideEmblem = false,
  variant = "full"
}) {
  if (variant === "icon") {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[inherit] ${className}`}
        style={{
          contain: 'strict',
          transform: 'translateZ(0)',
          willChange: 'transform',
          ...(opacity !== undefined ? { opacity } : {})
        }}
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.75) 0%, rgba(235,244,254,0.30) 65%, transparent 100%)'
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: 'blur(0.4px)',
            maskImage:
              'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.90) 55%, rgba(0,0,0,0.25) 75%, transparent 88%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.90) 55%, rgba(0,0,0,0.25) 75%, transparent 88%)',
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <g>{STATIC_ICON_ARCS}</g>
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    const { topLeftArcs, bottomRightArcs } = STATIC_CARD_ARCS;
    return (
      <div 
        className={`absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[inherit] ${className}`}
        style={{
          contain: 'strict',
          transform: 'translateZ(0)',
          willChange: 'transform',
          ...(opacity !== undefined ? { opacity } : {})
        }}
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.75) 0%, rgba(235,244,254,0.35) 60%, rgba(225,238,253,0.15) 100%)'
          }}
        />
        <div 
          className="absolute -top-3 -left-3 w-[150px] h-[150px] pointer-events-none"
          style={{
            filter: 'blur(0.35px)',
            maskImage:
              'radial-gradient(circle at 0% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 0% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 180 180">
            <g>{topLeftArcs}</g>
          </svg>
        </div>
        <div 
          className="absolute -bottom-3 -right-3 w-[150px] h-[150px] pointer-events-none"
          style={{
            filter: 'blur(0.35px)',
            maskImage:
              'radial-gradient(circle at 100% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 100% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 180 180">
            <g>{bottomRightArcs}</g>
          </svg>
        </div>
        <div 
          className="absolute inset-0 opacity-[0.025] z-0"
          style={{
            backgroundImage: `radial-gradient(#2563EB 1px, transparent 1px)`,
            backgroundSize: '18px 18px'
          }}
        />
      </div>
    );
  }

  if (variant === "section-feathered") {
    const { topLeftArcs, bottomRightArcs } = STATIC_SECTION_ARCS;
    return (
      <div 
        className={`absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[inherit] ${className}`}
        style={{
          contain: 'strict',
          transform: 'translateZ(0)',
          willChange: 'transform',
          ...(opacity !== undefined ? { opacity } : {})
        }}
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.80) 0%, rgba(235,244,254,0.40) 60%, rgba(225,238,253,0.2) 100%)'
          }}
        />
        <div 
          className="absolute -top-12 -left-12 sm:-top-8 sm:-left-8 md:-top-4 md:-left-4 w-[380px] h-[380px] pointer-events-none"
          style={{
            filter: 'blur(0.35px)',
            maskImage:
              'radial-gradient(circle at 0% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 0% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <g>{topLeftArcs}</g>
          </svg>
        </div>
        <div 
          className="absolute -bottom-12 -right-12 sm:-bottom-8 sm:-right-8 md:-bottom-4 md:-right-4 w-[380px] h-[380px] pointer-events-none"
          style={{
            filter: 'blur(0.35px)',
            maskImage:
              'radial-gradient(circle at 100% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 100% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2) 75%, transparent 92%)',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <g>{bottomRightArcs}</g>
          </svg>
        </div>
        <div 
          className="absolute inset-0 opacity-[0.025] z-0"
          style={{
            backgroundImage: `radial-gradient(#0B1C3F 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
    );
  }

  const { wavePaths, arcPaths } = STATIC_FULL_HERO;

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[inherit] ${className}`}
      style={{
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'transform',
        ...(opacity !== undefined ? { opacity } : {})
      }}
    >
      {!hideEmblem && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <EmblemIcon className="w-[420px] h-[480px] text-[#0B1C3F] opacity-[0.03] select-none -translate-y-6" />
        </div>
      )}

      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(235,244,254,0.45) 60%, rgba(225,238,253,0.3) 100%)'
        }}
      />

      <div 
        className="absolute -top-20 -left-28 sm:-top-14 sm:-left-20 md:top-0 md:left-0 w-[440px] h-[480px] sm:w-[500px] sm:h-[520px] md:w-[580px] md:h-[600px] pointer-events-none"
        style={{ width: 'min(580px, 100%)', height: 'min(600px, 100%)' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 600 600"
          fill="none"
          preserveAspectRatio="xMinYMid slice"
          style={{
            width: '100%',
            height: '100%',
            maskImage:
              'radial-gradient(ellipse at 0% 32%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 0% 32%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)',
          }}
        >
          <g>{arcPaths}</g>
          <g>{wavePaths}</g>
        </svg>
      </div>

      <div 
        className="absolute -bottom-10 -right-24 sm:-bottom-12 sm:-right-20 md:bottom-0 md:right-0 w-[440px] h-[480px] sm:w-[500px] sm:h-[520px] md:w-[580px] md:h-[600px] pointer-events-none transform scale-x-[-1] scale-y-[-1]"
        style={{ width: 'min(580px, 100%)', height: 'min(600px, 100%)' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 600 600"
          fill="none"
          preserveAspectRatio="xMinYMax slice"
          style={{
            width: '100%',
            height: '100%',
            maskImage:
              'radial-gradient(ellipse at 0% 32%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 0% 32%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)',
          }}
        >
          <g>{arcPaths}</g>
          <g>{wavePaths}</g>
        </svg>
      </div>

      <div 
        className="absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(#0B1C3F 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  );
}

export default memo(DottedWaveComponent);
