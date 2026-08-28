'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardBackgroundWave from '../../../components/DashboardBackgroundWave';
import { 
  FolderClosed, 
  Search, 
  Download, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

const SAMPLE_REQUESTS = [
  {
    id: 'req-1',
    regNo: 'RTI/2026/CBDT/89234',
    subject: 'Annual direct tax collection and region-wise breakdown FY 2024-25 from Maharashtra Zone',
    authority: 'Central Board of Direct Taxes (CBDT)',
    ministry: 'Ministry of Finance',
    dateFiled: '10 Feb 2026',
    targetDate: '12 Mar 2026',
    daysRemaining: 8,
    status: 'Under Processing',
    statusKey: 'processing',
    statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    pio: 'Shri R. K. Verma, Under Secretary & CPIO',
    feePaid: '₹10.00'
  },
  {
    id: 'req-2',
    regNo: 'RTI/2026/MORTH/4421',
    subject: 'Highway widening tender award & contractor evaluation for Mumbai-Goa NH-66 corridor',
    authority: 'National Highways Authority of India (NHAI)',
    ministry: 'Ministry of Road Transport and Highways',
    dateFiled: '18 Jan 2026',
    targetDate: '17 Feb 2026',
    daysRemaining: 0,
    status: 'Disposed (Reply Dispatched)',
    statusKey: 'disposed',
    statusColor: 'bg-green-50 text-green-800 border-green-200',
    pio: 'Shri M. K. Sharma, General Manager & CPIO',
    feePaid: '₹10.00'
  },
  {
    id: 'req-3',
    regNo: 'RTI/2025/MOHUA/9012',
    subject: 'Municipal ward drainage budget & contractor allotment under Swachh Bharat Mission (Urban)',
    authority: 'Ministry of Housing and Urban Affairs',
    ministry: 'Ministry of Housing and Urban Affairs',
    dateFiled: '05 Dec 2025',
    targetDate: '04 Jan 2026',
    daysRemaining: 0,
    status: 'Disposed',
    statusKey: 'disposed',
    statusColor: 'bg-green-50 text-green-800 border-green-200',
    pio: 'Dr. P. Swaminathan, Director & CPIO',
    feePaid: '₹10.00'
  },
  {
    id: 'req-4',
    regNo: 'RTI/2025/UIDAI/1823',
    subject: 'Aadhaar authentication error resolution protocols for biometric mismatch cases',
    authority: 'Unique Identification Authority of India (UIDAI)',
    ministry: 'Ministry of Electronics and IT',
    dateFiled: '14 Oct 2025',
    targetDate: '13 Nov 2025',
    daysRemaining: 0,
    status: 'Disposed',
    statusKey: 'disposed',
    statusColor: 'bg-green-50 text-green-800 border-green-200',
    pio: 'Smt. Anjali Rao, Deputy Director & CPIO',
    feePaid: '₹10.00'
  }
];

export default function MyRequestsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredRequests = SAMPLE_REQUESTS.filter((req) => {
    const matchesFilter = filter === 'all' || req.statusKey === filter;
    const matchesSearch = 
      req.regNo.toLowerCase().includes(search.toLowerCase()) ||
      req.subject.toLowerCase().includes(search.toLowerCase()) ||
      req.authority.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-white rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden p-6 sm:p-8 lg:p-10 space-y-6">
      {/* Consistent Dotted Wave Background from Landing Page */}
      <DashboardBackgroundWave />

      <div className="relative z-10 space-y-6 max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-50 text-[#2563EB] rounded-2xl">
                <FolderClosed className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                My RTI Applications
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Manage, track, and download certified replies for all your statutory RTI petitions.
            </p>
          </div>

          <Link
            href="/dashboard/file-rti"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 w-fit"
          >
            <FileText className="w-4 h-4" />
            <span>File New RTI</span>
          </Link>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Applications (4)' },
              { id: 'processing', label: 'Under Processing (1)' },
              { id: 'disposed', label: 'Disposed (3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Reg No, Keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 backdrop-blur-xs p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
            >
              {/* Top row: Registration Number & Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-[#2563EB] tracking-wide font-mono">
                    {req.regNo}
                  </span>
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${req.statusColor}`}>
                    {req.status}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
                  <span>Filed: <strong className="text-slate-800">{req.dateFiled}</strong></span>
                  <span>•</span>
                  <span>Statutory Fee: <strong className="text-slate-800">{req.feePaid}</strong></span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0B192C]">
                  {req.subject}
                </h2>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Public Authority</span>
                  <span className="text-slate-800 font-semibold">{req.authority}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Central PIO</span>
                  <span className="text-slate-800 font-semibold">{req.pio}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Statutory Resolution Timeline</span>
                  <span className={req.daysRemaining > 0 ? "text-amber-700 font-bold" : "text-green-700 font-bold"}>
                    {req.daysRemaining > 0 ? `${req.daysRemaining} days remaining (Target: ${req.targetDate})` : `Completed within 30-day mandate`}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/dashboard/track?reg=${req.regNo}`}
                    className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs"
                  >
                    <span>Track Timeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {req.statusKey === 'disposed' && (
                    <button
                      type="button"
                      onClick={() => alert(`Official signed reply document for ${req.regNo} downloaded.`)}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Certified Reply PDF</span>
                    </button>
                  )}
                </div>

                {req.statusKey === 'disposed' && (
                  <Link
                    href="/first-appeal"
                    className="text-xs sm:text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <Scale className="w-4 h-4" />
                    <span>File First Appeal under Section 19(1)</span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
