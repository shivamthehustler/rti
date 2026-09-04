'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import DottedWave from "../components/DottedWave";
import { CheckCircle2, ArrowRight, Search, FileText, Zap, Lock, Scale, Landmark, Upload, Calendar } from "lucide-react";
import {
  SearchIcon,
  DocumentSearchIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  ArrowRightIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon
} from "../components/Icons";
import { useApp } from "../context/AppContext";

const ThreeDLightningIcon = () => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0">
    {/* Speed/motion lines extending left */}
    <div className="absolute left-[3px] top-[30%] w-6 sm:w-8 h-0.5 bg-white/40 rounded-full"></div>
    <div className="absolute left-[-6px] sm:left-[-10px] top-[42%] w-10 sm:w-14 h-0.5 sm:h-1 bg-white/50 rounded-full"></div>
    <div className="absolute left-[-2px] sm:left-[-3px] top-[50%] w-12 sm:w-18 h-1 sm:h-1.5 bg-white/60 rounded-full blur-[0.5px]"></div>
    <div className="absolute left-[-4px] sm:left-[-6px] top-[60%] w-8 sm:w-12 h-0.5 sm:h-1 bg-white/50 rounded-full"></div>
    <div className="absolute left-[6px] sm:left-[10px] top-[72%] w-4 sm:w-6 h-0.5 bg-white/40 rounded-full"></div>

    {/* Drop shadow back-plate */}
    <div className="absolute w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-blue-950/40 rounded-2xl sm:rounded-[18px] translate-y-2 sm:translate-y-3 translate-x-1 blur-md"></div>
    
    {/* 3D Deep Plate (Bottom Thickness) */}
    <div className="absolute w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-blue-200/80 rounded-2xl sm:rounded-[18px] translate-y-[3px] sm:translate-y-[4px] translate-x-[1px] shadow-lg"></div>

    {/* Front Plate (Main Body) */}
    <div className="absolute w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl sm:rounded-[18px] border-t border-l border-white flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,1)]">
      <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#2563EB] drop-shadow-[0_1.5px_2px_rgba(37,99,235,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2v9h7L11 22v-9H4L13 2z" />
      </svg>
    </div>
  </div>
);

const ThreeDFolderIcon = () => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0">
    {/* Drop shadow */}
    <div className="absolute w-14 h-12 sm:w-18 sm:h-14 md:w-20 md:h-16 bg-blue-950/10 rounded-lg translate-y-3 sm:translate-y-4 translate-x-1 blur-md"></div>

    {/* Back folder plate */}
    <div className="absolute w-10 h-13 sm:w-12 sm:h-16 md:w-14 md:h-18 bg-blue-600 rounded-lg transform -rotate-6 translate-y-0.5 -translate-x-0.5 shadow-sm"></div>

    {/* Pages sticking out */}
    <div className="absolute w-10 h-13 sm:w-12 sm:h-16 md:w-14 md:h-18 bg-white rounded-md border border-blue-100 shadow-xs flex flex-col p-1.5 sm:p-2 gap-1 transform rotate-3 -translate-y-1 sm:-translate-y-1.5">
      <div className="w-4 sm:w-5 h-0.5 bg-blue-500 rounded-full"></div>
      <div className="w-7 sm:w-10 h-0.5 bg-blue-300/80 rounded-full"></div>
      <div className="w-5 sm:w-8 h-0.5 bg-blue-300/80 rounded-full"></div>
      <div className="w-6 sm:w-9 h-0.5 bg-blue-300/80 rounded-full"></div>
      <div className="w-4 sm:w-6 h-0.5 bg-blue-300/80 rounded-full"></div>
    </div>

    {/* Front folder plate (rotated/open) */}
    <div className="absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 rounded-lg border-t border-l border-white/50 shadow-md transform rotate-12 translate-y-2 sm:translate-y-2.5 translate-x-1 sm:translate-x-1.5 flex items-end p-1 sm:p-1.5">
      {/* Tab/Label on front folder */}
      <div className="w-4 sm:w-5 h-1 sm:h-1.5 bg-blue-200/50 rounded-xs"></div>
    </div>
  </div>
);

