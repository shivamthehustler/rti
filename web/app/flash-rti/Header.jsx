'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronDownIcon, LogoIndia, UserIcon, GlobeIcon, AnimatedMenuIcon, ChevronRightIcon } from '@/components/Icons';
import { useApp } from '@/context/AppContext';
import { useAppStore } from '@/store/useAppStore';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const { language, setLanguage, fontSize, setFontSize, t } = useApp();
  const { user, logoutUser } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => {
    if (!path || !pathname) return false;
    if (path === '/') return pathname === '/';
    if (path === '/faqs') return pathname.startsWith('/faqs') || pathname.startsWith('/faq');
    if (path === '/contact') return pathname.startsWith('/contact');
    if (path.includes('flash-rti')) return pathname.startsWith('/flash-rti') || pathname.startsWith('/dashboard/flash-rti');
    return pathname.startsWith(path);
  };

  const navItems = [
    { key: 'home', label: t.header.nav.home, href: '/' },
    { key: 'flashRTI', label: 'Flash RTI', href: user ? '/dashboard/flash-rti' : '/login?redirect=/dashboard/flash-rti' },
    { key: 'fileRTI', label: t.header.nav.fileRTI, href: '/submit-request' },
    { key: 'guide', label: t.header.nav.guide, href: '/guide' },
    { key: 'faqs', label: t.header.nav.faqs, href: '/faqs' },
    { key: 'contact', label: t.header.nav.contact, href: '/contact' },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-50 shadow-2xs">
      {/* Top Government Strip */}
      <div className="bg-[#06152B] w-full">
        <div className="text-white text-[11px] sm:text-xs py-1.5 px-5 flex justify-between items-center">
          {/* Left Side: Flag & Government text */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <LogoIndia className="w-4 h-3 sm:w-5 sm:h-3.5 rounded-[1px] shrink-0" />
            <span className="font-semibold text-white tracking-wide">{t.header.govTextHi}</span>
            <span className="text-gray-400 font-light hidden min-[360px]:inline">|</span>
            <span className="text-gray-200 font-normal hidden min-[360px]:inline">{t.header.govTextEn}</span>
          </div>

          {/* Right Side: Accessibility options (A-, A, A+ functional font resize) */}
          <div className="flex items-center gap-2 sm:gap-4 text-gray-200 text-xs shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 font-semibold select-none">
              <button 
                onClick={() => setFontSize(-1)} 
                className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  fontSize === -1 
                    ? 'bg-white/25 text-white font-bold ring-1 ring-white/50 shadow-2xs' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`} 
                aria-label="Decrease text size"
                title="Decrease font size"
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize(0)} 
                className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  fontSize === 0 
                    ? 'bg-white/25 text-white font-bold ring-1 ring-white/50 shadow-2xs' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`} 
                aria-label="Normal text size"
                title="Reset font size"
              >
                A
              </button>
              <button 
                onClick={() => setFontSize(1)} 
                className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  fontSize === 1 
                    ? 'bg-white/25 text-white font-bold ring-1 ring-white/50 shadow-2xs' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`} 
                aria-label="Increase text size"
                title="Increase font size"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar - Content Shifted Slightly Downward */}
      <div className="px-5 flex items-stretch justify-between gap-2 sm:gap-6 min-h-[58px] sm:min-h-[72px] relative">
        {/* Logo and Title - Vertically Centered */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group shrink min-w-0 py-2.5 sm:py-3.5">
          <Image 
            src="/logo.png" 
            alt="State Emblem of India" 
            width={48} 
            height={70} 
            className="h-7 min-[360px]:h-8 sm:h-10 md:h-11 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 my-auto" 
            priority 
          />
          <div className="flex flex-col min-w-0 justify-center my-auto">
            <h1 className="text-[11px] min-[360px]:text-[12px] min-[400px]:text-[13.5px] sm:text-base md:text-lg font-extrabold text-[#0B1C3F] tracking-tight leading-tight whitespace-nowrap sm:whitespace-normal">
              {t.header.title}
            </h1>
            <p className="text-[6.5px] min-[340px]:text-[7.2px] min-[375px]:text-[8px] min-[410px]:text-[8.5px] sm:text-xs text-gray-500 font-medium tracking-tight whitespace-nowrap sm:whitespace-normal leading-tight mt-0.5">
              {t.header.subtitle}
            </p>
          </div>
        </Link>

        {/* Right Side Controls (Language Toggle + Desktop Links + Hamburger Menu) */}
        <div className="flex items-stretch gap-2 sm:gap-3 lg:gap-6 shrink-0">
          {/* Desktop Navigation Links with Subtle, Professional & Smooth Dynamic Transitions */}
          <LayoutGroup id="flash-rti-header-nav-tabs">
            <nav 
              onMouseLeave={() => setHoveredNav(null)}
              className="hidden lg:flex items-stretch gap-1 xl:gap-1.5 text-sm font-semibold text-gray-700 relative"
            >
              {navItems.map((item) => {
                const active = isActive(item.href);
                const isHovered = hoveredNav === item.key;

                const innerContent = (
                  <>
                    {/* Floating Hover Morph Pill with Gentle, Slower Dynamic Glide */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          layoutId="flash-rti-header-nav-hover-morph-pill"
                          className="absolute inset-y-2.5 inset-x-0 rounded-xl bg-slate-100/75 border border-slate-200/50 shadow-2xs -z-0 pointer-events-none"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.22, ease: "easeOut" } }}
                          transition={{
                            type: "spring",
                            stiffness: 140,
                            damping: 20,
                            mass: 0.95
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Subtle, Slower Active Indicator Underline */}
                    {active && (
                      <motion.div
                        layoutId="flash-rti-navbar-active-indicator"
                        className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#2563EB] rounded-full shadow-[0_1px_4px_rgba(37,99,235,0.25)] z-20"
                        transition={{
                          type: "spring",
                          stiffness: 140,
                          damping: 20,
                          mass: 0.95
                        }}
                      />
                    )}

                    <span className={`relative z-10 px-3.5 py-1.5 rounded-lg transition-colors duration-300 ease-out ${
                      active
                        ? "text-[#2563EB]"
                        : isHovered
                          ? "text-slate-900"
                          : "text-slate-600"
                    }`}>
                      {item.label}
                    </span>
                  </>
                );

                const commonClasses = `group relative flex items-center h-full py-3.5 whitespace-nowrap cursor-pointer select-none font-semibold`;

                if (item.href) {
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onMouseEnter={() => setHoveredNav(item.key)}
                      className={commonClasses}
                    >
                      {innerContent}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setHoveredNav(item.key)}
                    className={commonClasses}
                  >
                    {innerContent}
                  </button>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Radix UI Headless Accessible Language Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-300/80 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer shrink-0 my-auto outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label="Select Language"
              >
                <GlobeIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-xs font-bold">{t.header.langLabel}</span>
                <ChevronDownIcon className="w-3 h-3 text-gray-500 transition-transform duration-200" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 outline-none animate-in fade-in-80 zoom-in-95"
                sideOffset={4}
                align="end"
              >
                <DropdownMenu.Item
                  onClick={() => setLanguage('en')}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between cursor-pointer outline-none transition-colors ${
                    language === 'en' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="text-xs font-bold">✓</span>}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setLanguage('hi')}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between cursor-pointer outline-none transition-colors ${
                    language === 'hi' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>हिन्दी</span>
                  {language === 'hi' && <span className="text-xs font-bold">✓</span>}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Login / User CTA Button on Desktop */}
          <div className="hidden lg:block pl-3 border-l border-gray-200 my-auto">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-blue-50 text-[#2563EB] border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
                  <UserIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span className="max-w-[120px] truncate">{user.name || user.username}</span>
                </span>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="text-xs text-slate-500 hover:text-red-600 font-semibold px-2 py-1 transition-colors cursor-pointer"
                >
                  {t.login?.logoutBtn || (language === 'hi' ? 'लॉग आउट' : 'Sign Out')}
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer whitespace-nowrap"
              >
                <UserIcon className="w-4 h-4 text-white" />
                <span>{t.header.nav.login}</span>
              </Link>
            )}
          </div>

          {/* Mobile Three-Line Menu Bar */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer my-auto flex items-center justify-center select-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatedMenuIcon isOpen={isMobileMenuOpen} className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu with Framer Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-gray-200/80 bg-white"
          >
            <div className="min-h-0 bg-white px-4 py-4 shadow-lg">
              <nav className="flex flex-col gap-1 text-sm">
                {navItems.map((item, index) => {
                  const active = isActive(item.href);

                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.18 }}
                    >
                      <Link 
                        href={item.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                          active 
                            ? 'bg-slate-100/90 text-[#0B1C3F] font-semibold border border-slate-200/80 shadow-2xs' 
                            : 'text-slate-600 hover:text-[#0B1C3F] hover:bg-slate-50 border border-transparent font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span 
                            className={`w-1 h-4.5 rounded-full transition-colors shrink-0 ${
                              active ? 'bg-[#2563EB]' : 'bg-transparent'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {item.label}
                          </span>
                        </div>
                        
                        <ChevronRightIcon 
                          className={`w-3.5 h-3.5 transition-all shrink-0 ${
                            active 
                              ? 'text-[#2563EB]' 
                              : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'
                          }`} 
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-blue-50 text-[#2563EB] border border-blue-200 px-3.5 py-2 rounded-lg text-xs font-bold">
                      <UserIcon className="w-4 h-4 text-[#2563EB]" />
                      <span>{user.name || user.username}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span>{t.login?.logoutBtn || (language === 'hi' ? 'लॉग आउट' : 'Sign Out')}</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-white" />
                    <span>{t.header.nav.login}</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
