'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import ModernAvatar from '../../../components/ModernAvatar';
import ThreeDFlashLogo from '../../../components/ThreeDFlashLogo';
import { 
  Zap, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  FolderClosed, 
  Crosshair, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Landmark, 
  ChevronRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning,';
  if (hour < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

export default function DashboardOverviewPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const userName = user?.name || 'Shivam Gupta';
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting] = useState(getGreeting);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/flash-rti?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/dashboard/flash-rti');
    }
  };

  const stats = [
    { label: 'Total RTIs Filed', value: '4', change: '+1 this month', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Under Processing', value: '1', change: '8 days remaining', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Disposed / Resolved', value: '3', change: '100% compliance', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'First Appeals', value: '0', change: 'None pending', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  const quickServices = [
    {
      title: 'Flash RTI',
      subtitle: 'Instant AI search',
      icon: Zap,
      href: '/dashboard/flash-rti',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      title: 'File an RTI',
      subtitle: 'Section 6(1)',
      icon: FileText,
      href: '/dashboard/file-rti',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-100'
    },
    {
      title: 'Track Request',
      subtitle: 'Live CPIO status',
      icon: Crosshair,
      href: '/dashboard/track',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    {
      title: 'My RTIs',
      subtitle: '4 total filings',
      icon: FolderClosed,
      href: '/dashboard/my-requests',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
  ];

  return (
    <div className="w-full min-h-full bg-transparent relative overflow-hidden p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="relative z-10 space-y-5 sm:space-y-6 max-w-4xl mx-auto">
        
        {/* 1. Hero Greeting Section with Citizen Avatar & Soft Blue Halo */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide">
              {greeting}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Access your <span className="text-[#2563EB]">public rights.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 pt-0.5">
              <span>{userName}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker Verified
              </span>
            </p>
          </div>

          {/* Right: Soft Circular Gradient Halo with Citizen Avatar */}
          <Link 
            href="/dashboard/profile" 
            className="shrink-0 group block"
            title="View Profile"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-100 via-sky-50 to-blue-200/60 p-1 border-2 border-blue-200/70 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <ModernAvatar
                src={user?.avatar}
                name={userName}
                size="md"
                showBadge={true}
                status="verified"
                isInteractive={false}
              />
            </div>
          </Link>
        </div>

        {/* 2. Modern Pill Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-200/90 pl-4 sm:pl-5 pr-2 py-2 flex items-center gap-2.5 transition-all focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-500/15"
        >
          <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments, RTI records, gazettes..."
            className="flex-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium outline-none bg-transparent"
          />
          <button
            type="submit"
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Search / Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* 3. Blue Gradient Hero Card (Inspired by reference mockup) */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white p-5 sm:p-7 rounded-3xl shadow-xl shadow-blue-600/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Subtle Circular Decorative Gradients */}
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -right-4 -bottom-4 w-36 h-36 rounded-full bg-blue-400/20 blur-lg pointer-events-none" />

          <div className="space-y-1.5 relative z-10 max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold text-blue-100">
              <Sparkles className="w-3 h-3 text-blue-300" />
              <span>AI Public Discovery</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
              Instant Flash RTI
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
              Don&apos;t wait 30 days. Query audited gazette records across 2,000+ departments instantly.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/flash-rti"
                className="inline-flex items-center gap-2 bg-white text-[#1D4ED8] hover:bg-blue-50 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Launch Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex shrink-0 relative z-10 w-28 h-28 items-center justify-center">
            <ThreeDFlashLogo className="scale-85" />
          </div>
        </motion.div>

        {/* 4. "Our Services" 4-Card Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Our Services</h2>
            <Link 
              href="/dashboard/file-rti"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {quickServices.map((service) => {
              const IconComp = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="bg-white hover:bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center space-y-2 group cursor-pointer active:scale-95"
                >
                  <div className={`w-11 h-11 rounded-2xl ${service.bg} ${service.color} ${service.border} border flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium">
                      {service.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 5. "Active RTI Request" (Inspired by "Upcoming Appointment" in mockup) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Active RTI Request</h2>
            <Link 
              href="/dashboard/my-requests"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Link
            href="/dashboard/track?reg=RTI/2026/CBDT/89234"
            className="block bg-white hover:bg-slate-50/60 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 font-black text-xs font-mono">
                  CBDT
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      Shri R. K. Verma (Under Secretary & CPIO)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    Central Board of Direct Taxes • Income Tax
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-bold tracking-tight shrink-0">
                Under Processing
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <p className="font-medium text-slate-700 truncate max-w-md">
                Subject: Annual direct tax collection & Maharashtra regional breakdown FY25
              </p>
              <div className="flex items-center gap-3 font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> 10 Feb 2026
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <Clock className="w-3.5 h-3.5" /> 8 days left
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* 6. "Public Insights & Section 4(1)(b) Disclosures" (Inspired by "Health Insights" in mockup) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Public Insights & Disclosures</h2>
            <Link 
              href="/dashboard/flash-rti"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/flash-rti?query=National+Highway+Outlay"
              className="bg-white hover:bg-slate-50/60 p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 group transition-all"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">MoRTH Gazette</span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  National Highways Outlay 2025: ₹2.78 Lakh Cr Report
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Section 4(1)(b) • 3 min read
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </Link>

            <Link
              href="/dashboard/flash-rti?query=Income+tax+collected+from+Maharashtra"
              className="bg-white hover:bg-slate-50/60 p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 group transition-all"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">CBDT Revenue</span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Direct Taxes Maharashtra FY25 Annual Regional Disclosures
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Audited Record • 4 min read
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <Landmark className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>

        {/* 7. Key Portal Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1">
          {stats.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <div
                key={i}
                className="bg-slate-50/80 p-3.5 rounded-2xl sm:rounded-3xl border border-slate-200/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{stat.label}</span>
                  <IconComp className={`w-3.5 h-3.5 ${stat.color} shrink-0`} />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</span>
                  <span className="text-[10px] font-semibold text-slate-500 truncate">{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
