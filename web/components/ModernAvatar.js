'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  User, 
  Shield, 
  Scale, 
  GraduationCap, 
  Landmark, 
  FileText,
  UserCheck
} from 'lucide-react';

const sizeMap = {
  xs: {
    container: 'w-7 h-7',
    avatarSize: 28,
    badge: 'w-3 h-3 -bottom-0.5 -right-0.5',
    badgeIcon: 'w-2 h-2',
    iconSize: 'w-3.5 h-3.5',
    textSize: 'text-[11px]',
  },
  sm: {
    container: 'w-9 h-9',
    avatarSize: 36,
    badge: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    badgeIcon: 'w-2.5 h-2.5',
    iconSize: 'w-4.5 h-4.5',
    textSize: 'text-xs',
  },
  md: {
    container: 'w-12 h-12',
    avatarSize: 48,
    badge: 'w-4.5 h-4.5 -bottom-0.5 -right-0.5',
    badgeIcon: 'w-3 h-3',
    iconSize: 'w-6 h-6',
    textSize: 'text-sm',
  },
  lg: {
    container: 'w-16 h-16',
    avatarSize: 64,
    badge: 'w-5.5 h-5.5 -bottom-1 -right-1',
    badgeIcon: 'w-3.5 h-3.5',
    iconSize: 'w-8 h-8',
    textSize: 'text-lg',
  },
  xl: {
    container: 'w-20 h-20',
    avatarSize: 80,
    badge: 'w-6.5 h-6.5 -bottom-1 -right-1',
    badgeIcon: 'w-4 h-4',
    iconSize: 'w-10 h-10',
    textSize: 'text-xl',
  },
  '2xl': {
    container: 'w-24 h-24',
    avatarSize: 96,
    badge: 'w-7.5 h-7.5 -bottom-1.5 -right-1.5',
    badgeIcon: 'w-4.5 h-4.5',
    iconSize: 'w-12 h-12',
    textSize: 'text-2xl',
  }
};

const iconAvatarMap = {
  'icon:user': { icon: User, bg: 'bg-blue-100 text-blue-700 border-blue-200' },
  'icon:shield': { icon: Shield, bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'icon:scale': { icon: Scale, bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  'icon:student': { icon: GraduationCap, bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  'icon:gov': { icon: Landmark, bg: 'bg-slate-100 text-slate-700 border-slate-200' },
  'icon:applicant': { icon: UserCheck, bg: 'bg-sky-100 text-sky-700 border-sky-200' },
  'icon:file': { icon: FileText, bg: 'bg-teal-100 text-teal-700 border-teal-200' },
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
  const isIconAvatar = avatarSrc.startsWith('icon:');
  const iconConfig = isIconAvatar ? iconAvatarMap[avatarSrc] || iconAvatarMap['icon:user'] : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full ${sizeConfig.container} ${className} ${
        isInteractive ? 'group cursor-pointer' : ''
      }`}
    >
      {/* Clean, Pleasant Rounded Avatar Canvas with Plain Solid Border */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200/80 shadow-xs flex items-center justify-center transition-all duration-200 group-hover:ring-blue-400/80">
        {isIconAvatar && iconConfig ? (
          /* Clean Vector/Icon Citizen Avatar on Soft Solid Pastel Background */
          <div className={`w-full h-full rounded-full flex items-center justify-center ${iconConfig.bg}`}>
            <iconConfig.icon className={sizeConfig.iconSize} />
          </div>
        ) : !imageError ? (
          /* Pleasant 3D Character Avatar on Clean Plain Background */
          <Image
            src={avatarSrc}
            alt={alt}
            width={sizeConfig.avatarSize * 2}
            height={sizeConfig.avatarSize * 2}
            className="w-full h-full object-cover object-center rounded-full transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          /* Clean Letter Initial Fallback on Soft Blue Solid Background */
          <div className="w-full h-full rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
            <span className={sizeConfig.textSize}>{initial}</span>
          </div>
        )}
      </div>

      {/* Verified DigiLocker Badge with Clean Emerald Tone and Crisp White Border */}
      {showBadge && status === 'verified' && (
        <div
          className={`absolute ${sizeConfig.badge} bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs ring-1.5 ring-white z-10 transition-transform duration-200 group-hover:scale-110`}
          title="DigiLocker Verified Citizen Identity"
        >
          <ShieldCheck className={`${sizeConfig.badgeIcon} text-white`} />
        </div>
      )}

      {showBadge && status === 'online' && (
        <div
          className={`absolute ${sizeConfig.badge} bg-emerald-500 rounded-full ring-1.5 ring-white z-10`}
          title="Citizen Active Online"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
}
