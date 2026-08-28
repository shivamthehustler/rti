'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardBackgroundWave from '../../../components/DashboardBackgroundWave';
import ThreeDFlashLogo from '../../../components/ThreeDFlashLogo';
import { 
  Search, 
  Loader2, 
  Landmark, 
  Filter, 
  FileText, 
  BarChart2, 
  CheckCircle2, 
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Zap
} from 'lucide-react';

const PRESET_QUERIES = {
  maharashtra: {
    query: "How much income tax was collected from Maharashtra in 2025?",
    authority: "Central Board of Direct Taxes (CBDT), Ministry of Finance",
    source: "Union Budget Annexures & OGD Portal (data.gov.in)",
    headline: "₹3,84,210 Crore (FY 2024–25)",
    summary: "As per proactively disclosed revenue figures by the Central Board of Direct Taxes (CBDT), Maharashtra contributed ₹3,84,210 Crore in net direct taxes (Corporation Tax + Personal Income Tax) during FY 2024-25, representing approx. 38.4% of total pan-India collections.",
    metrics: [
      { label: "Net Collection", value: "₹3.84 Lakh Cr" },
      { label: "National Share", value: "38.4%" },
      { label: "Corporate Tax", value: "₹1.98 Lakh Cr" },
      { label: "Personal I-T", value: "₹1.86 Lakh Cr" }
    ],
    citation: "CBDT Section 4(1)(b) Public Disclosure Matrix & PIB Financial Release No. 19283",
    date: "12 Feb 2026"
  },
  highways: {
    query: "How much was spent on national highways in 2025?",
    authority: "National Highways Authority of India (NHAI) / MoRTH",
    source: "Ministry of Road Transport and Highways Annual Capital Outlay",
    headline: "₹2,78,000 Crore Allocated & Executed",
    summary: "Under the Bharatmala Pariyojana and National Highway development budget for FY 2024–25, MoRTH and NHAI executed ₹2,78,000 Crore in capital expenditure across 12,450 km of highway construction and expressway corridors.",
    metrics: [
      { label: "Capital Outlay", value: "₹2.78 Lakh Cr" },
      { label: "Length Constructed", value: "12,450 km" },
      { label: "Expressways Spend", value: "₹84,500 Cr" },
      { label: "Average Pace", value: "34.1 km/day" }
    ],
    citation: "NHAI Audited Public EPC Disclosure & MoRTH Annual Performance Report 2025-26",
    date: "04 Feb 2026"
  }
};

