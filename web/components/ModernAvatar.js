'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

const sizeMap = {
  xs: {
    container: 'w-8 h-8',
    avatarSize: 32,
    badge: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    badgeIcon: 'w-2 h-2',
    ring: 'ring-1.5',
    glow: 'shadow-[0_0_8px_rgba(30,58,138,0.4)]',
  },
  sm: {
    container: 'w-9.5 h-9.5',
    avatarSize: 38,
    badge: 'w-4 h-4 -bottom-0.5 -right-0.5',
    badgeIcon: 'w-2.5 h-2.5',
    ring: 'ring-2',
    glow: 'shadow-[0_0_12px_rgba(37,99,235,0.3)]',
  },
  md: {
    container: 'w-12 h-12',
    avatarSize: 48,
    badge: 'w-4.5 h-4.5 -bottom-1 -right-1',
    badgeIcon: 'w-3 h-3',
    ring: 'ring-2',
    glow: 'shadow-[0_0_16px_rgba(37,99,235,0.35)]',
  },
  lg: {
    container: 'w-16 h-16',
    avatarSize: 64,
    badge: 'w-5.5 h-5.5 -bottom-1 -right-1',
    badgeIcon: 'w-3.5 h-3.5',
    ring: 'ring-2.5',
    glow: 'shadow-[0_0_20px_rgba(37,99,235,0.4)]',
  },
  xl: {
    container: 'w-24 h-24',
    avatarSize: 96,
    badge: 'w-7 h-7 -bottom-1.5 -right-1.5',
    badgeIcon: 'w-4 h-4',
    ring: 'ring-3',
    glow: 'shadow-[0_0_26px_rgba(37,99,235,0.45)]',
  },
  '2xl': {
    container: 'w-28 h-28',
    avatarSize: 112,
    badge: 'w-8 h-8 -bottom-2 -right-2',
    badgeIcon: 'w-5 h-5',
    ring: 'ring-4',
    glow: 'shadow-[0_0_30px_rgba(37,99,235,0.5)]',
  }
};

export default function ModernAvatar({
  src = '/avatars/avatar-shivam.jpg',
  alt = 'Citizen Profile Avatar',
  size = 'sm',
  name = 'Shivam Gupta',
  showBadge = true,
  isInteractive = true,
  className = '',
  status = 'verified' // 'verified' | 'online' | 'none'
}) {
  const [imageError, setImageError] = useState(false);
  const sizeConfig = sizeMap[size] || sizeMap.sm;
  const initial = (name || 'U').charAt(0).toUpperCase();

  const avatarSrc = src || '/avatars/avatar-shivam.jpg';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full ${sizeConfig.container} ${className} ${
        isInteractive ? 'group cursor-pointer' : ''
      }`}
    >
      {/* Outer Ambient Navy Blue Glow (Matches Menu Sidebar Theme) */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] opacity-40 blur-[3px] group-hover:opacity-75 group-hover:blur-[5px] transition-all duration-300 pointer-events-none"
      />

      {/* Circular Navy Blue Outline Stroke Frame */}
      <div
        className={`relative w-full h-full rounded-full p-[2px] bg-gradient-to-b from-[#2563EB] via-[#1E3A8A] to-[#0F172A] ring-1 ring-blue-500/40 ${sizeConfig.glow} transition-all duration-300 ${
          isInteractive ? 'group-hover:scale-105 group-hover:ring-blue-400/60 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.45)]' : ''
        }`}
      >
        {/* Inner Circular Image Canvas with Dark Navy Background */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#030712] relative flex items-center justify-center">
          {!imageError ? (
            <Image
              src={avatarSrc}
              alt={alt}
              width={sizeConfig.avatarSize * 2}
              height={sizeConfig.avatarSize * 2}
              className="w-full h-full object-cover object-center rounded-full transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            /* Modern Navy 3D Fallback Icon */
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-[#030712] flex items-center justify-center text-white font-black text-base shadow-inner">
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-blue-100">{initial}</span>
            </div>
          )}

          {/* Subtle Circular Glass Highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Verified DigiLocker Badge with Dark Navy Ring */}
      {showBadge && status === 'verified' && (
        <div
          className={`absolute ${sizeConfig.badge} bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-md ring-2 ring-[#030712] z-10 transition-transform duration-200 group-hover:scale-110`}
          title="DigiLocker Verified Citizen Identity"
        >
          <ShieldCheck className={`${sizeConfig.badgeIcon} text-white drop-shadow-xs`} />
        </div>
      )}

      {showBadge && status === 'online' && (
        <div
          className={`absolute ${sizeConfig.badge} bg-emerald-500 rounded-full ring-2 ring-[#030712] z-10`}
          title="Citizen Active Online"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
}
