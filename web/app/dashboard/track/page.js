'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardBackgroundWave from '../../../components/DashboardBackgroundWave';
import { 
  Crosshair, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  FileText, 
  Download, 
  ShieldCheck,
  AlertCircle,
  Calendar
} from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialReg = searchParams.get('reg') || 'RTI/2026/CBDT/89234';
  const [regInput, setRegInput] = useState(initialReg);
  const [activeReg, setActiveReg] = useState(initialReg);

  const timelineSteps = [
    {
      title: "Application Received & Registered",
      timestamp: "10 Feb 2026, 10:45 AM",
      description: "Statutory filing logged under Section 6(1). ₹10 application fee verified through Bharatkosh portal.",
      status: "completed",
      badge: "Official Entry"
    },
    {
      title: "Central Public Information Officer (CPIO) Assigned",
      timestamp: "12 Feb 2026, 02:15 PM",
      description: "Allocated to Shri R. K. Verma, Under Secretary (Direct Taxes), Department of Revenue.",
      status: "completed",
      badge: "CPIO Action"
    },
    {
      title: "Section 5(4) Inter-Departmental Information Retrieval",
      timestamp: "18 Feb 2026, 11:30 AM",
      description: "Requisition sent to Systems Directorate for certified revenue audit tables and Maharashtra regional compilation.",
      status: "in_progress",
      badge: "In Process"
    },
    {
      title: "Final Statutory Reply Dispatch & Order Upload",
      timestamp: "Expected on or before 12 Mar 2026",
      description: "Signed reply document and accompanying certified Annexures will be uploaded and dispatched via Speed Post.",
      status: "pending",
      badge: "Statutory Deadline"
    }
  ];

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
                <Crosshair className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                Live RTI Request Tracker
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Real-time stage-by-stage statutory progression under the Right to Information Act, 2005.
            </p>
          </div>
        </div>

        {/* Search Input for Reg No */}
        <div className="bg-white/95 backdrop-blur-xs p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setActiveReg(regInput);
            }}
            className="flex flex-col sm:flex-row items-center gap-3.5"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={regInput}
                onChange={(e) => setRegInput(e.target.value)}
                placeholder="Enter RTI Registration Number (e.g. RTI/2026/CBDT/89234)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm sm:text-base font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-sm font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              Track Status
            </button>
          </form>
        </div>

        {/* Petition Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xs p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Registration Number</span>
              <span className="text-xl sm:text-2xl font-black text-[#2563EB] font-mono tracking-wide">{activeReg}</span>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
              <Clock className="w-4.5 h-4.5 text-amber-600" />
              <span>Under Processing (8 Days Remaining)</span>
            </div>
          </div>

          {/* CPIO & Authority Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Competent Authority</span>
              <p className="font-bold text-slate-900">Central Board of Direct Taxes</p>
              <p className="text-slate-500 text-xs">Ministry of Finance</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Assigned CPIO</span>
              <p className="font-bold text-slate-900">Shri R. K. Verma</p>
              <p className="text-slate-500 text-xs">Under Secretary & Nodal Officer</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Statutory Target Date</span>
              <p className="font-bold text-[#0B192C]">12 Mar 2026</p>
              <p className="text-slate-500 text-xs">30-Day Mandate (Sec 7(1))</p>
            </div>
          </div>

          {/* Vertical Timeline Progression */}
          <div className="space-y-6 pt-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
              Statutory Timeline Progression
            </h2>

            <div className="relative pl-7 sm:pl-9 space-y-6 before:content-[''] before:absolute before:left-[13px] sm:before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineSteps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in_progress';

                return (
                  <div key={idx} className="relative group">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[28px] sm:-left-[35px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ring-4 ring-white shadow-xs ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isInProgress
                        ? 'bg-[#2563EB] text-white animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">{step.title}</h4>
                        <span className="text-xs sm:text-sm font-semibold text-slate-500">{step.timestamp}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading Request Tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
