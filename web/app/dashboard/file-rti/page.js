'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import DashboardBackgroundWave from '../../../components/DashboardBackgroundWave';
import { 
  FileText, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  HelpCircle, 
  Clock, 
  Landmark,
  Search,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  FileCheck,
  Zap,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const MINISTRIES_AND_AUTHORITIES = [
  {
    ministry: "Ministry of Finance",
    authorities: [
      "Central Board of Direct Taxes (CBDT) - Income Tax",
      "Central Board of Indirect Taxes and Customs (CBIC) - GST",
      "Department of Revenue",
      "Department of Financial Services",
      "Enforcement Directorate (ED)"
    ]
  },
  {
    ministry: "Ministry of Road Transport and Highways",
    authorities: [
      "National Highways Authority of India (NHAI)",
      "National Highways & Infrastructure Development Corp (NHIDCL)",
      "Indian Road Congress",
      "Directorate General of Border Roads"
    ]
  },
  {
    ministry: "Ministry of Railways",
    authorities: [
      "Railway Board",
      "Northern Railway",
      "Western Railway",
      "Southern Railway",
      "Indian Railway Catering and Tourism Corp (IRCTC)",
      "Dedicated Freight Corridor Corporation (DFCCIL)"
    ]
  },
  {
    ministry: "Ministry of Electronics & IT (MeitY)",
    authorities: [
      "Unique Identification Authority of India (UIDAI)",
      "Indian Computer Emergency Response Team (CERT-In)",
      "National Informatics Centre (NIC)",
      "Digital India Corporation"
    ]
  },
  {
    ministry: "Ministry of Home Affairs",
    authorities: [
      "Central Reserve Police Force (CRPF)",
      "Border Security Force (BSF)",
      "Delhi Police",
      "Intelligence Bureau (IB)",
      "National Investigation Agency (NIA)"
    ]
  },
  {
    ministry: "Ministry of Education",
    authorities: [
      "Department of Higher Education",
      "Department of School Education and Literacy",
      "University Grants Commission (UGC)",
      "Central Board of Secondary Education (CBSE)",
      "National Testing Agency (NTA)"
    ]
  },
  {
    ministry: "Ministry of Housing and Urban Affairs",
    authorities: [
      "Central Public Works Department (CPWD)",
      "Delhi Development Authority (DDA)",
      "Directorate of Estates",
      "Smart Cities Mission Directorate"
    ]
  },
  {
    ministry: "Independent & Statutory Bodies",
    authorities: [
      "Union Public Service Commission (UPSC)",
      "Staff Selection Commission (SSC)",
      "Reserve Bank of India (RBI)",
      "Securities and Exchange Board of India (SEBI)"
    ]
  }
];

function FileRTIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passedQuery = searchParams.get('query') || '';
  const { user } = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMinistry, setSelectedMinistry] = useState(MINISTRIES_AND_AUTHORITIES[0].ministry);
  const [selectedAuthority, setSelectedAuthority] = useState(MINISTRIES_AND_AUTHORITIES[0].authorities[0]);
  const [deptSearch, setDeptSearch] = useState('');

  // Step 2: Personal Details
  const [applicantName, setApplicantName] = useState(user?.name || 'Shivam Gupta');
  const [gender, setGender] = useState('male');
  const [email, setEmail] = useState(user?.email || 'citizen.rti@gov.in');
  const [mobile, setMobile] = useState('9876543210');
  const [address, setAddress] = useState('Flat 402, Shanti Heights, Shivajinagar, Pune');
  const [pincode, setPincode] = useState('411005');
  const [isDigilockerVerified, setIsDigilockerVerified] = useState(true);

  // Step 3: RTI Request Details
  const [subject, setSubject] = useState(passedQuery ? `Information request regarding: ${passedQuery.slice(0, 50)}...` : '');
  const [queryText, setQueryText] = useState(passedQuery || '');
  const [bplStatus, setBplStatus] = useState('no');
  const [bplCardNo, setBplCardNo] = useState('');
  const [bplYear, setBplYear] = useState('');
  const [bplAuthority, setBplAuthority] = useState('');

  // AI Assistant Modal/Bar
  const [aiPrompt, setAiPrompt] = useState(passedQuery || '');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // AI Auto-Fill Function
  const handleAiAutoFill = (textToProcess) => {
    const text = textToProcess || aiPrompt;
    if (!text.trim()) return;

    setIsAiProcessing(true);
    setAiSuccessMessage('');

    setTimeout(() => {
      const lower = text.toLowerCase();
      let matchedMin = MINISTRIES_AND_AUTHORITIES[0].ministry;
      let matchedAuth = MINISTRIES_AND_AUTHORITIES[0].authorities[0];

      if (lower.includes('highway') || lower.includes('road') || lower.includes('nhai') || lower.includes('transport')) {
        matchedMin = "Ministry of Road Transport and Highways";
        matchedAuth = "National Highways Authority of India (NHAI)";
      } else if (lower.includes('tax') || lower.includes('income') || lower.includes('cbdt') || lower.includes('gst')) {
        matchedMin = "Ministry of Finance";
        matchedAuth = "Central Board of Direct Taxes (CBDT) - Income Tax";
      } else if (lower.includes('train') || lower.includes('rail') || lower.includes('irctc')) {
        matchedMin = "Ministry of Railways";
        matchedAuth = "Railway Board";
      } else if (lower.includes('aadhaar') || lower.includes('uidai') || lower.includes('it')) {
        matchedMin = "Ministry of Electronics & IT (MeitY)";
        matchedAuth = "Unique Identification Authority of India (UIDAI)";
      } else if (lower.includes('police') || lower.includes('crpf') || lower.includes('home')) {
        matchedMin = "Ministry of Home Affairs";
        matchedAuth = "Delhi Police";
      } else if (lower.includes('school') || lower.includes('exam') || lower.includes('cbse') || lower.includes('ugc')) {
        matchedMin = "Ministry of Education";
        matchedAuth = "Central Board of Secondary Education (CBSE)";
      }

      setSelectedMinistry(matchedMin);
      setSelectedAuthority(matchedAuth);

      const generatedSubject = `Statutory request under Section 6(1) for records on: ${text.slice(0, 45)}...`;
      const generatedQuestions = `1. Please provide certified copies of official sanction orders and audited expenditure statements concerning "${text.trim()}".\n2. Name, official designation, and contact particulars of the Central Public Information Officer (CPIO) and First Appellate Authority.\n3. Detailed file notings and administrative sanction approvals for the relevant financial year.\n4. Date of tender allocation, contractor agreement particulars, and statutory completion timeline.`;

      setSubject(generatedSubject);
      setQueryText(generatedQuestions);
      setIsAiProcessing(false);
      setAiSuccessMessage(`✨ AI Auto-Filled! Matched to ${matchedAuth}. Ready to review.`);

      // Navigate straight to Step 4 (Review & Submit)
      setCurrentStep(4);
    }, 900);
  };

  const handlePolishQueryWithAI = () => {
    if (!queryText) return;
    const polished = `1. Certified copies of official sanction orders and audited expenditure statements concerning "${queryText.trim()}".\n2. Name, designation, and contact particulars of the Central Public Information Officer (CPIO) and First Appellate Authority.\n3. Detailed file notings and administrative sanction approvals for the relevant financial year.`;
    setQueryText(polished);
    if (!subject) {
      setSubject(`Statutory request under Section 6(1) for records on: ${queryText.slice(0, 45)}...`);
    }
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const regNo = `RTI/2026/${selectedAuthority.split(' ')[0].replace(/[^A-Z]/g, '') || 'GOV'}/${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmissionResult({
        regNo,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        applicant: applicantName,
        email,
        mobile,
        address,
        pincode,
        ministry: selectedMinistry,
        authority: selectedAuthority,
        subject,
        queryText,
        feeAmount: bplStatus === 'yes' ? '₹0 (BPL Fee Exempted)' : '₹10.00 (Statutory Fee Paid)',
        status: 'Application Submitted to CPIO'
      });
      setIsSubmitting(false);
      setCurrentStep(5);
    }, 1400);
  };

  // Find authorities for currently selected ministry
  const currentMinistryObj = MINISTRIES_AND_AUTHORITIES.find(m => m.ministry === selectedMinistry) || MINISTRIES_AND_AUTHORITIES[0];
  const availableAuthorities = currentMinistryObj.authorities.filter(a => 
    a.toLowerCase().includes(deptSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-white rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden p-5 sm:p-8 lg:p-10 space-y-6">
      {/* Consistent Dotted Wave Background from Landing Page */}
      <DashboardBackgroundWave />

      <div className="relative z-10 space-y-6 max-w-5xl mx-auto">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-50 text-[#2563EB] rounded-2xl">
                <FileText className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                File an Official RTI Application
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Statutory application filing under Section 6(1) of the Right to Information Act, 2005.
            </p>
          </div>

          {/* Verified Citizen Badge */}
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 px-4 py-2.5 rounded-2xl w-fit">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-green-800">{applicantName}</p>
              <p className="text-[11px] text-green-600 font-semibold">DigiLocker Verified Citizen</p>
            </div>
          </div>
        </div>

        {/* AI Smart Auto-Fill & Simplify Bar */}
        {currentStep < 5 && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-5 sm:p-6 rounded-3xl border border-blue-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2563EB]" />
                <span className="text-sm font-bold text-blue-950">AI Smart Auto-Fill Assistant</span>
              </div>
              <span className="text-xs text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full font-semibold">
                Instant Step Bypass
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Paste or type your request in plain English. AI will automatically identify the right Ministry, format legal questions, and take you straight to Review & Submit.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder='e.g. "I want to know the budget spent on NH-66 highway widening in Maharashtra"'
                className="flex-1 px-4 py-2.5 bg-white border border-blue-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
              />
              <button
                type="button"
                disabled={isAiProcessing}
                onClick={() => handleAiAutoFill()}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
              >
                {isAiProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Auto-filling...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Auto-Fill All Steps with AI</span>
                  </>
                )}
              </button>
            </div>
            {aiSuccessMessage && (
              <p className="text-xs font-bold text-green-700">{aiSuccessMessage}</p>
            )}
          </div>
        )}

        {/* 4-Step Stepper Bar */}
        {currentStep < 5 && (
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            {[
              { num: 1, label: 'Department Selection' },
              { num: 2, label: 'Applicant Details' },
              { num: 3, label: 'RTI Request Details' },
              { num: 4, label: 'Review & Submit' }
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className="flex items-center gap-2 sm:gap-3 flex-1 justify-center first:justify-start last:justify-end cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                  currentStep === s.num 
                    ? 'bg-[#2563EB] text-white shadow-md' 
                    : currentStep > s.num 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {currentStep > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs sm:text-sm font-bold hidden sm:inline ${
                  currentStep === s.num ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Ministry and Department Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Step 1: Select Ministry & Public Authority</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Choose the competent government authority responsible for the records you seek.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Ministry / Department *
                </label>
                <select
                  value={selectedMinistry}
                  onChange={(e) => {
                    setSelectedMinistry(e.target.value);
                    const newMin = MINISTRIES_AND_AUTHORITIES.find(m => m.ministry === e.target.value);
                    if (newMin && newMin.authorities.length > 0) {
                      setSelectedAuthority(newMin.authorities[0]);
                    }
                  }}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:bg-white focus:border-[#2563EB] font-semibold text-slate-900"
                >
                  {MINISTRIES_AND_AUTHORITIES.map((m) => (
                    <option key={m.ministry} value={m.ministry}>{m.ministry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Public Authority / Nodal Body *
                </label>
                <div className="space-y-2.5">
                  {availableAuthorities.map((auth) => {
                    const isSelected = selectedAuthority === auth;
                    return (
                      <button
                        key={auth}
                        type="button"
                        onClick={() => setSelectedAuthority(auth)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#2563EB] bg-blue-50/50 shadow-xs ring-2 ring-blue-500/10'
                            : 'border-slate-200/80 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-900">{auth}</span>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Applicant Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Applicant Personal Details */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Step 2: Applicant Personal Details</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Verify your contact particulars for statutory communication and postal dispatch.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="third_gender">Third Gender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Contact Number (10 Digits) *
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Complete Postal Address *
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-medium text-slate-900 outline-none focus:bg-white focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pincode (6 Digits) *
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center">
                <div className="p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 w-full">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-xs font-bold text-green-800">DigiLocker Identity Authenticated</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Continue to RTI Questions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: RTI Request Details */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Step 3: RTI Request Particulars</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Draft specific questions for the Central Public Information Officer (CPIO).</p>
              </div>

              <button
                type="button"
                onClick={handlePolishQueryWithAI}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Polish Format with AI</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject of Information Request *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Budget expenditure details and contractor allocations for 2025-26"
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:bg-white focus:border-[#2563EB] font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Text of RTI Application (Information Sought) *
                </label>
                <textarea
                  rows={6}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="1. Please provide certified copies of...\n2. What is the total sanctioned amount for...\n3. Date of project commencement and completion..."
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:bg-white focus:border-[#2563EB] font-medium text-slate-900"
                />
              </div>

              {/* BPL Status Option */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Are you Below Poverty Line (BPL)?</p>
                    <p className="text-xs text-slate-500 font-medium">BPL applicants are exempt from the ₹10 statutory filing fee.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="bplStatus"
                        value="no"
                        checked={bplStatus === 'no'}
                        onChange={() => setBplStatus('no')}
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="bplStatus"
                        value="yes"
                        checked={bplStatus === 'yes'}
                        onChange={() => setBplStatus('yes')}
                      />
                      <span>Yes (Fee Exemption)</span>
                    </label>
                  </div>
                </div>

                {bplStatus === 'yes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                    <input
                      type="text"
                      placeholder="BPL Card No *"
                      value={bplCardNo}
                      onChange={(e) => setBplCardNo(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Year of Issue"
                      value={bplYear}
                      onChange={(e) => setBplYear(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Authority"
                      value={bplAuthority}
                      onChange={(e) => setBplAuthority(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!subject || !queryText}
                onClick={() => setCurrentStep(4)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Review & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Full Review & Submit */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Step 4: Review & Submit Statutory RTI</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Verify all particulars before submitting to the Government of India portal.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Applicant</span>
                  <span className="text-slate-900 font-bold">{applicantName} ({email}, {mobile})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Public Authority</span>
                  <span className="text-slate-900 font-bold">{selectedAuthority}</span>
                  <p className="text-slate-500 text-xs">{selectedMinistry}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-0.5">Postal Address</span>
                <p className="text-slate-800 font-medium">{address} - {pincode}</p>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-0.5">Subject</span>
                <p className="text-slate-900 font-semibold text-sm sm:text-base">{subject}</p>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">RTI Application Text</span>
                <pre className="text-slate-800 whitespace-pre-wrap font-sans text-xs sm:text-sm bg-white p-4 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                  {queryText}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs sm:text-sm">
                <span className="font-bold text-slate-700">Application Fee Payable</span>
                <span className="text-base font-black text-[#2563EB]">{bplStatus === 'yes' ? '₹0 (BPL Exemption)' : '₹10.00'}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitApplication}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting to CPIO...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Submit Application</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Success Acknowledgement */}
        {currentStep === 5 && submissionResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-green-500/25 shadow-xl space-y-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">RTI Application Registered!</h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Your statutory application has been officially lodged with the Public Authority.
              </p>
            </div>

            {/* Official Registration Box */}
            <div className="max-w-md mx-auto p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className="text-slate-400 font-bold">Registration Number</span>
                <span className="text-base font-black text-[#2563EB] tracking-wide font-mono">{submissionResult.regNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Filing Date</span>
                <span className="text-slate-900 font-bold">{submissionResult.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Public Authority</span>
                <span className="text-slate-900 font-bold">{submissionResult.authority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Statutory Timeline</span>
                <span className="text-green-700 font-extrabold">30 Days (under Section 7(1))</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/track?reg=${submissionResult.regNo}`)}
                className="w-full sm:w-auto px-7 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                Track This Request →
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/my-requests')}
                className="w-full sm:w-auto px-7 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                View My Requests
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function FileRTIPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading RTI Filing Interface...</div>}>
      <FileRTIContent />
    </Suspense>
  );
}