export default function Home() {
  const { t } = useApp();
  const router = useRouter();

  return (
    <div className="flex flex-col w-full bg-[#FAFAFC]">
      {/* Hero Section (Section 0) */}
      <section className="w-full min-h-[calc(100vh-80px)] px-4 sm:px-6 md:px-8 text-center relative overflow-hidden flex flex-col justify-between items-center bg-[#FAFAFC] pt-6 sm:pt-10 md:pt-14 pb-8 sm:pb-12">
        {/* Background Dotted Wave Component */}
        <DottedWave />

        {/* Top/Middle Main Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center flex-1 w-full">
          {/* Title & Subtitle Block */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-3xl min-[360px]:text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-bold text-[#0B1C3F] tracking-tight leading-[1.16] mb-3 sm:mb-4 px-2">
              <span className="block">{t.hero.headingLine1}</span>
              <span className="block mt-1 sm:mt-2 text-[#2563EB]">
                {t.hero.headingLine2}
              </span>
            </h1>
            <p className="text-xs min-[360px]:text-sm sm:text-base md:text-lg text-slate-600 font-medium mb-4 sm:mb-5 max-w-2xl px-3 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Minimal Single Thin Line Separator */}
            <div className="w-12 h-[2px] bg-[#2563EB]/40 rounded-full"></div>
          </div>

          {/* Dual Action Cards Container */}
          <div className="w-full max-w-5xl xl:max-w-6xl mx-auto mt-6 sm:mt-10 md:mt-12 flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 lg:gap-8 items-stretch w-full">
              {/* Card 1: Flash RTI */}
              <div className="group relative bg-[#2563EB] text-white rounded-2xl sm:rounded-3xl border border-blue-400/40 hover:border-blue-300/70 shadow-lg sm:shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-300 p-5 sm:p-7 md:p-8 flex flex-col justify-between text-left overflow-hidden">
                <div className="relative z-10 flex flex-col flex-1">
                  {/* Content columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-start">
                    {/* Left Column: Icon + Title Block Row, and Description */}
                    <div className="sm:col-span-7 flex flex-col items-start text-left">
                      {/* Header Row: Icon + Title Block */}
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 w-full">
                        <ThreeDLightningIcon />
                        <div className="flex flex-col items-start min-w-0">
                          {t.mainActions.getInformation.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs border border-white/30 text-white text-[10px] font-bold tracking-wider mb-1 uppercase">
                              {t.mainActions.getInformation.badge}
                            </span>
                          )}
                          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-tight">
                            {t.mainActions.getInformation.title}
                          </h3>
                          <span className="text-xs sm:text-sm font-semibold text-blue-100 mt-0.5">
                            {t.mainActions.getInformation.subtitle}
                          </span>
                        </div>
                      </div>
                      {/* Description below */}
                      <p className="text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed max-w-[340px]">
                        {t.mainActions.getInformation.desc}
                      </p>
                    </div>

                    {/* Right Column: Features checklist */}
                    <div className="sm:col-span-5 flex flex-col gap-3 sm:gap-3.5 self-start sm:self-center justify-center pt-2 sm:pt-6 pl-0 sm:pl-4">
                      {t.mainActions.getInformation.features.map((feat, idx) => {
                        const icons = [
                          <Search key="f1" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" strokeWidth={2.5} />,
                          <Landmark key="f2" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" strokeWidth={2.2} />,
                          <Zap key="f3" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" fill="currentColor" strokeWidth={1} />,
                          <ShieldCheckIcon key="f4" className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" strokeWidth={2} />
                        ];
                        return (
                          <div key={idx} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-white font-semibold">
                            <div className="shrink-0">
                              {icons[idx]}
                            </div>
                            <span>{feat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA & Footnote */}
                <div className="relative z-10 mt-6 pt-2 flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between gap-3 sm:gap-4">
                  <Link
                    href="/dashboard/flash-rti"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-[#2563EB] bg-white hover:bg-blue-50 shadow-md shadow-blue-950/20 hover:shadow-lg transition-all duration-200 cursor-pointer group/btn whitespace-nowrap active:scale-[0.98]"
                  >
                    <span>{t.mainActions.getInformation.btn}</span>
                    <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                  <div className="flex items-center justify-center min-[420px]:justify-start gap-1.5 text-xs text-blue-100 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                    <span>{t.mainActions.getInformation.note}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: File an RTI */}
              <div className="group relative bg-[#EEF4FE]/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-blue-200/80 hover:border-blue-400/90 shadow-md sm:shadow-lg shadow-blue-950/5 hover:shadow-xl hover:shadow-blue-950/10 transition-all duration-300 p-5 sm:p-7 md:p-8 flex flex-col justify-between text-left overflow-hidden">
                <div className="relative z-10 flex flex-col flex-1">
                  {/* Content columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-start">
                    {/* Left Column: Icon + Title Block Row, and Description */}
                    <div className="sm:col-span-7 flex flex-col items-start text-left">
                      {/* Header Row: Icon + Title Block */}
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 w-full">
                        <ThreeDFolderIcon />
                        <div className="flex flex-col items-start min-w-0">
                          {/* Hidden on mobile to avoid strange gap, only visible on larger screens */}
                          <div className="hidden lg:block h-[21px] mb-1"></div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#0B1C3F] tracking-tight leading-tight">
                            {t.mainActions.fileRTI.title}
                          </h3>
                          <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                            {t.mainActions.fileRTI.subtitle}
                          </span>
                        </div>
                      </div>
                      {/* Description below */}
                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-[340px]">
                        {t.mainActions.fileRTI.desc}
                      </p>
                    </div>

                    {/* Right Column: Features checklist */}
                    <div className="sm:col-span-5 flex flex-col gap-3 sm:gap-3.5 self-start sm:self-center justify-center pt-2 sm:pt-6 pl-0 sm:pl-4">
                      {t.mainActions.fileRTI.features.map((feat, idx) => {
                        const icons = [
                          <ShieldCheckIcon key="r1" className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" strokeWidth={2} />,
                          <Upload key="r2" className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" strokeWidth={2.2} />,
                          <Search key="r3" className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" strokeWidth={2.5} />,
                          <Calendar key="r4" className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" strokeWidth={2} />
                        ];
                        return (
                          <div key={idx} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
                            <div className="shrink-0">
                              {icons[idx]}
                            </div>
                            <span>{feat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA & Footnote */}
                <div className="relative z-10 mt-6 pt-2 flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between gap-3 sm:gap-4">
                  <Link
                    href="/dashboard/file-rti"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-[#2563EB] bg-white hover:bg-blue-50/80 border border-blue-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group/btn whitespace-nowrap active:scale-[0.98]"
                  >
                    <span>{t.mainActions.fileRTI.btn}</span>
                    <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                  <div className="flex items-center justify-center min-[420px]:justify-start gap-1.5 text-xs text-slate-500 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t.mainActions.fileRTI.note}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Trust Icons Bar at the Very Bottom of Hero Section */}
        <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto mt-8 sm:mt-12 pt-5 sm:pt-6 pb-2 sm:pb-4 border-t border-slate-200/60">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-10 md:gap-12 w-full">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold">
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <span>{t.trust.badges.secure}</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-slate-200/80"></div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" strokeWidth={2.5} />
              <span>{t.trust.badges.verified}</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-slate-200/80"></div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <span>{t.trust.badges.act}</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 sm:py-20 px-4 md:px-8 bg-white border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1C3F] tracking-tight mb-12 sm:mb-16">
            {t.howItWorks.heading}
          </h3>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-2 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center flex-1 max-w-[260px] group cursor-default">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#EDF5FD] via-[#F3F7FD] to-[#F8FAFC] border border-blue-200/80 flex items-center justify-center mb-5 sm:mb-6 shadow-xs group-hover:scale-105 group-hover:border-blue-300 group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <DottedWave variant="icon" />
                <SearchIcon className="w-8 h-8 sm:w-11 sm:h-11 text-[#0B1C3F] relative z-10" strokeWidth={1.75} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#0B1C3F] mb-2 flex items-center justify-center gap-1.5">
                <span>{t.howItWorks.step1Title}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-[210px]">
                {t.howItWorks.step1Desc}
              </p>
            </div>

            {/* Desktop Connector 1 -> 2 */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-[130px] lg:max-w-[170px] mt-11 text-slate-300">
              <svg className="w-full h-6" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4" y1="12" x2="124" y2="12" stroke="currentColor" strokeWidth="1.75" strokeDasharray="5 5" strokeLinecap="round" />
                <path d="M120 6L127 12L120 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile Vertical Connector 1 -> 2 */}
            <div className="flex md:hidden items-center justify-center my-1 text-slate-300">
              <svg className="w-6 h-8" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="2" x2="12" y2="24" stroke="currentColor" strokeWidth="1.75" strokeDasharray="4 4" strokeLinecap="round" />
                <path d="M6 18L12 25L18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center flex-1 max-w-[260px] group cursor-default">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#EDF5FD] via-[#F3F7FD] to-[#F8FAFC] border border-blue-200/80 flex items-center justify-center mb-5 sm:mb-6 shadow-xs group-hover:scale-105 group-hover:border-blue-300 group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <DottedWave variant="icon" />
                <DocumentTextIcon className="w-8 h-8 sm:w-11 sm:h-11 text-[#0B1C3F] relative z-10" strokeWidth={1.75} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#0B1C3F] mb-2 flex items-center justify-center gap-1.5">
                <span>{t.howItWorks.step2Title}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-[210px]">
                {t.howItWorks.step2Desc}
              </p>
            </div>

            {/* Desktop Connector 2 -> 3 */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-[130px] lg:max-w-[170px] mt-11 text-slate-300">
              <svg className="w-full h-6" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4" y1="12" x2="124" y2="12" stroke="currentColor" strokeWidth="1.75" strokeDasharray="5 5" strokeLinecap="round" />
                <path d="M120 6L127 12L120 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile Vertical Connector 2 -> 3 */}
            <div className="flex md:hidden items-center justify-center my-1 text-slate-300">
              <svg className="w-6 h-8" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="2" x2="12" y2="24" stroke="currentColor" strokeWidth="1.75" strokeDasharray="4 4" strokeLinecap="round" />
                <path d="M6 18L12 25L18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center flex-1 max-w-[260px] group cursor-default">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#EDF5FD] via-[#F3F7FD] to-[#F8FAFC] border border-blue-200/80 flex items-center justify-center mb-5 sm:mb-6 shadow-xs group-hover:scale-105 group-hover:border-blue-300 group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <DottedWave variant="icon" />
                <DocumentCheckIcon className="w-8 h-8 sm:w-11 sm:h-11 text-[#0B1C3F] relative z-10" strokeWidth={1.75} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#0B1C3F] mb-2 flex items-center justify-center gap-1.5">
                <span>{t.howItWorks.step3Title}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-[210px]">
                {t.howItWorks.step3Desc}
              </p>
            </div>

          </div>
        </div>
      </section>



      {/* Trust & Compliance Section */}
      <section className="w-full py-16 md:py-20 px-4 md:px-8 bg-gradient-to-b from-[#EDF5FD] via-[#F3F7FD] to-[#F8FAFC] border-t border-blue-100/80 relative overflow-hidden">
        <DottedWave variant="section-feathered" />
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Heading & Subtitle */}
          <div className="text-center mb-12 md:mb-14">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C3F] tracking-tight mb-2.5">
              {t.trust.heading}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              {t.trust.subtitle}
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Card 1: Data Security */}
            <div className="bg-white border border-blue-100/80 hover:border-blue-300/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EDF5FD] border border-blue-100 text-[#2563EB] flex items-center justify-center mb-5 shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                  <ShieldCheckIcon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h4 className="text-base font-bold text-[#0B1C3F] mb-2">
                  {t.trust.cards.security.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {t.trust.cards.security.desc}
                </p>
              </div>
            </div>

            {/* Card 2: Statutory Authority */}
            <div className="bg-white border border-blue-100/80 hover:border-blue-300/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EDF5FD] border border-blue-100 text-[#2563EB] flex items-center justify-center mb-5 shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                  <ClipboardDocumentCheckIcon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h4 className="text-base font-bold text-[#0B1C3F] mb-2">
                  {t.trust.cards.statutory.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {t.trust.cards.statutory.desc}
                </p>
              </div>
            </div>

            {/* Card 3: Time-Bound Resolution */}
            <div className="bg-white border border-blue-100/80 hover:border-blue-300/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EDF5FD] border border-blue-100 text-[#2563EB] flex items-center justify-center mb-5 shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                  <ClockIcon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h4 className="text-base font-bold text-[#0B1C3F] mb-2">
                  {t.trust.cards.timeBound.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {t.trust.cards.timeBound.desc}
                </p>
              </div>
            </div>

            {/* Card 4: Universal Accessibility */}
            <div className="bg-white border border-blue-100/80 hover:border-blue-300/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EDF5FD] border border-blue-100 text-[#2563EB] flex items-center justify-center mb-5 shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                  <UserIcon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h4 className="text-base font-bold text-[#0B1C3F] mb-2">
                  {t.trust.cards.accessibility.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {t.trust.cards.accessibility.desc}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Hallmark Line */}
          <div className="mt-12 pt-6 border-t border-blue-200/60 flex flex-wrap items-center justify-between text-xs text-slate-600 font-medium max-w-6xl mx-auto">
            <span>{t.trust.hallmarkLeft}</span>
            <span>{t.trust.hallmarkRight}</span>
          </div>

        </div>
      </section>
    </div>
  );
}
