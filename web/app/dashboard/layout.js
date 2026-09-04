'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import ModernAvatar from '../../components/ModernAvatar';
import DashboardBackgroundWave from '../../components/DashboardBackgroundWave';
import { 
  Zap, 
  FileText, 
  LayoutDashboard, 
  FolderClosed, 
  Crosshair, 
  UserCircle, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  History,
  Plus,
  MessageSquare,
  Home
} from 'lucide-react';

function DashboardLayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeHistoryId = searchParams.get('historyId');

  const user = useAppStore((state) => state.user);
  const logoutUser = useAppStore((state) => state.logoutUser);
  const initUser = useAppStore((state) => state.initUser);
  const historyList = useAppStore((state) => state.historyList);
  const setHistoryList = useAppStore((state) => state.setHistoryList);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Stable references for high-performance single-listener keyboard engine
  const pathnameRef = useRef(pathname);
  const routerRef = useRef(router);
  const isShortcutsOpenRef = useRef(isShortcutsOpen);

  useEffect(() => {
    pathnameRef.current = pathname;
    routerRef.current = router;
    isShortcutsOpenRef.current = isShortcutsOpen;
  }, [pathname, router, isShortcutsOpen]);

  // Instant Route Prefetching for 0ms transitions across all tabs
  useEffect(() => {
    try {
      router.prefetch('/dashboard/flash-rti');
      router.prefetch('/dashboard/file-rti');
      router.prefetch('/dashboard/overview');
      router.prefetch('/dashboard/my-requests');
      router.prefetch('/dashboard/track');
      router.prefetch('/dashboard/profile');
      router.prefetch('/dashboard/notifications');
      router.prefetch('/dashboard/help');
    } catch (e) {}
  }, [router]);

  useEffect(() => {
    initUser();
  }, [initUser]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHistoryList(data);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem('rti_flash_history_cached', JSON.stringify(data));
            } catch (e) {}
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch sidebar history:", err);
    }

    // Client-side cache fallback
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem('rti_flash_history_cached');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHistoryList(parsed);
          }
        }
      } catch (e) {}
    }
  }, [setHistoryList]);

  useEffect(() => {
    fetchHistory();

    const handleHistoryUpdate = () => {
      fetchHistory();
    };

    window.addEventListener('flash_rti_history_updated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('flash_rti_history_updated', handleHistoryUpdate);
    };
  }, [fetchHistory]);

  const userName = user?.name || 'Shivam Gupta';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handleNewSearch = (e) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem('flash_rti_force_new', '1');
      window.dispatchEvent(new CustomEvent('flash_rti_reset_search'));
    }
    const currentPath = pathnameRef.current;
    if (currentPath !== '/dashboard/flash-rti') {
      routerRef.current.push('/dashboard/flash-rti?new=' + Date.now());
    } else {
      routerRef.current.replace('/dashboard/flash-rti?new=' + Date.now());
    }
    setTimeout(() => {
      const searchInput = document.querySelector('input[data-search-input="true"]');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 50);
  };

  // High-performance single-registration Global Native Keyboard Engine (⌘⇧O, ⌘K, ⌘1-5, ?, Esc)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable ||
        activeEl.getAttribute('role') === 'textbox'
      );
      const isMod = e.metaKey || e.ctrlKey;
      const isAlt = e.altKey;

      // ⌘ + Shift + O or Ctrl + Shift + O -> New Chat / Reset Search
      const isKeyO =
        (typeof e.key === 'string' && e.key.toLowerCase() === 'o') ||
        e.code === 'KeyO' ||
        e.keyCode === 79 ||
        e.which === 79;

      if (isMod && e.shiftKey && isKeyO) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') {
          e.stopImmediatePropagation();
        }

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem('flash_rti_force_new', '1');
          window.dispatchEvent(new CustomEvent('flash_rti_reset_search'));
        }

        const currentPath = pathnameRef.current;
        if (currentPath !== '/dashboard/flash-rti') {
          routerRef.current.push('/dashboard/flash-rti?new=' + Date.now());
        } else {
          routerRef.current.replace('/dashboard/flash-rti?new=' + Date.now());
        }

        setTimeout(() => {
          const searchInput = document.querySelector('input[data-search-input="true"]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }, 50);
        return;
      }

      // ⌘K or Ctrl+K -> Focus Search (Instant native focus without route parameter thrashing)
      if (isMod && !isAlt && !e.shiftKey && (e.key?.toLowerCase() === 'k' || e.code === 'KeyK')) {
        e.preventDefault();
        e.stopPropagation();

        const currentPath = pathnameRef.current;
        if (currentPath !== '/dashboard/flash-rti' && currentPath !== '/dashboard') {
          routerRef.current.push('/dashboard/flash-rti?focus=1');
        } else {
          const searchInput = document.querySelector('input[data-search-input="true"]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          } else {
            window.dispatchEvent(new CustomEvent('flash_rti_focus_search'));
          }
        }
        return;
      }

      // ⌘1 to ⌘5 or Alt+1 to Alt+5 Tab Navigation (Only when not focused in text inputs)
      if ((isMod || isAlt) && !e.shiftKey && !isInputFocused) {
        const digitMap = {
          '1': '/dashboard/flash-rti',
          '2': '/dashboard/file-rti',
          '3': '/dashboard/overview',
          '4': '/dashboard/my-requests',
          '5': '/dashboard/track',
          'Digit1': '/dashboard/flash-rti',
          'Digit2': '/dashboard/file-rti',
          'Digit3': '/dashboard/overview',
          'Digit4': '/dashboard/my-requests',
          'Digit5': '/dashboard/track',
          'Numpad1': '/dashboard/flash-rti',
          'Numpad2': '/dashboard/file-rti',
          'Numpad3': '/dashboard/overview',
          'Numpad4': '/dashboard/my-requests',
          'Numpad5': '/dashboard/track',
          '¡': '/dashboard/flash-rti',
          '™': '/dashboard/file-rti',
          '£': '/dashboard/overview',
          '¢': '/dashboard/my-requests',
          '∞': '/dashboard/track'
        };

        const targetRoute = digitMap[e.key] || digitMap[e.code];
        if (targetRoute) {
          e.preventDefault();
          e.stopPropagation();
          if (pathnameRef.current !== targetRoute) {
            routerRef.current.push(targetRoute);
          }
          return;
        }
      }

      // ? or Shift+/ -> Toggle Keyboard Shortcuts Modal
      if ((e.key === '?' || (e.shiftKey && (e.key === '?' || e.code === 'Slash'))) && !isInputFocused) {
        e.preventDefault();
        e.stopPropagation();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      // Esc -> Close Shortcuts Modal or Blur Search
      if (e.key === 'Escape' || e.code === 'Escape') {
        if (isShortcutsOpenRef.current) {
          e.preventDefault();
          setIsShortcutsOpen(false);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, []);

  const mainNavItems = [
    {
      name: 'Flash RTI',
      href: '/dashboard/flash-rti',
      icon: Zap,
      exact: true
    },
    {
      name: 'File an RTI',
      href: '/dashboard/file-rti',
      icon: FileText,
    },
    {
      name: 'Dashboard',
      href: '/dashboard/overview',
      icon: LayoutDashboard,
    },
    {
      name: 'My Requests',
      href: '/dashboard/my-requests',
      icon: FolderClosed,
    },
    {
      name: 'Track Request',
      href: '/dashboard/track',
      icon: Crosshair,
    },
  ];

  const secondaryNavItems = [
    {
      name: 'My Profile',
      href: '/dashboard/profile',
      icon: UserCircle,
    },
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: Bell,
      badge: '3'
    },
    {
      name: 'Help & Support',
      href: '/dashboard/help',
      icon: HelpCircle,
    },
  ];

  const mobileBottomNavItems = [
    {
      name: 'Home',
      href: '/dashboard/overview',
      icon: Home,
      exact: true
    },
    {
      name: 'Flash RTI',
      href: '/dashboard/flash-rti',
      icon: Zap,
      exact: true
    },
    {
      name: 'File RTI',
      href: '/dashboard/file-rti',
      icon: FileText,
    },
    {
      name: 'Requests',
      href: '/dashboard/my-requests',
      icon: FolderClosed,
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: UserCircle,
    },
  ];

  const isNavActive = (href, exact = false) => {
    if (!pathname) return false;
    if (href === '/dashboard/overview' && (pathname === '/dashboard/overview' || pathname === '/dashboard/overview/')) {
      return true;
    }
    if (href === '/dashboard/flash-rti' && (pathname === '/dashboard' || pathname === '/dashboard/flash-rti')) {
      return true;
    }
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen max-h-screen bg-[#F0F6FD] lg:bg-[#030712] flex flex-col font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Mobile Top Header - Clean, Seamless Light Bar matching the bluish canvas */}
      <header className="lg:hidden w-full bg-[#F0F6FD]/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer active:scale-95"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Emblem"
              width={26}
              height={36}
              className="h-7 w-auto object-contain shrink-0 transition-transform group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#0B192C] tracking-tight leading-none">RTI Portal</span>
              <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">Govt. of India</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/notifications"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer active:scale-95"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </Link>
        </div>
      </header>

      {/* Main Framework: Edge-to-Edge on Mobile (p-0), Floating Rounded Canvas on Desktop (lg:p-4) */}
      <div className="flex-1 flex w-full p-0 lg:p-4 gap-0 lg:gap-5 items-stretch overflow-hidden min-h-0">
        {/* Desktop Left Sidebar: Pure Seamless Background Without Outer Box Outline */}
        <aside className="hidden lg:flex w-[240px] xl:w-[255px] shrink-0 h-full py-2 px-1 flex-col justify-between text-slate-300 select-none bg-transparent overflow-y-auto custom-sidebar-scroll">
          <div className="space-y-6">
            {/* Sidebar Top: National Emblem + Portal Title */}
            <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1.5 group">
              <Image
                src="/logo.png"
                alt="National Emblem of India"
                width={34}
                height={48}
                className="h-9.5 w-auto object-contain shrink-0 transition-transform group-hover:scale-105"
                priority
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-[13.5px] font-bold text-white tracking-tight leading-snug">
                  RTI Information Access Portal
                </h1>
                <p className="text-[10.5px] text-slate-400 font-medium">
                  Government of India
                </p>
              </div>
            </Link>

            {/* Primary Action Items */}
            <div className="space-y-1.5">
              {mainNavItems.map((item) => {
                const active = isNavActive(item.href, item.exact);
                const IconComponent = item.icon;
                const isFlashRTI = item.href === '/dashboard/flash-rti';

                return (
                  <div key={item.name} className="space-y-1">
                    {/* Main Nav Button with Instant Responsive CSS State */}
                    <div
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                        active
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <Link
                        href={item.href}
                        prefetch={true}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <IconComponent className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>

                      {/* Collapsible Chevron Arrow for Flash RTI */}
                      {isFlashRTI && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsHistoryExpanded(prev => !prev);
                          }}
                          className={`p-0.5 rounded-md hover:bg-white/20 transition-transform ${
                            active ? 'text-white' : 'text-slate-400'
                          }`}
                          aria-label={isHistoryExpanded ? "Collapse History" : "Expand History"}
                        >
                          {isHistoryExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Seamless Collapsible History Sublinks */}
                    {isFlashRTI && (
                      <AnimatePresence initial={false}>
                        {isHistoryExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden pt-1 pb-1 px-1 space-y-1"
                          >
                            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              <span className="flex items-center gap-1.5 text-slate-400">
                                <History className="w-3 h-3 text-blue-400" />
                                <span>Recent Queries</span>
                              </span>
                              <button
                                type="button"
                                onClick={handleNewSearch}
                                className="text-[10px] text-blue-300 hover:text-white bg-blue-500/25 hover:bg-blue-600 px-2 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-0.5"
                                title="Start New Search"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>NEW</span>
                              </button>
                            </div>

                            {/* History Items List */}
                            <div className="space-y-0.5 max-h-64 overflow-y-auto pr-0.5 custom-sidebar-scroll">
                              {historyList.length > 0 ? (
                                historyList.map((h) => {
                                  const isCurrentHistory = String(activeHistoryId) === String(h.id);

                                  return (
                                    <Link
                                      key={h.id}
                                      href={`/dashboard/flash-rti?query=${encodeURIComponent(h.query)}`}
                                      className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors group/item block ${
                                        isCurrentHistory
                                          ? 'bg-blue-600/30 text-white font-medium border border-blue-400/40'
                                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
                                      }`}
                                      title={h.query}
                                    >
                                      <MessageSquare className={`w-3 h-3 shrink-0 mt-0.5 ${
                                        isCurrentHistory ? 'text-blue-300' : 'text-slate-500 group-hover/item:text-slate-300'
                                      }`} />
                                      <span className="truncate flex-1 text-[11px] leading-tight">
                                        {h.query}
                                      </span>
                                    </Link>
                                  );
                                })
                              ) : (
                                <p className="text-[11px] text-slate-500 px-2.5 py-1 italic">
                                  No recent queries yet
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800/60 mx-1" />

            {/* Secondary Nav Items */}
            <div className="space-y-1.5">
              {secondaryNavItems.map((item) => {
                const active = isNavActive(item.href);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-xs bg-[#2563EB] text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Citizen Profile Card + Minimal '?' Shortcut */}
          <div className="pt-3 border-t border-slate-800/60 mt-auto space-y-2">
            <div className="bg-slate-900/70 hover:bg-slate-800/70 border border-slate-800/80 rounded-2xl p-3 transition-all duration-200 flex items-center justify-between gap-3 shadow-sm">
              <Link href="/dashboard/profile" className="flex items-center gap-3 min-w-0 flex-1 group">
                <ModernAvatar
                  src={user?.avatar}
                  name={userName}
                  size="sm"
                  showBadge={true}
                  status="verified"
                  isInteractive={true}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate leading-tight group-hover:text-blue-300 transition-colors">
                    {userName}
                  </span>
                  <span className="text-[10.5px] text-emerald-400 flex items-center gap-1 font-semibold mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="truncate">DigiLocker Verified</span>
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Minimal Clean '?' Shortcut Trigger */}
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer rounded-lg hover:bg-white/[0.04]"
              title="Keyboard Shortcuts (?)"
            >
              <span className="font-medium text-slate-400">Shortcuts</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-semibold">
                ?
              </kbd>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileNavOpen(false)}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[280px] bg-[#040914] text-slate-300 z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden border-r border-slate-800"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={28}
                        height={40}
                        className="h-8 w-auto object-contain"
                      />
                      <span className="font-bold text-white text-sm">Citizen Portal</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Primary Nav */}
                  <div className="space-y-1.5">
                    {mainNavItems.map((item) => {
                      const active = isNavActive(item.href, item.exact);
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                            active
                              ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-blue-600/30'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <IconComponent className="w-5 h-5 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="h-px bg-slate-800/80" />

                  {/* Secondary Nav */}
                  <div className="space-y-1.5">
                    {secondaryNavItems.map((item) => {
                      const active = isNavActive(item.href);
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                            active
                              ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-blue-600/30'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <IconComponent className="w-5 h-5 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="text-xs bg-[#2563EB] text-white px-2 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
                    <Link 
                      href="/dashboard/profile" 
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center gap-3 min-w-0 flex-1"
                    >
                      <ModernAvatar
                        src={user?.avatar}
                        name={userName}
                        size="sm"
                        showBadge={true}
                        status="verified"
                        isInteractive={false}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate leading-tight">
                          {userName}
                        </span>
                        <span className="text-[10.5px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span className="truncate">DigiLocker Verified</span>
                        </span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileNavOpen(false);
                        handleLogout();
                      }}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Logout"
                      aria-label="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Clean, Full-Height Bluish Canvas - Edge-to-Edge on Mobile, Floating Rounded on Desktop */}
        <main className="h-full flex-1 min-w-0 bg-[#F0F6FD] rounded-none lg:rounded-[32px] border-0 lg:border border-slate-200/80 shadow-none lg:shadow-2xl flex flex-col relative overflow-hidden">
          {/* Full-Height Consistent Background Wave & Bluish Mesh across all dashboard pages */}
          <DashboardBackgroundWave />

          {/* Scrollable Children Viewport (Instant, 0ms latency rendering) */}
          <div className="flex-1 h-full overflow-y-auto custom-canvas-scroll pb-20 lg:pb-0 relative z-10 bg-transparent">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Persistent Bottom Navigation Bar (Inspired by Reference UI) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F0F6FD]/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {mobileBottomNavItems.map((item) => {
          const active = isNavActive(item.href, item.exact);
          const IconComponent = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 select-none ${
                active
                  ? 'text-[#2563EB]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${active ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-400'}`}>
                <IconComponent className={`w-5 h-5 transition-transform ${active ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10.5px] mt-0.5 leading-none tracking-tight font-semibold ${active ? 'text-[#2563EB] font-bold' : 'text-slate-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <AnimatePresence>
        {isShortcutsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShortcutsOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="relative w-full max-w-md bg-[#0B132B] border border-slate-700/80 rounded-3xl p-6 shadow-2xl z-10 text-white space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                    ⌘
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Keyboard Shortcuts</h3>
                    <p className="text-[11px] text-slate-400">Power user navigation for RTI Portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShortcutsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Shortcuts */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Navigation</span>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>Jump to Flash RTI</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">⌘ 1</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>File an RTI</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">⌘ 2</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>Dashboard Overview</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">⌘ 3</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>My Requests</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">⌘ 4</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>Track Request</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">⌘ 5</kbd>
                  </div>
                </div>
              </div>

              {/* Search & Actions Shortcuts */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Search & Actions</span>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>New Chat / Search</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">⌘ ⇧ O</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>Focus Flash Search</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">⌘ K</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>Execute Search Query</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">↵ Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>Clear Search / Close</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5">
                    <span>Toggle Shortcuts Sheet</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[11px] border border-slate-700">?</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070F1E] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </Suspense>
  );
}
