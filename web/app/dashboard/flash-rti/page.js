'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDFlashLogo from '../../../components/ThreeDFlashLogo';
import { 
  Search, 
  Loader2, 
  Landmark, 
  Filter, 
  FileText, 
  Compass,
  Database,
  BarChart2, 
  CheckCircle2, 
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
  X,
  CornerDownLeft,
  Table as TableIcon,
  GraduationCap,
  Train,
  HeartPulse,
  Sprout,
  SunMedium,
  Smartphone,
  Trees,
  Building2,
  ArrowUpDown,
  Download,
  SlidersHorizontal,
  ListFilter,
  Clock,
  History
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

const INITIAL_STEPS = [
  {
    id: 0,
    title: "Identifying concerned public authority",
    subtext: "Ministry / Department routing",
    icon: Compass,
    status: "idle" // 'idle' | 'in_progress' | 'completed' | 'error'
  },
  {
    id: 1,
    title: "Find available government data sources",
    subtext: "Query official open registries",
    icon: Database,
    status: "idle"
  },
  {
    id: 2,
    title: "Select most relevant data source",
    subtext: "Relevance & jurisdiction scoring",
    icon: Filter,
    status: "idle"
  },
  {
    id: 3,
    title: "Retrieve necessary information from source",
    subtext: "Direct statutory record fetch",
    icon: FileText,
    status: "idle"
  },
  {
    id: 4,
    title: "Convert raw fetched data to presentable form",
    subtext: "Structured disclosure synthesis",
    icon: BarChart2,
    status: "idle"
  }
];

// Rich Interactive Data Table Component with Sorting, Filtering, and Serial Order Controls
const ResultTable = memo(function ResultTable({ data = [] }) {
  const headers = useMemo(() => data[0] || [], [data]);
  const rawRows = useMemo(() => data.slice(1), [data]);

  // Determine initial default sorting column
  const defaultSortConfig = useMemo(() => {
    if (!headers || headers.length === 0) return null;
    
    // 1. Check for Rank column -> Sort Ascending (Rank 1, 2, 3...)
    const rankIdx = headers.findIndex(h => /rank/i.test(String(h)));
    if (rankIdx !== -1) {
      return { index: rankIdx, direction: "asc" };
    }

    // 2. Check for numeric metrics/amounts -> Sort Descending (highest first)
    const metricIdx = headers.findIndex(h => /(cr|amount|capex|outlay|disbursed|volume|settled|capacity|mw|lakh|enrollment|wages)/i.test(String(h)));
    if (metricIdx !== -1) {
      return { index: metricIdx, direction: "desc" };
    }

    return { index: 0, direction: "asc" };
  }, [headers]);

  const [userSortConfig, setUserSortConfig] = useState(null);
  const sortConfig = userSortConfig || defaultSortConfig;
  const [filterText, setFilterText] = useState("");
  const [limitFilter, setLimitFilter] = useState("all"); // 'all' | '5' | '10'
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Helper to detect numeric/metric columns for right-aligned tabular nums
  const isColumnNumeric = useCallback((colIdx) => {
    const header = headers[colIdx] || '';
    if (/(cr|amount|capex|outlay|disbursed|volume|settled|capacity|mw|lakh|enrollment|wages|rate|cost|budget|percent|%|₹|rs|score|rank|index|count)/i.test(header)) {
      return true;
    }
    // Check non-null cell samples
    const samples = rawRows.slice(0, 5).map(r => r[colIdx]).filter(v => v !== null && v !== undefined && v !== '-' && v !== '');
    if (samples.length > 0) {
      return samples.every(v => {
        const clean = String(v).replace(/[,₹%\s]/g, '');
        return !isNaN(parseFloat(clean)) && isFinite(clean);
      });
    }
    return false;
  }, [headers, rawRows]);

  // Filter rows based on live search text
  const filteredRows = useMemo(() => {
    if (!filterText.trim()) return rawRows;
    const lower = filterText.toLowerCase();
    return rawRows.filter(row => 
      row.some(cell => cell != null && String(cell).toLowerCase().includes(lower))
    );
  }, [rawRows, filterText]);

  // Sort rows based on sort configuration
  const sortedRows = useMemo(() => {
    let rows = [...filteredRows];

    if (sortConfig) {
      rows.sort((a, b) => {
        const aVal = a[sortConfig.index];
        const bVal = b[sortConfig.index];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        // Try numeric comparison first
        const aNum = parseFloat(String(aVal).replace(/[,₹%\s]/g, ""));
        const bNum = parseFloat(String(bVal).replace(/[,₹%\s]/g, ""));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return (aNum - bNum) * (sortConfig.direction === "asc" ? 1 : -1);
        }

        // Fallback to locale string comparison
        return String(aVal).localeCompare(String(bVal), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * (sortConfig.direction === "asc" ? 1 : -1);
      });
    }

    if (limitFilter === "5") return rows.slice(0, 5);
    if (limitFilter === "10") return rows.slice(0, 10);
    return rows;
  }, [filteredRows, sortConfig, limitFilter]);

  const handleSort = (index) => {
    setUserSortConfig((currUser) => {
      const curr = currUser || defaultSortConfig;
      if (!curr || curr.index !== index) {
        const isRank = /rank/i.test(String(headers[index]));
        return { index, direction: isRank ? "asc" : "desc" };
      }
      if (curr.direction === "asc") {
        return { index, direction: "desc" };
      }
      return { index, direction: "asc" };
    });
  };

  const toggleSortDirection = () => {
    if (!sortConfig) return;
    setUserSortConfig(currUser => {
      const curr = currUser || defaultSortConfig;
      return {
        ...curr,
        direction: curr.direction === "asc" ? "desc" : "asc"
      };
    });
  };

  const handleCopyCSV = () => {
    if (!headers.length) return;
    const csvContent = [
      ["#", ...headers].join(","),
      ...sortedRows.map((row, idx) => [idx + 1, ...row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`)].join(","))
    ].join("\n");

    navigator.clipboard.writeText(csvContent);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handleDownloadCSV = () => {
    if (!headers.length) return;
    const csvContent = [
      ["#", ...headers].join(","),
      ...sortedRows.map((row, idx) => [idx + 1, ...row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`)].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `official_disclosure_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) return null;

  const currentSortHeader = sortConfig != null && headers[sortConfig.index] ? headers[sortConfig.index] : "Default";

  return (
    <div className="w-full space-y-3.5 sm:space-y-4">
      {/* Control Commands & Filter Bar */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xs space-y-2.5 sm:space-y-3">
        
        {/* Row 1: Full-Width Live Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter records by state, department, metric, value..."
            className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all font-medium shadow-2xs"
          />
          {filterText && (
            <button
              type="button"
              onClick={() => setFilterText("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              title="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Row 2: Sort, Scope Limits, and Actions (Responsive Grid / Flex) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          
          {/* Group A: Smart Sort (Select Dropdown + Unsquishable Direction Toggle) */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Sort Select Box */}
            <div className="flex-1 lg:flex-initial flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs min-w-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Sort:</span>
              <select
                value={sortConfig?.index ?? 0}
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  const isRank = /rank/i.test(String(headers[idx]));
                  setUserSortConfig({ index: idx, direction: isRank ? "asc" : "desc" });
                }}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer w-full lg:max-w-[170px] xl:max-w-[210px] truncate py-0.5"
              >
                {headers.map((h, idx) => (
                  <option key={idx} value={idx}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Asc / Desc Toggle Button (whitespace-nowrap & shrink-0 so it NEVER wraps into 4 lines on mobile) */}
            <button
              type="button"
              onClick={toggleSortDirection}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                sortConfig?.direction === "desc"
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200/60"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
              }`}
              title={`Current Order: ${sortConfig?.direction === "asc" ? "Ascending (Lowest/Rank 1 first)" : "Descending (Highest first)"}. Click to flip.`}
            >
              {sortConfig?.direction === "asc" ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-[11px] tracking-tight">Asc (1→9)</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-[11px] tracking-tight">Desc (9→1)</span>
                </>
              )}
            </button>
          </div>

          {/* Group B: Scope Selector & Action Buttons (Mobile full-width split, Desktop inline) */}
          <div className="flex items-center justify-between gap-2 w-full lg:w-auto">
            {/* Limit Switcher (All / Top 5 / Top 10) */}
            <div className="flex-1 lg:flex-initial flex items-center justify-around lg:justify-start bg-slate-200/80 p-0.5 sm:p-1 rounded-xl text-[11px] font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setLimitFilter("all")}
                className={`flex-1 lg:flex-initial px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer text-center ${
                  limitFilter === "all"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "hover:text-slate-900"
                }`}
              >
                All ({rawRows.length})
              </button>
              <button
                type="button"
                onClick={() => setLimitFilter("5")}
                className={`flex-1 lg:flex-initial px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer text-center ${
                  limitFilter === "5"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "hover:text-slate-900"
                }`}
              >
                Top 5
              </button>
              <button
                type="button"
                onClick={() => setLimitFilter("10")}
                className={`flex-1 lg:flex-initial px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer text-center ${
                  limitFilter === "10"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "hover:text-slate-900"
                }`}
              >
                Top 10
              </button>
            </div>

            {/* CSV Export & Copy Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyCSV}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-600 border border-slate-200/90 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                title="Copy Table as CSV"
              >
                {copiedStatus ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 text-[11px] font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px]">Copy CSV</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadCSV}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-600 border border-slate-200/90 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                title="Download CSV file"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px]">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Status & Feedback Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 font-medium px-1 pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="leading-tight">
              Showing <strong className="text-slate-900 font-bold">{sortedRows.length}</strong> of {rawRows.length} verified records
            </span>
            {filterText && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md text-[10.5px] sm:text-[11px] border border-blue-200">
                Matching &ldquo;{filterText}&rdquo;
                <button type="button" onClick={() => setFilterText("")} className="hover:text-blue-900 cursor-pointer ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-slate-500 leading-tight">
            <span>
              Sorted: <strong className="text-slate-800 font-bold">{currentSortHeader}</strong> ({sortConfig?.direction === "asc" ? "Asc 1→9" : "Desc 9→1"})
            </span>
            <span className="hidden lg:inline text-slate-400">• Click headers to switch sort</span>
          </div>
        </div>
      </div>

      {/* Table Scroll Area with Mobile Scroll Cue */}
      <div className="space-y-1.5">
        <div className="w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-full">
            <thead className="bg-slate-100/95 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                {/* Serial Number Column */}
                <th className="px-2.5 sm:px-3.5 py-3 sm:py-3.5 font-bold text-slate-500 w-10 sm:w-14 text-center select-none bg-slate-100/95">
                  #
                </th>
                {headers.map((header, idx) => {
                  const isSorted = sortConfig?.index === idx;
                  const isNumeric = isColumnNumeric(idx);
                  return (
                    <th
                      key={idx}
                      onClick={() => handleSort(idx)}
                      className={`px-3 sm:px-5 py-3 sm:py-3.5 cursor-pointer transition-colors select-none font-bold text-slate-800 hover:bg-slate-200/80 ${
                        isNumeric ? "text-right" : "text-left"
                      } ${
                        isSorted ? "bg-blue-50/80 text-blue-900 border-b-2 border-blue-600" : ""
                      }`}
                      title={`Click to sort by ${header}`}
                    >
                      <div className={`flex items-center gap-1.5 ${isNumeric ? "justify-end" : "justify-between"}`}>
                        <span className="truncate">{header}</span>
                        <span className="text-slate-400 shrink-0">
                          {isSorted ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-30 hover:opacity-75" />
                          )}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {sortedRows.length > 0 ? (
                sortedRows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-blue-50/50 transition-colors odd:bg-white even:bg-slate-50/40"
                  >
                    {/* Serial Number Cell */}
                    <td className="px-2.5 sm:px-3.5 py-3 sm:py-3.5 text-center text-slate-400 font-bold text-xs">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[11px]">
                        {rowIdx + 1}
                      </span>
                    </td>
                    {row.map((cell, cellIdx) => {
                      const isSortedColumn = sortConfig?.index === cellIdx;
                      const isNumeric = isColumnNumeric(cellIdx);
                      const isPrimaryText = cellIdx === 0 && !isNumeric;
                      return (
                        <td 
                          key={cellIdx} 
                          className={`px-3 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap ${
                            isNumeric ? "text-right tabular-nums font-semibold" : "text-left"
                          } ${
                            isPrimaryText ? "font-bold text-slate-900" : ""
                          } ${
                            isSortedColumn ? "font-semibold text-slate-900 bg-blue-50/25" : ""
                          }`}
                        >
                          {cell !== null && cell !== undefined ? String(cell) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length + 1} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="w-6 h-6 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">No records match your filter &ldquo;{filterText}&rdquo;</p>
                      <button
                        type="button"
                        onClick={() => setFilterText("")}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile Horizontal Scroll Cue */}
        <div className="flex sm:hidden items-center justify-between text-[10.5px] text-slate-400 font-medium px-1">
          <span>← Swipe table horizontally for more data →</span>
          <span>{headers.length} columns</span>
        </div>
      </div>
    </div>
  );
});

function FlashRTIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const historyIdParam = searchParams.get('historyId');
  const queryParam = searchParams.get('query');
  const historyList = useAppStore((state) => state.historyList);

  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'running' | 'completed' | 'error'
  const [activeResult, setActiveResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [steps, setSteps] = useState(INITIAL_STEPS);

  const abortControllerRef = useRef(null);
  const searchInputRef = useRef(null);
  const processedParamRef = useRef(null);

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    processedParamRef.current = 'reset_' + Date.now();
    setSearchQuery('');
    setPipelineState('idle');
    setActiveResult(null);
    setErrorMessage(null);
    setSteps(INITIAL_STEPS);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('flash_rti_force_new');
      try {
        window.history.replaceState(null, '', '/dashboard/flash-rti');
      } catch (e) {}
    }
    const focusInput = () => {
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
        searchInputRef.current.focus();
        searchInputRef.current.select();
      }
    };
    focusInput();
    setTimeout(focusInput, 50);
    setTimeout(focusInput, 150);
  }, []);

  // Authentic cancellation-safe delay helper for realistic AI agent pacing
  const sleepWithSignal = (ms, signal) => new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });

  // Real Backend Execution Engine with Deep Multi-Agent Pacing (Total ~25s across 5 Steps)
  const startPipeline = useCallback(async (queryText) => {
    const text = queryText !== undefined ? queryText : searchQuery;
    if (!text || !text.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSearchQuery(text);
    setPipelineState('running');
    setActiveResult(null);
    setErrorMessage(null);

    // Initialize Step 0 as in-progress with first subphase
    setSteps(INITIAL_STEPS.map((s, idx) => ({
      ...s,
      status: idx === 0 ? "in_progress" : "idle",
      subtext: idx === 0 ? "Analyzing constitutional jurisdiction & subject matter..." : "Yet to start"
    })));

    try {
      // ==========================================
      // Step 0: Identify concerned public authority (~5.0s)
      // ==========================================
      const fetchPromise0 = fetch("/api/run-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 0, query: text.trim(), context: {} }),
        signal: controller.signal,
      }).then(r => r.json());

      // Phase 1 (0ms - 1700ms)
      await sleepWithSignal(1700, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 2 (1700ms - 3400ms)
      setSteps(prev => prev.map((s, idx) => idx === 0 ? {
        ...s,
        status: "in_progress",
        subtext: "Mapping Allocation of Business Rules across 58 Central Ministries..."
      } : s));
      await sleepWithSignal(1700, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 3 (3400ms - 5000ms)
      setSteps(prev => prev.map((s, idx) => idx === 0 ? {
        ...s,
        status: "in_progress",
        subtext: "Resolving Nodal Public Authority & Central Public Information Officer (CPIO)..."
      } : s));
      await sleepWithSignal(1600, controller.signal);
      if (controller.signal.aborted) return;

      const data0 = await fetchPromise0;
      if (controller.signal.aborted) return;

      if (data0.status === "error" || !data0.details) {
        const err = data0.error || "Could not identify concerned Public Authority.";
        setSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: "error", subtext: err } : s));
        setErrorMessage(err);
        setPipelineState('error');
        return;
      }

      const authorityName = data0.details?.authority?.name || data0.details?.authority?.id || "Identified Public Authority";
      setSteps(prev => prev.map((s, idx) => {
        if (idx === 0) return { ...s, status: "completed", subtext: `Target matched: ${authorityName}` };
        if (idx === 1) return { ...s, status: "in_progress", subtext: "Connecting to Open Government Data (data.gov.in) & Gazette archives..." };
        return s;
      }));

      // ==========================================
      // Step 1: Find available government data sources (~5.0s)
      // ==========================================
      const fetchPromise1 = fetch("/api/run-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, query: text.trim(), context: { authorityData: data0.details } }),
        signal: controller.signal,
      }).then(r => r.json());

      // Phase 1 (0ms - 1700ms)
      await sleepWithSignal(1700, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 2 (1700ms - 3400ms)
      setSteps(prev => prev.map((s, idx) => idx === 1 ? {
        ...s,
        status: "in_progress",
        subtext: "Scanning Section 4(1)(b) Proactive Disclosure registries & statistical releases..."
      } : s));
      await sleepWithSignal(1700, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 3 (3400ms - 5000ms)
      setSteps(prev => prev.map((s, idx) => idx === 1 ? {
        ...s,
        status: "in_progress",
        subtext: "Enumerating REST API gateways, open data catalogs & tabular datasets..."
      } : s));
      await sleepWithSignal(1600, controller.signal);
      if (controller.signal.aborted) return;

      const data1 = await fetchPromise1;
      if (controller.signal.aborted) return;

      if (data1.status === "error" || !data1.details) {
        const err = data1.error || "No data APIs available from this authority.";
        setSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: "error", subtext: err } : s));
        setErrorMessage(err);
        setPipelineState('error');
        return;
      }

      const servicesCount = Array.isArray(data1.details) ? data1.details.length : 1;
      setSteps(prev => prev.map((s, idx) => {
        if (idx === 1) return { ...s, status: "completed", subtext: `${servicesCount} official government API source(s) found` };
        if (idx === 2) return { ...s, status: "in_progress", subtext: "Evaluating statutory data schema, periodicity & parameter models..." };
        return s;
      }));

      // ==========================================
      // Step 2: Select most relevant data source (~4.5s)
      // ==========================================
      const fetchPromise2 = fetch("/api/run-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, query: text.trim(), context: { services: data1.details } }),
        signal: controller.signal,
      }).then(r => r.json());

      // Phase 1 (0ms - 1500ms)
      await sleepWithSignal(1500, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 2 (1500ms - 3000ms)
      setSteps(prev => prev.map((s, idx) => idx === 2 ? {
        ...s,
        status: "in_progress",
        subtext: "Running jurisdictional semantic scoring & temporal filter matching..."
      } : s));
      await sleepWithSignal(1500, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 3 (3000ms - 4500ms)
      setSteps(prev => prev.map((s, idx) => idx === 2 ? {
        ...s,
        status: "in_progress",
        subtext: "Selecting highest-confidence authorized endpoint with complete records..."
      } : s));
      await sleepWithSignal(1500, controller.signal);
      if (controller.signal.aborted) return;

      const data2 = await fetchPromise2;
      if (controller.signal.aborted) return;

      if (data2.status === "error" || !data2.details) {
        const err = data2.error || "Could not match suitable service for this query.";
        setSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: "error", subtext: err } : s));
        setErrorMessage(err);
        setPipelineState('error');
        return;
      }

      const serviceName = data2.details?.service?.name || "Official Public API Service";
      setSteps(prev => prev.map((s, idx) => {
        if (idx === 2) return { ...s, status: "completed", subtext: `Service matched: ${serviceName}` };
        if (idx === 3) return { ...s, status: "in_progress", subtext: "Establishing authenticated session with statutory data endpoint..." };
        return s;
      }));

      // ==========================================
      // Step 3: Retrieve necessary information from source (~5.5s)
      // ==========================================
      const fetchPromise3 = fetch("/api/run-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 3, query: text.trim(), context: { serviceData: data2.details } }),
        signal: controller.signal,
      }).then(r => r.json());

      // Phase 1 (0ms - 1800ms)
      await sleepWithSignal(1800, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 2 (1800ms - 3600ms)
      setSteps(prev => prev.map((s, idx) => idx === 3 ? {
        ...s,
        status: "in_progress",
        subtext: "Extracting proactive disclosure records, budget line-items & audit tables..."
      } : s));
      await sleepWithSignal(1800, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 3 (3600ms - 5500ms)
      setSteps(prev => prev.map((s, idx) => idx === 3 ? {
        ...s,
        status: "in_progress",
        subtext: "Validating data completeness, cryptographic checksums & audit figures..."
      } : s));
      await sleepWithSignal(1900, controller.signal);
      if (controller.signal.aborted) return;

      const data3 = await fetchPromise3;
      if (controller.signal.aborted) return;

      if (data3.status === "error" || !data3.details) {
        const err = data3.error || "Failed to retrieve records from the endpoint.";
        setSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: "error", subtext: err } : s));
        setErrorMessage(err);
        setPipelineState('error');
        return;
      }

      const recCount = Array.isArray(data3.details) ? data3.details.length : 1;
      setSteps(prev => prev.map((s, idx) => {
        if (idx === 3) return { ...s, status: "completed", subtext: `${recCount} verified statutory record(s) fetched` };
        if (idx === 4) return { ...s, status: "in_progress", subtext: "Structuring multi-dimensional comparative matrices & financial aggregates..." };
        return s;
      }));

      // ==========================================
      // Step 4: Convert raw fetched data to presentable form (~5.0s)
      // ==========================================
      const fetchPromise4 = fetch("/api/run-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 4, query: text.trim(), context: { data: data3.details } }),
        signal: controller.signal,
      }).then(r => r.json());

      // Phase 1 (0ms - 1700ms)
      await sleepWithSignal(1700, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 2 (1700ms - 3400ms)
      setSteps(prev => prev.map((s, idx) => idx === 4 ? {
        ...s,
        status: "in_progress",
        subtext: "Generating legal sufficiency analysis & Section 4 compliance summary..."
      } : s));
      await sleepWithSignal(1700, controller.signal);
      if (controller.signal.aborted) return;

      // Phase 3 (3400ms - 5000ms)
      setSteps(prev => prev.map((s, idx) => idx === 4 ? {
        ...s,
        status: "in_progress",
        subtext: "Formatting official Flash RTI Intelligence Dossier & verification seals..."
      } : s));
      await sleepWithSignal(1600, controller.signal);
      if (controller.signal.aborted) return;

      const data4 = await fetchPromise4;
      if (controller.signal.aborted) return;

      if (data4.status === "error" || !data4.details) {
        const err = data4.error || "Failed to synthesize final presentation.";
        setSteps(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: "error", subtext: err } : s));
        setErrorMessage(err);
        setPipelineState('error');
        return;
      }

      setSteps(prev => prev.map((s) => ({
        ...s,
        status: "completed",
        subtext: s.id === 4 ? "Structured presentation dossier ready" : s.subtext
      })));

      setActiveResult(data4.details);
      setPipelineState('completed');

      // Save to real history API & local storage
      try {
        const newHistItem = {
          id: 'hist-' + Date.now(),
          query: text.trim(),
          created_at: new Date().toISOString(),
          data: {
            status: "success",
            result: data4.details
          }
        };

        if (typeof window !== "undefined") {
          try {
            // 1. Update full dossier cache
            const cached = JSON.parse(localStorage.getItem('rti_flash_history_cached') || '[]');
            const updatedCached = [newHistItem, ...cached.filter(h => h.query?.toLowerCase() !== text.trim().toLowerCase())].slice(0, 50);
            localStorage.setItem('rti_flash_history_cached', JSON.stringify(updatedCached));

            // 2. Save to custom query registry for cross-tab sync
            const customSearches = JSON.parse(localStorage.getItem('rti_flash_custom_searches') || '[]');
            const updatedCustom = [newHistItem, ...customSearches.filter(h => h.query?.toLowerCase() !== text.trim().toLowerCase())].slice(0, 50);
            localStorage.setItem('rti_flash_custom_searches', JSON.stringify(updatedCustom));

            // 3. Broadcast cross-tab storage signal
            localStorage.setItem('rti_flash_history_signal', String(Date.now()));
          } catch (e) {}
        }

        const saveRes = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: text.trim(),
            data: {
              status: "success",
              result: data4.details
            }
          })
        });

        if (saveRes.ok) {
          const savedData = await saveRes.json();
          if (savedData?.entry?.id) {
            newHistItem.id = savedData.entry.id;
          }
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("flash_rti_history_updated"));
        }
      } catch (historySaveErr) {
        console.warn("History save error:", historySaveErr);
      }

    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("Pipeline error:", err);
      const errMsg = err.message || "An unexpected error occurred while communicating with the backend.";
      setErrorMessage(errMsg);
      setPipelineState('error');
    }
  }, [searchQuery]);

  // Listen to reset search event from sidebar + New button
  useEffect(() => {
    const handleResetEvent = () => {
      handleReset();
    };

    window.addEventListener('flash_rti_reset_search', handleResetEvent);
    return () => {
      window.removeEventListener('flash_rti_reset_search', handleResetEvent);
    };
  }, [handleReset]);

  // Load history session when historyId is in URL, or trigger initial query, or handle forced new
  useEffect(() => {
    const isForcedNew = typeof window !== 'undefined' && (
      window.sessionStorage.getItem('flash_rti_force_new') === '1' ||
      searchParams.get('new')
    );
    if (isForcedNew) {
      handleReset();
      return;
    }

    if (historyIdParam && processedParamRef.current !== `history_${historyIdParam}`) {
      processedParamRef.current = `history_${historyIdParam}`;
      const loadHistorySession = async () => {
        try {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }

          // 1. Try local cache for instant zero-latency loading
          if (typeof window !== "undefined") {
            try {
              const cached = JSON.parse(localStorage.getItem('rti_flash_history_cached') || '[]');
              const matched = cached.find(h => String(h.id) === String(historyIdParam) || h.query?.toLowerCase() === historyIdParam.toLowerCase());
              if (matched && matched.data?.result) {
                setSearchQuery(matched.query || '');
                setActiveResult(matched.data.result);
                setPipelineState('completed');
                setSteps(INITIAL_STEPS.map(s => ({
                  ...s,
                  status: 'completed',
                  subtext: 'Verified from archive'
                })));
                return;
              }
            } catch (e) {}
          }

          // 2. Fetch from production backend API / PostgreSQL database
          const res = await fetch(`/api/history?id=${encodeURIComponent(historyIdParam)}`);
          if (res.ok) {
            const historyItem = await res.json();
            if (historyItem) {
              setSearchQuery(historyItem.query || '');
              if (historyItem.data?.result) {
                setActiveResult(historyItem.data.result);
                setPipelineState('completed');
                setSteps(INITIAL_STEPS.map(s => ({
                  ...s,
                  status: 'completed',
                  subtext: 'Verified from archive'
                })));
                return;
              }
            }
          }
        } catch (err) {
          console.error("Failed to load history session:", err);
        }
      };
      loadHistorySession();
    } else if (queryParam && processedParamRef.current !== `query_${queryParam}`) {
      processedParamRef.current = `query_${queryParam}`;
      startPipeline(queryParam);
    }
  }, [searchParams, historyIdParam, queryParam, startPipeline, handleReset]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleCopy = () => {
    if (!activeResult) return;
    let textToCopy = `Query: ${searchQuery}\n\n`;
    if (activeResult.report_data && Array.isArray(activeResult.report_data)) {
      activeResult.report_data.forEach(item => {
        if (item.type === 'plain') {
          textToCopy += `${item.content}\n\n`;
        } else if (item.type === 'table') {
          if (item.title) textToCopy += `${item.title}:\n`;
          if (Array.isArray(item.content)) {
            textToCopy += item.content.map(row => row.join('\t')).join('\n') + '\n\n';
          }
        }
      });
    }
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileRTIWithQuery = () => {
    router.push(`/dashboard/file-rti?query=${encodeURIComponent(searchQuery)}`);
  };

  // Auto-focus search input when navigated with ?focus=1 or on event
  useEffect(() => {
    if (searchParams.get('focus') === '1') {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }

    const handleFocusEvent = () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener('flash_rti_focus_search', handleFocusEvent);
    return () => {
      window.removeEventListener('flash_rti_focus_search', handleFocusEvent);
    };
  }, [searchParams]);

  return (
    <div className="w-full min-h-full bg-transparent relative overflow-hidden px-4 sm:px-8 md:px-10 lg:px-14 py-6 sm:py-10 md:py-16 flex flex-col justify-start items-center">
      {/* Main Content Container - Centered with Generous Breathing Room */}
      <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 space-y-6 sm:space-y-8 md:space-y-9">
        
        {/* Header: Centered 3D Flash Logo + Modern Title & Subtitle (No bar above logo) */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-3 sm:space-y-3.5 pt-1 sm:pt-2">
          {/* Glowing 3D Flash RTI Badge */}
          <ThreeDFlashLogo className="mb-1 scale-90 sm:scale-100" />

          {/* Title and Subtitle */}
          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Flash RTI
            </h1>
            <p className="text-xs sm:text-base text-slate-500 font-medium max-w-lg mx-auto leading-relaxed px-2">
              Instant AI discovery across official government repositories, pre-disclosed datasets, and gazette archives.
            </p>
          </div>
        </div>

        {/* Mobile Quick Action Bar (History & New Search) */}
        <div className="flex sm:hidden items-center justify-between gap-2 w-full max-w-2xl px-1 -mb-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("flash_rti_open_mobile_history"));
              }
            }}
            className="flex-1 py-2 px-3 bg-white/95 border border-slate-200/90 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Recent Queries {historyList?.length > 0 ? `(${historyList.length})` : ''}</span>
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="py-2 px-3.5 bg-white/95 border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-slate-500 shrink-0" />
            <span>New Search</span>
          </button>
        </div>

        {/* Centered Modern Command Search Input Bar */}
        <div className="w-full max-w-2xl sm:max-w-3xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              startPipeline();
            }}
            className="w-full bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-slate-200 pl-4 sm:pl-6 pr-2 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 transition-all focus-within:shadow-[0_4px_30px_rgba(37,99,235,0.15)] focus-within:border-[#2563EB]"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              data-search-input="true"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (searchQuery) {
                    setSearchQuery('');
                  } else {
                    searchInputRef.current?.blur();
                  }
                }
              }}
              placeholder='Try "Income tax collected from Maharashtra in 2025"...'
              className="flex-1 text-xs sm:text-base text-slate-800 placeholder-slate-400 font-normal outline-none bg-transparent"
            />

            {/* Clean & Minimal Visible ⌘K Shortcut Badge */}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200/90 rounded-lg select-none">
              ⌘K
            </kbd>

            <button
              type="submit"
              disabled={pipelineState === 'running'}
              className="px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shrink-0 shadow-sm"
              aria-label="Search Flash RTI"
            >
              {pipelineState === 'running' ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  <span>Searching</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span>Search</span>
                  <CornerDownLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80 shrink-0" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Centered Curated Prompt Suggestion Chips across 10 Government of India Sectors */}
        <div className="space-y-2.5 w-full max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider block">
            Popular Proactive Queries Across Sectors
          </span>
          <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-1.5 sm:gap-2 max-w-4xl w-full overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 px-1 custom-canvas-scroll">
            {/* 1. Central Universities */}
            <button
              type="button"
              onClick={() => {
                const q = "What are the NIRF rankings and faculty vacancies in Central Universities in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Central Universities & NIRF</span>
            </button>

            {/* 2. National Highways */}
            <button
              type="button"
              onClick={() => {
                const q = "How much was spent on national highways in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>National Highway Expenses</span>
            </button>

            {/* 3. Income Tax & Revenue */}
            <button
              type="button"
              onClick={() => {
                const q = "How much income tax was collected from Maharashtra in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Income Tax (Maharashtra)</span>
            </button>

            {/* 4. Indian Railways & Vande Bharat */}
            <button
              type="button"
              onClick={() => {
                const q = "What is the capital outlay and Vande Bharat fleet of Indian Railways in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <Train className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Railways & Vande Bharat</span>
            </button>

            {/* 5. Healthcare & PM-JAY */}
            <button
              type="button"
              onClick={() => {
                const q = "How many claims settled under Ayushman Bharat PM-JAY and AIIMS bed capacity in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Ayushman Bharat & AIIMS</span>
            </button>

            {/* 6. Agriculture & PM-KISAN */}
            <button
              type="button"
              onClick={() => {
                const q = "How much DBT funds disbursed under PM-KISAN scheme in Uttar Pradesh and Maharashtra in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <Sprout className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span>PM-KISAN DBT Disbursals</span>
            </button>

            {/* 7. Renewable Energy & Solar */}
            <button
              type="button"
              onClick={() => {
                const q = "What is the installed solar and wind energy capacity in Rajasthan and Gujarat in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <SunMedium className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Solar & Wind Capacity</span>
            </button>

            {/* 8. Digital India & UPI */}
            <button
              type="button"
              onClick={() => {
                const q = "What was the total volume and value of UPI transactions and DigiLocker users in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>UPI & Digital India</span>
            </button>

            {/* 9. Rural Development & MGNREGA */}
            <button
              type="button"
              onClick={() => {
                const q = "How many person-days generated and average daily wages under MGNREGA in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <Trees className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>MGNREGA Rural Wages</span>
            </button>

            {/* 10. Urban Housing & Smart Cities */}
            <button
              type="button"
              onClick={() => {
                const q = "How many houses completed under PMAY Urban and Smart Cities funds utilized in 2025?";
                setSearchQuery(q);
                startPipeline(q);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>PMAY Urban & Smart Cities</span>
            </button>
          </div>
        </div>

        {/* 5 Real-Time Pipeline Execution Cards in Centered Single Column Stack */}
        <div className="flex flex-col gap-2.5 sm:gap-3 w-full max-w-2xl sm:max-w-3xl mx-auto text-left pt-1">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress' && pipelineState === 'running';
            const isError = step.status === 'error';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`w-full bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border transition-all duration-200 flex items-center justify-between gap-2.5 sm:gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${
                  isInProgress
                    ? 'border-blue-500 ring-2 ring-blue-500/15 shadow-md bg-blue-50/10'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isError
                    ? 'border-red-300 bg-red-50/30'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {/* Left Circular Icon Container with Step Index */}
                  <div 
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-600'
                        : isError
                        ? 'bg-red-100 text-red-600'
                        : isInProgress
                        ? 'bg-[#EBF3FF] text-[#2563EB]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    ) : isError ? (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    ) : isInProgress ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#2563EB]" />
                    ) : (
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                    )}
                  </div>

                  {/* Title and Subtext */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        STEP 0{step.id + 1}
                      </span>
                    </div>
                    <h4 className={`text-xs sm:text-[14.5px] font-bold tracking-tight truncate ${
                      isCompleted ? 'text-slate-900' : isError ? 'text-red-900' : 'text-slate-800'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-[11px] sm:text-xs font-medium tracking-tight truncate ${
                      isInProgress 
                        ? 'text-blue-600 font-semibold' 
                        : isCompleted 
                        ? 'text-emerald-700' 
                        : isError
                        ? 'text-red-600'
                        : 'text-slate-400'
                    }`}>
                      {step.subtext}
                    </p>
                  </div>
                </div>

                {/* Status indicator badge */}
                {isCompleted && (
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Done</span>
                  </span>
                )}
                {isInProgress && (
                  <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 sm:px-2.5 py-1 rounded-lg animate-pulse shrink-0">
                    Working
                  </span>
                )}
                {!isCompleted && !isInProgress && !isError && (
                  <span className="text-[9.5px] sm:text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
                    Standby
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Pipeline Error Banner */}
        <AnimatePresence>
          {pipelineState === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 text-left"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-red-900">
                    Unable to retrieve proactive disclosure
                  </h4>
                  <p className="text-xs sm:text-sm text-red-700 leading-relaxed font-medium">
                    {errorMessage || "The requested information is not available in pre-published repositories."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleFileRTIWithQuery}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>File Statutory RTI under Section 6(1)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startPipeline()}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Retry Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real Backend AI Result Dossier Card - Expansive Width & Crystal-Clear Hierarchy */}
        <AnimatePresence>
          {pipelineState === 'completed' && activeResult && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto bg-white border border-blue-500/20 sm:border-2 sm:border-blue-500/25 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 lg:p-10 shadow-xl sm:shadow-2xl relative overflow-hidden space-y-5 sm:space-y-7 text-left"
            >
              {/* Top Card Badge & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 animate-pulse" />
                    <span>Instant Public Disclosure</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                    <span>Verified Source Data</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100/90 hover:bg-blue-50 border border-slate-200/90 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                    title="Copy complete disclosure dossier to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                        <span>Copy Dossier</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200 border border-slate-200/90 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                    title="New Search / Reset (⌘⇧O)"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden xs:inline sm:inline">New Search</span>
                  </button>
                </div>
              </div>

              {/* Sufficiency / Missing Notice */}
              {(!activeResult.is_relevant || !activeResult.is_sufficient) && (
                <div className="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-amber-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Partial or Limited Proactive Record Available</span>
                  </p>
                  <p className="text-amber-700">
                    {activeResult.missing_points || "Full unredacted files can be requisitioned directly by submitting a formal statutory RTI."}
                  </p>
                </div>
              )}

              {/* Dynamic Report Data Presentation */}
              <div className="space-y-5 sm:space-y-6">
                {Array.isArray(activeResult.report_data) && activeResult.report_data.length > 0 ? (
                  activeResult.report_data.map((item, index) => {
                    if (item.type === 'plain') {
                      return (
                        <div
                          key={index}
                          className="bg-slate-50/70 border border-slate-200/70 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-slate-800 text-xs sm:text-base md:text-[16.5px] leading-relaxed font-normal shadow-2xs"
                        >
                          {item.content}
                        </div>
                      );
                    }

                    if (item.type === 'table') {
                      return (
                        <div key={index} className="space-y-2.5 sm:space-y-3 pt-1">
                          {item.title && (
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <h4 className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 sm:gap-2.5">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                                  <TableIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <span>{item.title}</span>
                              </h4>
                            </div>
                          )}
                          <ResultTable data={item.content} />
                        </div>
                      );
                    }

                    return null;
                  })
                ) : (
                  <p className="text-xs sm:text-sm text-slate-600">
                    {activeResult.missing_points || "Official query processed successfully."}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
                <button
                  type="button"
                  onClick={handleFileRTIWithQuery}
                  className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] active:scale-[0.99] text-white py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-[15px] font-bold shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Need Unaudited Records? File Formal RTI</span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Start New Chat (⌘⇧O)"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 sm:py-4 px-4 sm:px-7 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center shadow-2xs hover:shadow-xs"
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

export default function FlashRTIPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-[calc(100vh-108px)] bg-white rounded-3xl border border-slate-200/80 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <FlashRTIContent />
    </Suspense>
  );
}