export default function FlashRTIPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'running' | 'completed'
  const [activeResult, setActiveResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Default initial steps state exactly matching the user's reference mockup (Image 3)
  const initialSteps = [
    {
      id: 1,
      title: "Identifying concerned public authority",
      subtext: "Taking longer than usual",
      icon: Loader2,
      status: "idle" // Idle state on initial page load (NO processing badge)
    },
    {
      id: 2,
      title: "Find available government data sources",
      subtext: "Yet to start",
      icon: Landmark,
      status: "idle"
    },
    {
      id: 3,
      title: "Select most relevant data source",
      subtext: "Yet to start",
      icon: Filter,
      status: "idle"
    },
    {
      id: 4,
      title: "Retrieve necessary information the source",
      subtext: "Yet to start",
      icon: FileText,
      status: "idle"
    },
    {
      id: 5,
      title: "Converted raw fetched data to presentable form",
      subtext: "Yet to start",
      icon: BarChart2,
      status: "idle"
    }
  ];

  const [steps, setSteps] = useState(initialSteps);

  const startPipeline = (queryText) => {
    const text = queryText || searchQuery;
    if (!text.trim()) return;

    setSearchQuery(text);
    setPipelineState('running');
    setActiveResult(null);

    // Pick appropriate preset or generic result
    const lower = text.toLowerCase();
    let selectedData = PRESET_QUERIES.maharashtra;
    if (lower.includes('highway') || lower.includes('transport') || lower.includes('road') || lower.includes('nhai')) {
      selectedData = PRESET_QUERIES.highways;
    } else if (lower.includes('tax') || lower.includes('maharashtra') || lower.includes('income') || lower.includes('revenue')) {
      selectedData = PRESET_QUERIES.maharashtra;
    } else {
      selectedData = {
        query: text,
        authority: "Central Public Authority / Nodal Ministry",
        source: "Open Government Data Platform (data.gov.in) & Statutory Disclosures",
        headline: "Verified Public Records Extracted",
        summary: `Public information inquiry for "${text}" processed via automated Section 4(1)(b) proactive disclosure catalog. Relevant authority records and audited financial/administrative parameters retrieved.`,
        metrics: [
          { label: "Status", value: "Verified Public Record" },
          { label: "Authority Tier", value: "Central Government" },
          { label: "Confidence", value: "98.6%" },
          { label: "Access Fee", value: "₹0 Free Access" }
        ],
        citation: "Proactive Public Disclosure Portal Repository & Central Gazette Directory",
        date: "2026"
      };
    }

    // Step 1: Active in progress
    setSteps([
      {
        id: 1,
        title: "Identifying concerned public authority",
        subtext: `Target matched: ${selectedData.authority}`,
        icon: Loader2,
        status: "in_progress"
      },
      {
        id: 2,
        title: "Find available government data sources",
        subtext: "Waiting to query public repositories...",
        icon: Landmark,
        status: "waiting"
      },
      {
        id: 3,
        title: "Select most relevant data source",
        subtext: "Yet to start",
        icon: Filter,
        status: "waiting"
      },
      {
        id: 4,
        title: "Retrieve necessary information the source",
        subtext: "Yet to start",
        icon: FileText,
        status: "waiting"
      },
      {
        id: 5,
        title: "Converted raw fetched data to presentable form",
        subtext: "Yet to start",
        icon: BarChart2,
        status: "waiting"
      }
    ]);

    // Animate Step 1 -> Step 2
    setTimeout(() => {
      setSteps(prev => [
        { ...prev[0], subtext: `Identified: ${selectedData.authority}`, status: "completed" },
        { ...prev[1], subtext: "Searching National Data Portal & Gazette Archives...", status: "in_progress" },
        prev[2], prev[3], prev[4]
      ]);
    }, 700);

    // Animate Step 2 -> Step 3
    setTimeout(() => {
      setSteps(prev => [
        prev[0],
        { ...prev[1], subtext: "Disclosed datasets retrieved from official repository", status: "completed" },
        { ...prev[2], subtext: "Filtering high-confidence annual disclosures...", status: "in_progress" },
        prev[3], prev[4]
      ]);
    }, 1400);

    // Animate Step 3 -> Step 4
    setTimeout(() => {
      setSteps(prev => [
        prev[0], prev[1],
        { ...prev[2], subtext: "3 authoritative Section 4(1)(b) disclosures selected", status: "completed" },
        { ...prev[3], subtext: "Extracting official figures & verified tables...", status: "in_progress" },
        prev[4]
      ]);
    }, 2100);

    // Animate Step 4 -> Step 5
    setTimeout(() => {
      setSteps(prev => [
        prev[0], prev[1], prev[2],
        { ...prev[3], subtext: "Extracted official metrics and statutory gazette entries", status: "completed" },
        { ...prev[4], subtext: "Synthesizing structured citizen dossier...", status: "in_progress" }
      ]);
    }, 2700);

    // Completion
    setTimeout(() => {
      setSteps(prev => [
        prev[0], prev[1], prev[2], prev[3],
        { ...prev[4], subtext: "Structured presentation dossier ready", status: "completed" }
      ]);
      setPipelineState('completed');
      setActiveResult(selectedData);
    }, 3300);
  };

  const handleReset = () => {
    setSearchQuery('');
    setPipelineState('idle');
    setActiveResult(null);
    setSteps(initialSteps);
  };

  const handleCopy = () => {
    if (!activeResult) return;
    const textToCopy = `${activeResult.headline}\n\n${activeResult.summary}\n\nAuthority: ${activeResult.authority}\nCitation: ${activeResult.citation}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileRTIWithQuery = () => {
    const q = searchQuery || (activeResult ? activeResult.query : '');
    router.push(`/dashboard/file-rti?query=${encodeURIComponent(q)}`);
  };

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-white rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden p-6 sm:p-8 lg:p-12 flex flex-col justify-start items-center">
      {/* Dual-Sided Dotted Wave Pattern Mesh (Consistent with Landing Page) */}
      <DashboardBackgroundWave />

      {/* Main Content Area */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center relative z-10 space-y-6 sm:space-y-8 py-2 sm:py-4">
        
        {/* 3D Product Badge & Center Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Futuristic 3D Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pb-1"
          >
            <ThreeDFlashLogo />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-[#0B192C] tracking-tight"
          >
            Flash RTI
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl"
          >
            Search public information instantly with AI assistance.
          </motion.p>
        </div>

        {/* Search Input Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-2xl"
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              startPipeline();
            }}
            className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.08)] border border-slate-200/90 pl-5 sm:pl-6 pr-2.5 py-2.5 sm:py-3 flex items-center gap-3 transition-all focus-within:shadow-[0_10px_35px_rgba(37,99,235,0.15)] focus-within:border-[#2563EB]"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try "RTI request timeline & final status"...'
              className="flex-1 text-sm sm:text-base text-slate-800 placeholder-slate-400 font-medium outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={pipelineState === 'running'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
              aria-label="Search Flash RTI"
            >
              {pipelineState === 'running' ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              ) : (
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </form>
        </motion.div>

        {/* "Try asking" Label & Suggestion Chips */}
        <div className="flex flex-col items-center space-y-3 w-full">
          <span className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wide">
            Try asking
          </span>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 max-w-2xl">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("How much income tax was collected from Maharashtra in 2025?");
                startPipeline("How much income tax was collected from Maharashtra in 2025?");
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-white/90 hover:bg-white text-blue-700 hover:text-blue-800 border border-blue-200/90 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center"
            >
              How much income tax was collected from Maharashtra in 2025?
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("How much was spent on national highways?");
                startPipeline("How much was spent on national highways?");
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-white/90 hover:bg-white text-blue-700 hover:text-blue-800 border border-blue-200/90 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center"
            >
              How much was spent on national highways?
            </button>
          </div>
        </div>

        {/* 5 Real-Time Pipeline Execution Cards (Matching Reference Mockup Exactly) */}
        <div className="w-full max-w-2xl space-y-3 pt-1">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress' && pipelineState === 'running';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.04 }}
                className={`w-full bg-white rounded-2xl p-4 sm:p-4.5 border transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
                  isInProgress
                    ? 'border-blue-500 ring-2 ring-blue-500/15 shadow-md'
                    : isCompleted
                    ? 'border-green-200 bg-green-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  {/* Left Icon with Tinted Circle */}
                  <div 
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isInProgress
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    ) : (
                      <IconComp 
                        className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${
                          isInProgress ? 'animate-spin text-blue-600' : 'text-blue-600'
                        }`} 
                      />
                    )}
                  </div>

                  {/* Title and Subtext */}
                  <div className="min-w-0 space-y-0.5">
                    <h4 className={`text-sm sm:text-base font-bold tracking-tight truncate ${
                      isCompleted ? 'text-slate-900' : 'text-slate-800'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs sm:text-sm font-medium tracking-tight truncate ${
                      isInProgress 
                        ? 'text-blue-600 font-semibold' 
                        : isCompleted 
                        ? 'text-green-700' 
                        : 'text-slate-400'
                    }`}>
                      {step.subtext}
                    </p>
                  </div>
                </div>

                {/* Right Status Badge (ONLY visible when running/completed, NOT on idle) */}
                <div className="shrink-0 text-right">
                  {isCompleted && (
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                      Done ✓
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg animate-pulse">
                      Processing
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Result Dossier Card when complete */}
        <AnimatePresence>
          {pipelineState === 'completed' && activeResult && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full max-w-2xl bg-white border-2 border-blue-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6"
            >
              {/* Top Card Badge & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Instant Public Disclosure</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Audited Source</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    title="Reset Search"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Authority & Headline */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {activeResult.authority}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0B192C]">
                  {activeResult.headline}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {activeResult.summary}
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeResult.metrics.map((m, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase">{m.label}</p>
                    <p className="text-base sm:text-lg font-black text-blue-900">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Source Citation */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                <Landmark className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-slate-900">Official Citation: </span>
                  <span>{activeResult.citation}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleFileRTIWithQuery}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white py-3.5 px-5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Need Unaudited Records? File Formal RTI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 px-6 rounded-2xl text-sm font-semibold transition-colors cursor-pointer text-center"
                >
                  New Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
