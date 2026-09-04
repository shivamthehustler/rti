'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
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
    feePaid: '₹10.00',
    queryText: 'Requesting certified breakdown of annual direct tax collected from Maharashtra zone for FY 2024-25.',
    applicant: 'Shivam Gupta'
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
    feePaid: '₹10.00',
    queryText: 'Provide certified copies of tender awards and inspection certificates for NH-66 widening.',
    applicant: 'Shivam Gupta'
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
    feePaid: '₹10.00',
    queryText: 'Sanctioned funds and drainage expenditure details under Swachh Bharat Mission.',
    applicant: 'Shivam Gupta'
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
    feePaid: '₹10.00',
    queryText: 'Official circulars regarding biometric exception handling in Aadhaar verification.',
    applicant: 'Shivam Gupta'
  }
];

export default function MyRequestsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const userFiledRequests = useAppStore((state) => state.userFiledRequests);
  const loadFiledRequests = useAppStore((state) => state.loadFiledRequests);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (loadFiledRequests) {
      loadFiledRequests();
    }
  }, [loadFiledRequests]);

  // Combine user filed requests with sample requests
  const allRequests = [
    ...(userFiledRequests || []),
    ...SAMPLE_REQUESTS.filter(s => !userFiledRequests.some(u => u.regNo === s.regNo))
  ];

  const filteredRequests = allRequests.filter((req) => {
    const matchesFilter = filter === 'all' || req.statusKey === filter;
    const matchesSearch = 
      (req.regNo || '').toLowerCase().includes(search.toLowerCase()) ||
      (req.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (req.authority || req.publicAuthority || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countAll = allRequests.length;
  const countProcessing = allRequests.filter(r => r.statusKey === 'processing').length;
  const countDisposed = allRequests.filter(r => r.statusKey === 'disposed').length;

  const handleDownloadReceipt = async (req) => {
    setDownloadingId(req.id || req.regNo);

    try {
      const payload = {
        regNo: req.regNo || 'RTI/2026/GOV/00000',
        dateStr: req.dateFiled || req.date || '2026',
        targetDateStr: req.targetDate || '30 Days',
        name: req.applicant || req.name || user?.name || 'Applicant',
        email: req.email || user?.email || 'citizen.rti@gov.in',
        mobile: req.mobile || '9876543210',
        address: req.address || 'Flat 402, Shivajinagar, Pune - 411005',
        txnId: req.txnId || 'TXN51234567890',
        ministry: req.ministry || 'Government of India',
        publicAuthority: req.authority || req.publicAuthority || 'Public Authority',
        subject: req.subject || 'RTI Information Request',
        queryText: req.queryText || req.subject || 'Information requested under Section 6(1).',
        amount: req.feePaid || req.feeAmount || '₹10.00',
        paymentMode: req.paymentMode || 'Online Payment (UPI)'
      };

      const res = await fetch('/api/generate-receipt-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const safeReg = (req.regNo || 'receipt').replace(/[^a-zA-Z0-9_-]/g, '_');
        a.download = `RTI_Receipt_${safeReg}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        window.print();
      }
    } catch (e) {
      console.warn('PDF download fallback:', e);
      window.print();
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full min-h-full bg-transparent relative overflow-hidden p-4 sm:p-6 lg:p-8 space-y-6">
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
              Manage, track, and download official receipts and certified replies for all your statutory RTI petitions.
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
              { id: 'all', label: `All Applications (${countAll})` },
              { id: 'processing', label: `Under Processing (${countProcessing})` },
              { id: 'disposed', label: `Disposed (${countDisposed})` },
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
          {filteredRequests.map((req) => {
            const isCurrentDownloading = downloadingId === (req.id || req.regNo);
            return (
              <motion.div
                key={req.id || req.regNo}
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
                    <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${req.statusColor || 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
                    <span>Filed: <strong className="text-slate-800">{req.dateFiled || req.date}</strong></span>
                    <span>•</span>
                    <span>Statutory Fee: <strong className="text-slate-800">{req.feePaid || req.feeAmount || '₹10.00'}</strong></span>
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
                    <span className="text-slate-800 font-semibold">{req.authority || req.publicAuthority}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Central PIO</span>
                    <span className="text-slate-800 font-semibold">{req.pio || 'Central Public Information Officer'}</span>
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
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href={`/dashboard/track?reg=${req.regNo}`}
                      className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs"
                    >
                      <span>Track Timeline</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Download Official Receipt */}
                    <button
                      type="button"
                      disabled={isCurrentDownloading}
                      onClick={() => handleDownloadReceipt(req)}
                      className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {isCurrentDownloading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download Receipt (PDF)</span>
                        </>
                      )}
                    </button>

                    {req.statusKey === 'disposed' && (
                      <button
                        type="button"
                        onClick={() => alert(`Official signed reply document for ${req.regNo} downloaded.`)}
                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Certified Reply PDF</span>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

