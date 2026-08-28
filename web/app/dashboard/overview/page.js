'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import DashboardBackgroundWave from '../../../components/DashboardBackgroundWave';
import { 
  Zap, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  FolderClosed, 
  Crosshair,
  Building2,
  Sparkles
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAppStore();
  const userName = user?.name || 'Shivam Gupta';

  const stats = [
    { label: 'Total RTIs Filed', value: '4', change: '+1 this month', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Under Processing', value: '1', change: '8 days remaining', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Disposed / Resolved', value: '3', change: '100% compliance', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'First Appeals', value: '0', change: 'None pending', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  const recentRequests = [
    {
      regNo: 'RTI/2026/CBDT/89234',
      subject: 'Annual direct tax collection and region-wise breakdown FY 2024-25',
      authority: 'Central Board of Direct Taxes (CBDT)',
      date: '10 Feb 2026',
      status: 'Under Processing',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      pio: 'Shri R. K. Verma (Under Secretary)'
    },
    {
      regNo: 'RTI/2026/MORTH/4421',
      subject: 'Highway widening tender award for Mumbai-Goa NH-66 corridor',
      authority: 'National Highways Authority of India (NHAI)',
      date: '18 Jan 2026',
      status: 'Disposed',
      statusColor: 'bg-green-50 text-green-700 border-green-200',
      pio: 'Shri M. K. Sharma (General Manager)'
    },
    {
      regNo: 'RTI/2025/MOHUA/9012',
      subject: 'Municipal drainage budget & contractor allotment under Swachh Bharat',
      authority: 'Ministry of Housing and Urban Affairs',
      date: '05 Dec 2025',
      status: 'Disposed',
      statusColor: 'bg-green-50 text-green-700 border-green-200',
      pio: 'Dr. P. Swaminathan (Director)'
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-white rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden p-6 sm:p-8 lg:p-10 space-y-6">
      {/* Consistent Dotted Wave Background from Landing Page */}
      <DashboardBackgroundWave />

      <div className="relative z-10 space-y-6 max-w-5xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                Welcome back, {userName}
              </h1>
              <span className="p-1 bg-green-100 text-green-700 rounded-full" title="DigiLocker Verified">
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Citizen Dashboard | Statutory Portal for Right to Information, Government of India.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/flash-rti"
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Flash RTI</span>
            </Link>
            <Link
              href="/dashboard/file-rti"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>File New RTI</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/95 backdrop-blur-xs p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-3xl font-black text-[#0B192C]">{stat.value}</span>
                  <span className="text-xs font-semibold text-slate-500">{stat.change}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two Column Layout: Recent Applications + Quick Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Recent Applications (8 cols) */}
          <div className="lg:col-span-8 bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#0B192C]">Recent RTI Applications</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Live statutory status under the RTI Act, 2005</p>
              </div>
              <Link
                href="/dashboard/my-requests"
                className="text-xs sm:text-sm font-bold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentRequests.map((req) => (
                <div
                  key={req.regNo}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 transition-all bg-slate-50/60 hover:bg-white space-y-3 group shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-[#2563EB] tracking-wide font-mono">
                      {req.regNo}
                    </span>
                    <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${req.statusColor}`}>
                      {req.status}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {req.subject}
                  </h3>

                  <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-medium">{req.authority}</span>
                    <div className="flex items-center gap-3">
                      <span>Filed: <strong>{req.date}</strong></span>
                      <Link
                        href={`/dashboard/track?reg=${req.regNo}`}
                        className="text-[#2563EB] font-bold hover:underline"
                      >
                        Track →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Quick Portal Tools & Proactive Disclosures (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Flash RTI Card */}
            <div className="bg-gradient-to-br from-[#0B1C3F] to-[#1E3A8A] text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-3.5 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-blue-300 backdrop-blur-xs">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Instant Flash RTI Engine</h3>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
                Don't wait 30 days for proactive public disclosures. Query audited gazette records across 2,000+ departments instantly with AI assistance.
              </p>
              <Link
                href="/dashboard/flash-rti"
                className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md"
              >
                <span>Launch Flash RTI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Proactive Disclosures Highlights */}
            <div className="bg-white/95 backdrop-blur-xs p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Section 4(1)(b) Disclosures
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-0.5">
                  <p className="font-bold text-blue-900">National Highways Outlay 2025</p>
                  <p className="text-xs text-slate-600">₹2.78 Lakh Cr capital expenditure report uploaded.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <p className="font-bold text-slate-800">Direct Taxes Maharashtra FY25</p>
                  <p className="text-xs text-slate-600">CBDT annual regional revenue disclosure published.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
