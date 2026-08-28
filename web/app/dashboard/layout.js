'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
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
  Menu,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutUser, initUser } = useAppStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    initUser();
  }, [initUser]);

  const userName = user?.name || 'Shivam Gupta';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

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

  const isNavActive = (href, exact = false) => {
    if (!pathname) return false;
    if (href === '/dashboard/flash-rti' && (pathname === '/dashboard' || pathname === '/dashboard/flash-rti')) {
      return true;
    }
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Government Navbar */}
      <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        {/* Left Side: Emblem + Portal Title */}
        <div className="flex items-center gap-3.5">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="National Emblem of India"
              width={34}
              height={50}
              className="h-9 sm:h-10 w-auto object-contain shrink-0 transition-transform group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#0B192C] tracking-tight leading-tight">
                RTI Information Access Portal
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight">
                Government of India
              </p>
            </div>
          </Link>
        </div>

        {/* Right Side: Direct Links to Help, Notifications, User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Direct Link to Help & Support Page */}
          <Link
            href="/dashboard/help"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              pathname === '/dashboard/help'
                ? 'bg-blue-100 text-[#2563EB]'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Help & Support"
            aria-label="Help and Support"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {/* Direct Link to Notification Center */}
          <Link
            href="/dashboard/notifications"
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              pathname === '/dashboard/notifications'
                ? 'bg-blue-100 text-[#2563EB]'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
          </Link>

          {/* User Profile Dropdown & Direct Profile Access */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {/* Circle Avatar with Initial */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs">
                  {userInitial}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden sm:inline-block max-w-[140px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 z-50 outline-none animate-in fade-in-80 zoom-in-95"
                sideOffset={6}
                align="end"
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'citizen.rti@gov.in'}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-medium w-fit">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                    <span>DigiLocker Verified</span>
                  </div>
                </div>

                <DropdownMenu.Item asChild>
                  <Link
                    href="/dashboard/profile"
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer outline-none transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-slate-500" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link
                    href="/dashboard/my-requests"
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer outline-none transition-colors"
                  >
                    <FolderClosed className="w-4 h-4 text-slate-500" />
                    <span>My RTI Requests</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link
                    href="/dashboard/help"
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer outline-none transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link
                    href="/"
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer outline-none transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>Public Portal Home</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />

                <DropdownMenu.Item
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer outline-none transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      {/* Main Container with Unified 4-Edge Margins */}
      <div className="flex-1 flex w-full p-4 sm:p-6 lg:p-7 gap-5 sm:gap-6 items-stretch bg-white">
        {/* Desktop Left Sidebar */}
        <aside
          className="hidden lg:flex w-[240px] xl:w-[250px] shrink-0 p-5 bg-[#06101E] rounded-3xl flex-col justify-between text-slate-300 shadow-xl border border-slate-800/40 sticky top-[84px] h-[calc(100vh-108px)] self-start"
          style={{
            background: 'linear-gradient(180deg, #071325 0%, #050E1B 100%)'
          }}
        >
          {/* Top Nav Group */}
          <div className="space-y-6">
            {/* Primary Action Items */}
            <div className="space-y-1.5">
              {mainNavItems.map((item) => {
                const active = isNavActive(item.href, item.exact);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-[#2563EB] text-white shadow-[0_0_18px_rgba(37,99,235,0.45)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800/80 mx-2" />

            {/* Secondary Account / Support Items */}
            <div className="space-y-1.5">
              {secondaryNavItems.map((item) => {
                const active = isNavActive(item.href);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-[#2563EB] text-white shadow-[0_0_18px_rgba(37,99,235,0.45)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <IconComponent className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Logout Button */}
          <div className="pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Over Sidebar Drawer */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileNavOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="lg:hidden fixed top-0 bottom-0 left-0 w-[270px] bg-[#071325] text-slate-300 p-5 flex flex-col justify-between z-50 shadow-2xl"
              >
                <div className="space-y-6">
                  {/* Mobile Drawer Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="Emblem"
                        width={24}
                        height={36}
                        className="h-8 w-auto object-contain brightness-110"
                      />
                      <span className="text-sm font-bold text-white">RTI Portal</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Nav links */}
                  <div className="space-y-1.5">
                    {mainNavItems.map((item) => {
                      const active = isNavActive(item.href, item.exact);
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            active
                              ? 'bg-[#2563EB] text-white'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <IconComponent className="w-4.5 h-4.5 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="h-px bg-slate-800 mx-2" />

                  <div className="space-y-1.5">
                    {secondaryNavItems.map((item) => {
                      const active = isNavActive(item.href);
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            active
                              ? 'bg-[#2563EB] text-white'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-4.5 h-4.5 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[11px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-4.5 h-4.5 shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
