'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import DottedWave from '../../components/DottedWave';
import { useApp } from '../../context/AppContext';
import { useAppStore } from '../../store/useAppStore';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  ArrowRightIcon, 
  UserIcon,
  DownloadIcon,
  DigiLockerIcon
} from '../../components/Icons';

// Comprehensive Public Authority Catalog
const MINISTRIES_AND_AUTHORITIES = [
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
    ministry: "Ministry of Railways",
    authorities: [
      "Railway Board",
      "Northern Railway",
      "Western Railway",
      "Southern Railway",
      "Indian Railway Catering and Tourism Corp (IRCTC)"
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
    ministry: "Ministry of Electronics & IT (MeitY)",
    authorities: [
      "Unique Identification Authority of India (UIDAI)",
      "Indian Computer Emergency Response Team (CERT-In)",
      "National Informatics Centre (NIC)",
      "Digital India Corporation"
    ]
  },
  {
    ministry: "Independent & Statutory Bodies",
    authorities: [
      "Union Public Service Commission (UPSC)",
      "Staff Selection Commission (SSC)",
      "Reserve Bank of India (RBI)",
      "National Highways Authority of India (NHAI)",
      "Securities and Exchange Board of India (SEBI)"
    ]
  },
  {
    ministry: "Ministry of Health and Family Welfare",
    authorities: [
      "Directorate General of Health Services (DGHS)",
      "All India Institute of Medical Sciences (AIIMS, New Delhi)",
      "Food Safety and Standards Authority of India (FSSAI)",
      "Indian Council of Medical Research (ICMR)"
    ]
  },
  {
    ministry: "Ministry of External Affairs",
    authorities: [
      "Consular, Passport and Visa (CPV) Division",
      "Regional Passport Office (RPO, New Delhi)",
      "Indian Council for Cultural Relations (ICCR)"
    ]
  }
];

// Zod Schema
const rtiFormSchema = z.object({
  ministry: z.string().min(1, 'Please select a Ministry / Department'),
  publicAuthority: z.string().min(1, 'Please select a Public Authority'),
  applicantName: z.string().min(2, 'Full name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'third_gender'], { errorMap: () => ({ message: 'Please select gender' }) }),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  address: z.string().min(10, 'Complete postal address must be at least 10 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Pincode'),
  bplStatus: z.enum(['no', 'yes']),
  bplCardNo: z.string().optional(),
  bplYear: z.string().optional(),
  bplAuthority: z.string().optional(),
  queryText: z.string().min(20, 'RTI Request text must be at least 20 characters').max(3000, 'Request text cannot exceed 3000 characters')
}).refine((data) => {
  if (data.bplStatus === 'yes') {
    return !!data.bplCardNo && data.bplCardNo.trim().length > 0;
  }
  return true;
}, {
  message: 'BPL Card / Ration Card number is required for BPL exemption',
  path: ['bplCardNo']
});

// Framer Motion Animation Variants for Request Submitted Confirmation Page
const successContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const successCardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const heroChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1
    }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const checkmarkCircleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 20,
      mass: 0.8
    }
  }
};

const checkmarkPathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      delay: 0.18
    }
  }
};

const rippleRingVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [0.85, 1.25, 1.45],
    opacity: [0.65, 0.3, 0],
    transition: {
      duration: 1.2,
      ease: "easeOut",
      delay: 0.22
    }
  }
};

const regCardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 22
    }
  }
};

const summaryContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.15
    }
  }
};

const summaryRowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const timelineContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18
    }
  }
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function SubmitRequestPage() {
  const router = useRouter();
  const { language, t } = useApp();
  const user = useAppStore((state) => state.user);
  const sr = t.submitRequest || {};
  const loginT = t.login || {};
  const isHindi = language === 'hi';

  // Flag to toggle mandatory login requirement (set to true to enforce login)
  const REQUIRE_LOGIN_TO_FILE = true;
  const isAccessAllowed = !REQUIRE_LOGIN_TO_FILE || !!user;
  const showLoginGate = REQUIRE_LOGIN_TO_FILE && !user;

  const [currentStep, setCurrentStep] = useState(1);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isDigilockerUsed, setIsDigilockerUsed] = useState(false);
  const [bplFileName, setBplFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [trackRegNo, setTrackRegNo] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [aiInput, setAiInput] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatterWarning, setFormatterWarning] = useState('');
  const [validationError, setValidationError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([
    "Inspection of Official File Notes & Correspondence",
    "Certified Copies of Official Circulars & Orders",
    "Action Taken Report (ATR) on Submitted Grievance",
    "Departmental Budget Allocation & Expense Breakdown"
  ]);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [formattedPreview, setFormattedPreview] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(rtiFormSchema),
    defaultValues: {
      ministry: '',
      publicAuthority: '',
      applicantName: '',
      gender: 'male',
      email: user?.email || '',
      mobile: '',
      address: '',
      pincode: '',
      bplStatus: 'no',
      bplCardNo: '',
      bplYear: '',
      bplAuthority: '',
      queryText: ''
    }
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.email) setValue('email', user.email, { shouldValidate: true });
      if (user.name) setValue('applicantName', user.name, { shouldValidate: false });
    }
  }, [user, setValue]);

  const selectedMinistry = watch('ministry');
  const isBpl = watch('bplStatus') === 'yes';
  const queryTextValue = watch('queryText', '');

  // Filter authorities based on search query
  const filteredCatalog = MINISTRIES_AND_AUTHORITIES.map(group => {
    if (!deptSearchQuery.trim()) return group;
    const q = deptSearchQuery.toLowerCase();
    const matchesMinistry = group.ministry.toLowerCase().includes(q);
    const matchingAuths = group.authorities.filter(a => a.toLowerCase().includes(q));
    if (matchesMinistry || matchingAuths.length > 0) {
      return {
        ministry: group.ministry,
        authorities: matchesMinistry ? group.authorities : matchingAuths
      };
    }
    return null;
  }).filter(Boolean);

  // Available authorities for currently selected ministry
  const currentMinistryGroup = MINISTRIES_AND_AUTHORITIES.find(m => m.ministry === selectedMinistry);
  const availableAuthorities = currentMinistryGroup ? currentMinistryGroup.authorities : [];

  // Stepper Highlighting Logic
  const isStepCompleted = (stepNum) => {
    if (submittedSuccess) return true;
    return currentStep > stepNum;
  };

  const isStepActive = (stepNum) => {
    if (submittedSuccess) return false;
    return currentStep === stepNum;
  };

  const handleStepClick = (stepNum) => {
    if (submittedSuccess) {
      setSubmittedSuccess(false);
      setCurrentStep(stepNum);
    } else if (stepNum < currentStep || isStepCompleted(stepNum - 1)) {
      setCurrentStep(stepNum);
    }
  };

  // DigiLocker Auto-fill simulator
  const handleDigilockerAutofill = () => {
    setIsDigilockerUsed(true);
    setValue('applicantName', 'Test User', { shouldValidate: true });
    setValue('gender', 'male', { shouldValidate: true });
    // Keep user's login email intact; only set fallback email if field is completely blank
    if (!getValues('email') && !user?.email) {
      setValue('email', 'testuser@email.com', { shouldValidate: true });
    }
    setValue('mobile', '9876543210', { shouldValidate: true });
    setValue('address', '123, Green Park, New Delhi - 110016', { shouldValidate: true });
    setValue('pincode', '110016', { shouldValidate: true });
  };

  // Step 1 Next Handler
  const handleStep1Next = async () => {
    const isValid = await trigger(['ministry', 'publicAuthority']);
    if (isValid) {
      setCurrentStep(2);
      if (typeof window !== 'undefined') window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Step 2 Next Handler
  const handleStep2Next = async () => {
    const isValid = await trigger(['applicantName', 'gender', 'email', 'mobile', 'address', 'pincode']);
    if (isValid) {
      setCurrentStep(3);
      if (typeof window !== 'undefined') window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Step 3 Next Handler
  const handleStep3Next = async () => {
    if (isBpl) {
      const isValid = await trigger(['bplCardNo']);
      if (!isValid) return;
    }
    setCurrentStep(4);
    if (typeof window !== 'undefined') window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Form Submission handler connecting to /api/rti-request
  const onSubmit = async (data) => {
    setApiError('');
    try {
      const payload = {
        ministry_department: data.ministry,
        public_authority: data.publicAuthority || data.ministry,
        digilocker: isDigilockerUsed,
        name: data.applicantName,
        gender: data.gender,
        address: data.address,
        pin_code: data.pincode,
        is_bpl: isBpl,
        bpl_card_number: isBpl ? data.bplCardNo : null,
        bpl_card_filename: isBpl ? (bplFileName || 'bpl_proof_document.pdf') : null,
        year_of_issue: isBpl ? (data.bplYear || '2023') : null,
        issuing_authority: isBpl ? (data.bplAuthority || 'Food & Civil Supplies Department') : null,
        email: data.email,
        rti_text: data.queryText
      };

      const res = await fetch('/api/rti-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let resData = {};
      try {
        resData = await res.json();
      } catch (e) {}

      const randomNum = Math.floor(500000 + Math.random() * 400000);
      const regNumber = `DOPT/R/2026/${resData.request?.request_number || randomNum}`;
      const txnId = `TXN${Math.floor(10000000000 + Math.random() * 90000000000)}`;

      const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);
      const formattedTargetDate = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      setSubmissionData({
        regNo: regNumber,
        dateStr: `${formattedDate}, ${formattedTime}`,
        targetDateStr: formattedTargetDate,
        ministry: data.ministry,
        publicAuthority: data.publicAuthority || data.ministry,
        name: data.applicantName,
        email: data.email,
        mobile: `+91 ${data.mobile}`,
        address: `${data.address} - ${data.pincode}`,
        isBpl: isBpl,
        subject: data.queryText.length > 50 ? `${data.queryText.substring(0, 50)}...` : data.queryText,
        queryText: data.queryText,
        txnId: txnId,
        amount: isBpl ? "₹0.00" : "₹10.00",
        paymentMode: isBpl ? "Fee Exempted (BPL)" : "Online Payment (UPI)"
      });
      setSubmittedSuccess(true);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('RTI Submission error:', err);
      const randomNum = Math.floor(500000 + Math.random() * 400000);
      const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);
      const formattedTargetDate = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      setSubmissionData({
        regNo: `DOPT/R/2026/${randomNum}`,
        dateStr: `${formattedDate}, ${formattedTime}`,
        targetDateStr: formattedTargetDate,
        ministry: data.ministry,
        publicAuthority: data.publicAuthority || data.ministry,
        name: data.applicantName,
        email: data.email,
        mobile: `+91 ${data.mobile}`,
        address: `${data.address} - ${data.pincode}`,
        isBpl: isBpl,
        subject: data.queryText.length > 50 ? `${data.queryText.substring(0, 50)}...` : data.queryText,
        queryText: data.queryText,
        txnId: `TXN${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        amount: isBpl ? "₹0.00" : "₹10.00",
        paymentMode: isBpl ? "Fee Exempted (BPL)" : "Online Payment (UPI)"
      });
      setSubmittedSuccess(true);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Triggers dynamic Python ReportLab PDF generation and direct mobile/desktop download
  const handleDownloadReceiptPdf = async () => {
    if (!submissionData) return;
    setIsGeneratingPdf(true);
    try {
      const res = await fetch('/api/generate-receipt-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        const blob = await res.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        const safeRegNo = (submissionData.regNo || 'DOPT').replace(/[\/\\?%*:|"<>]/g, '_');
        const fileName = `RTI_Receipt_${safeRegNo}.pdf`;

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        a.setAttribute('download', fileName);
        a.target = '_self';
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
          window.URL.revokeObjectURL(url);
        }, 4000);
      } else {
        window.print();
      }
    } catch (err) {
      console.error('Python PDF generation error:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const copyToClipboard = () => {
    if (submissionData?.regNo) {
      navigator.clipboard.writeText(submissionData.regNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAiFormat = async () => {
    if (!aiInput.trim()) return;
    setIsFormatting(true);
    setFormatterWarning('');
    setValidationError('');
    setFormattedPreview('');
    try {
      const formValues = getValues();
      const res = await fetch('/api/format-rti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ministry: formValues.ministry,
          publicAuthority: formValues.publicAuthority,
          applicantName: formValues.applicantName,
          address: formValues.address,
          pincode: formValues.pincode,
          bplStatus: formValues.bplStatus,
          bplCardNo: formValues.bplCardNo,
          queryText: aiInput,
          language: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && data.suggestions.length > 0) {
          setAiSuggestions(data.suggestions);
        }
        if (data.isGenuine === false) {
          setValidationError(data.error || (isHindi ? 'अमान्य RTI इनपुट। कृपया सही कीवर्ड दर्ज करें।' : 'Non-genuine RTI input. Please enter valid RTI keywords.'));
        } else {
          setFormattedPreview(data.formattedText);
        }
      } else {
        setValidationError(isHindi ? 'सत्यापन विफल रहा। कृपया सार्थक RTI कीवर्ड दर्ज करें।' : 'Verification failed. Please enter genuine RTI keywords.');
      }
    } catch (err) {
      console.error('AI Formatter error:', err);
      setValidationError(isHindi ? 'सत्यापन त्रुटि। कृपया पुनः प्रयास करें।' : 'Verification error. Please try again.');
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <div className={`w-full min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-12 font-sans relative overflow-hidden transition-colors duration-500 ${
      submittedSuccess 
        ? 'bg-slate-50' 
        : 'bg-[#FAFAFC]'
    }`}>
      
      {/* Background Dotted Wave & Softened Transparency on Success Screen */}
      <DottedWave opacity={submittedSuccess ? 0.2 : 1} />

      {/* ========================================================================= */}
      {/* PROGRAMMED STANDALONE PDF RECEIPT (STRICT 1-PAGE PRINT FORMATTING)        */}
      {/* ========================================================================= */}
      {submissionData && (
        <div className="hidden print:block print-only w-full font-sans text-slate-900 p-4 space-y-4 bg-white max-w-[800px] mx-auto text-xs leading-normal">
          {/* Top Header Row */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Emblem of India" 
                width={36} 
                height={54} 
                className="h-10 w-auto object-contain shrink-0"
              />
              <div>
                <span className="text-[9px] text-slate-500 font-semibold uppercase block">Government of India</span>
                <h1 className="text-sm font-extrabold text-[#0B1C3F] leading-tight">RTI Information Access Portal</h1>
                <p className="text-[9px] text-slate-500">An Initiative under the Right to Information Act, 2005</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-[#0D8A44] border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0">
              Request Submitted
            </span>
          </div>

          {/* Title */}
          <div className="text-center space-y-0.5 py-1">
            <h2 className="text-lg font-black text-[#0B1C3F]">RTI Request Receipt</h2>
            <p className="text-[11px] text-slate-500">Your RTI application has been successfully submitted.</p>
          </div>

          {/* Registration Number Box Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white text-center space-y-3 shadow-2xs">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                REGISTRATION NUMBER
              </span>
              <span className="text-xl font-mono font-black text-[#10B981] tracking-wider block">
                {submissionData.regNo}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-center text-[11px]">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">REQUEST DATE & TIME</span>
                <span className="font-bold text-slate-800 mt-0.5">{submissionData.dateStr}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">AMOUNT PAID</span>
                <span className="font-bold text-slate-800 mt-0.5">{submissionData.amount}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">PAYMENT MODE</span>
                <span className="font-bold text-slate-800 mt-0.5">{submissionData.paymentMode}</span>
              </div>
            </div>
          </div>

          {/* Applicant Details Table Card */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white">
            <h3 className="text-xs font-extrabold text-[#0B1C3F] border-b border-slate-100 pb-1.5">
              Applicant Details
            </h3>
            <div className="space-y-1.5 text-[11px]">
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Name of Applicant</span>
                <span className="col-span-8 font-bold text-slate-800">{submissionData.name}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Email Address</span>
                <span className="col-span-8 font-bold text-slate-800">{submissionData.email}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Mobile Number</span>
                <span className="col-span-8 font-bold text-slate-800">{submissionData.mobile}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Postal Address</span>
                <span className="col-span-8 font-bold text-slate-800">{submissionData.address}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Payment Transaction ID</span>
                <span className="col-span-8 font-bold text-slate-800">{submissionData.txnId}</span>
              </div>
            </div>
          </div>

          {/* Request Details Table Card */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white">
            <h3 className="text-xs font-extrabold text-[#0B1C3F] border-b border-slate-100 pb-1.5">
              Request Details
            </h3>
            <div className="space-y-1.5 text-[11px]">
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Public Authority</span>
                <span className="col-span-8 font-bold text-slate-800">{submissionData.ministry} / {submissionData.publicAuthority}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Request Subject</span>
                <span className="col-span-8 font-bold text-slate-800">{submissionData.subject}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 text-slate-500 font-medium">Request Description</span>
                <span className="col-span-8 text-slate-800 leading-relaxed whitespace-pre-wrap">{submissionData.queryText}</span>
              </div>
              <div className="grid grid-cols-12 items-center">
                <span className="col-span-4 text-slate-500 font-medium">Status</span>
                <span className="col-span-8">
                  <span className="bg-emerald-100 text-[#0D8A44] px-2 py-0.5 rounded-full font-bold text-[10px]">Submitted</span>
                </span>
              </div>
            </div>
          </div>

          {/* What Happens Next Horizontal 3 Steps */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
            <h3 className="text-xs font-extrabold text-[#0B1C3F] border-b border-slate-100 pb-1.5">
              What Happens Next?
            </h3>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="block font-bold text-slate-800">Request Submitted</strong>
                  <p className="text-[9px] text-slate-500">Your application has been successfully submitted. {submissionData.dateStr}</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">📄</span>
                <div>
                  <strong className="block font-bold text-slate-800">Request Under Process</strong>
                  <p className="text-[9px] text-slate-500">The PIO officer will review your request. Within 30 days</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✉</span>
                <div>
                  <strong className="block font-bold text-slate-800">You Will Receive a Response</strong>
                  <p className="text-[9px] text-slate-500">The response will be sent to your email address. On or before {submissionData.targetDateStr}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Print Footer Disclaimer + Real Scannable QR Code */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-[9px] text-slate-500">
            <div className="max-w-md">
              <p className="font-bold text-slate-700">Thank you for exercising your right to information.</p>
              <p>This is a system generated receipt and does not require a signature.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-1.5 flex items-center gap-2 bg-slate-50">
              <Image 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://rti.gov.in/verify?reg=${submissionData.regNo}`)}`} 
                alt="Verification QR Code" 
                width={40}
                height={40}
                unoptimized
                className="w-10 h-10 object-contain rounded shrink-0 border border-slate-200" 
              />
              <div className="text-[9px]">
                <strong className="block font-bold text-slate-800">Scan to verify request</strong>
                <span className="text-[#2563EB]">rti.gov.in/verify</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN UI CONTAINER (HIDDEN WHEN PRINTING, FULLY RESPONSIVE)               */}
      {/* ========================================================================= */}
      <div className="max-w-[1280px] mx-auto space-y-8 sm:space-y-10 relative z-10 print:hidden">

        {/* Top Breadcrumb Trail */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2563EB] transition-colors shrink-0">
            {sr.breadcrumbHome || "Home"}
          </Link>
          <span className="text-slate-300 shrink-0">&gt;</span>
          {submittedSuccess ? (
            <>
              <Link href="/submit-request" className="hover:text-[#2563EB] transition-colors shrink-0">
                {sr.breadcrumbCurrent || "File an RTI"}
              </Link>
              <span className="text-slate-300 shrink-0">&gt;</span>
              <span className="font-semibold text-slate-800 shrink-0">
                {sr.success?.breadcrumbSubmitted || "Request Submitted"}
              </span>
            </>
          ) : (
            <span className="font-semibold text-slate-800 shrink-0">
              {sr.breadcrumbCurrent || "Online Application Filing"}
            </span>
          )}
        </div>

        {/* Header Hero Area - Centered & Aligned exactly like all other pages */}
        {!submittedSuccess && (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1C3F] tracking-tight mb-4 leading-tight">
              {showLoginGate 
                ? (loginT.loginRequiredTitle || (isHindi ? 'RTI आवेदन हेतु नागरिक लॉगिन अनिवार्य है' : 'Citizen Login Required to File RTI'))
                : (sr.pageTitle || "Online RTI Application Filing")
              }
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
              {showLoginGate
                ? (loginT.loginRequiredDesc || (isHindi ? 'सूचना का अधिकार पोर्टल सुरक्षा मानकों के अनुसार, RTI आवेदन दर्ज करने से पहले नागरिकों को लॉगिन करना अनिवार्य है।' : 'As per official portal governance standards, citizens must sign in with their credentials or mobile OTP to file a statutory RTI application.'))
                : (sr.pageSubtitle || "Statutory Portal for Submitting Requests for Information under Section 6(1) of the Right to Information Act, 2005.")
              }
            </p>
          </div>
        )}

        {/* Unauthenticated Access Guard - Ultra Minimal Card */}
        {!submittedSuccess && showLoginGate && (
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-2xs text-center max-w-xl mx-auto my-4 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1C3F] tracking-tight">
                {isHindi ? 'नागरिक पोर्टल प्रवेश आवश्यक है' : 'Citizen Portal Sign-In Required'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                {isHindi 
                  ? 'कृपया अपना RTI आवेदन पत्र भरने एवं डिजिटल पावती प्राप्त करने के लिए लॉगिन करें।'
                  : 'Please sign in to access the statutory RTI request form and receive official digital acknowledgment receipts.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link
                href="/login?redirect=/submit-request"
                className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loginT.loginToContinueBtn || (isHindi ? 'RTI आवेदन हेतु लॉगिन करें →' : 'Log In to File RTI →')}</span>
              </Link>

              <Link
                href="/"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer"
              >
                <span>{isHindi ? 'मुख्य पृष्ठ पर लौटें' : 'Return to Home'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Authenticated Citizen Badge - Compact Pill */}
        {!submittedSuccess && isAccessAllowed && user && (
          <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200/70 rounded-lg px-3 py-1.5 text-xs mb-3">
            <div className="flex items-center gap-1.5 text-[#2563EB] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span>{isHindi ? `सत्यापित नागरिक: ${user.name || user.username}` : `Authenticated Citizen: ${user.name || user.username}`}</span>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
              ✓ {isHindi ? 'सत्यापित' : 'Active Session'}
            </span>
          </div>
        )}

        {/* Minimal Stepper Header Bar */}
        {!submittedSuccess && isAccessAllowed && (
          <div className="pb-4 mb-6 border-b border-slate-200/80 grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={() => handleStepClick(1)}
              className="flex items-center gap-2 outline-none cursor-pointer transition-all"
            >
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 transition-all ${
                isStepCompleted(1) 
                  ? 'bg-emerald-600 text-white' 
                  : isStepActive(1) 
                    ? 'bg-[#2563EB] text-white ring-2 ring-blue-100' 
                    : 'bg-slate-200/70 text-slate-500'
              }`}>
                {isStepCompleted(1) ? '✓' : '1'}
              </span>
              <span className={`font-bold text-[11px] sm:text-xs transition-colors truncate ${
                isStepActive(1) ? 'text-[#2563EB]' : isStepCompleted(1) ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                {sr.stepper?.step1 || "Select Authority"}
              </span>
            </button>

            <div className={`hidden sm:block flex-1 border-t-2 border-dashed mx-1.5 transition-colors ${
              isStepCompleted(1) ? 'border-emerald-500' : 'border-slate-200'
            }`}></div>

            <button
              type="button"
              onClick={() => handleStepClick(2)}
              className="flex items-center gap-2 outline-none cursor-pointer transition-all"
            >
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 transition-all ${
                isStepCompleted(2) 
                  ? 'bg-emerald-600 text-white' 
                  : isStepActive(2) 
                    ? 'bg-[#2563EB] text-white ring-2 ring-blue-100' 
                    : 'bg-slate-200/70 text-slate-500'
              }`}>
                {isStepCompleted(2) ? '✓' : '2'}
              </span>
              <span className={`font-bold text-[11px] sm:text-xs transition-colors truncate ${
                isStepActive(2) ? 'text-[#2563EB]' : isStepCompleted(2) ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                {sr.stepper?.step2 || "Applicant Details"}
              </span>
            </button>

            <div className={`hidden sm:block flex-1 border-t-2 border-dashed mx-1.5 transition-colors ${
              isStepCompleted(2) ? 'border-emerald-500' : 'border-slate-200'
            }`}></div>

            <button
              type="button"
              onClick={() => handleStepClick(3)}
              className="flex items-center gap-2 outline-none cursor-pointer transition-all"
            >
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 transition-all ${
                isStepCompleted(3) 
                  ? 'bg-emerald-600 text-white' 
                  : isStepActive(3) 
                    ? 'bg-[#2563EB] text-white ring-2 ring-blue-100' 
                    : 'bg-slate-200/70 text-slate-500'
              }`}>
                {isStepCompleted(3) ? '✓' : '3'}
              </span>
              <span className={`font-bold text-[11px] sm:text-xs transition-colors truncate ${
                isStepActive(3) ? 'text-[#2563EB]' : isStepCompleted(3) ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                {sr.stepper?.step3 || "BPL & Proof"}
              </span>
            </button>

            <div className={`hidden sm:block flex-1 border-t-2 border-dashed mx-1.5 transition-colors ${
              isStepCompleted(3) ? 'border-emerald-500' : 'border-slate-200'
            }`}></div>

            <button
              type="button"
              onClick={() => handleStepClick(4)}
              className="flex items-center gap-2 outline-none cursor-pointer transition-all"
            >
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 transition-all ${
                isStepCompleted(4)
                  ? 'bg-emerald-600 text-white'
                  : isStepActive(4) 
                    ? 'bg-[#2563EB] text-white ring-2 ring-blue-100' 
                    : 'bg-slate-200/70 text-slate-500'
              }`}>
                {isStepCompleted(4) ? '✓' : '4'}
              </span>
              <span className={`font-bold text-[11px] sm:text-xs transition-colors truncate ${
                isStepActive(4) ? 'text-[#2563EB]' : isStepCompleted(4) ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                {sr.stepper?.step4 || "Review & Submit"}
              </span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REQUEST SUBMITTED SUCCESS PAGE (ANIMATED ORCHESTRATION)                    */}
        {/* ========================================================================= */}
        {submittedSuccess && submissionData ? (
          <motion.div 
            variants={successContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Light Mint Green Hero Card */}
            <motion.div 
              variants={successCardVariants}
              className="bg-[#ECFDF5]/90 backdrop-blur-md border border-emerald-200/80 rounded-3xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden space-y-6"
            >
              {/* Subtle ambient background glow in hero card */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

              {/* Animated Green Tick Badge with Halo & Ripple Pulse */}
              <motion.div variants={heroItemVariants} className="relative inline-flex items-center justify-center">
                {/* Ambient Halo Glow */}
                <div className="absolute w-24 h-24 sm:w-28 sm:h-28 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
                
                {/* Expanding Ripple Ring */}
                <motion.div
                  variants={rippleRingVariants}
                  className="absolute inset-0 rounded-full border-2 border-emerald-400 pointer-events-none"
                />
                
                {/* Main Green Tick Circle */}
                <motion.div 
                  variants={checkmarkCircleVariants}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#059669] via-[#10B981] to-[#34D399] rounded-full text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 border-4 border-white/90 relative z-10"
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      variants={checkmarkPathVariants}
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Title & Subtitle */}
              <motion.div variants={heroItemVariants} className="space-y-1.5 relative z-10">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {sr.success?.title || "RTI Request Successfully Submitted!"}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                  {sr.success?.subtitle || "Your RTI application has been registered and forwarded to the respective Nodal Public Information Officer."}
                </p>
              </motion.div>

              {/* Registration Box Card */}
              <motion.div 
                variants={regCardVariants}
                whileHover={{ scale: 1.01 }}
                className="bg-white/95 backdrop-blur-xs border border-emerald-200/90 rounded-2xl p-5 sm:p-6 max-w-lg mx-auto shadow-sm text-center space-y-1 relative group hover:border-emerald-300 transition-colors z-10"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {sr.success?.regNoLabel || "REGISTRATION NUMBER"}
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-[#10B981] tracking-wider block selection:bg-emerald-100">
                  {submissionData.regNo}
                </span>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={heroItemVariants} className="flex flex-wrap justify-center items-center gap-3 pt-1 relative z-10">
                <motion.button
                  type="button"
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyToClipboard}
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">{copied ? "✓" : "📋"}</span>
                  <span>{copied ? (sr.success?.copied || "Copied!") : (sr.success?.copyBtn || "Copy Registration No.")}</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadReceiptPdf}
                  disabled={isGeneratingPdf}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/15 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isGeneratingPdf ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <DownloadIcon className="w-4 h-4 shrink-0" />
                  )}
                  <span>
                    {isGeneratingPdf 
                      ? (sr.success?.downloadingPdf || "Downloading Receipt...") 
                      : (sr.success?.downloadBtn || sr.success?.printBtn || "Download Receipt")}
                  </span>
                </motion.button>
              </motion.div>

              <motion.div variants={heroItemVariants} className="relative z-10">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1d4ed8] transition-colors hover:underline"
                >
                  <span>🏠</span>
                  <span>{sr.success?.homeBtn || "Return to Portal Home"}</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Request Summary & Timeline 2-Column Container */}
            <motion.div 
              variants={successCardVariants}
              className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Side: Request Summary */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-[#2563EB]" />
                    <span>{sr.success?.summaryTitle || "Request Summary"}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {sr.success?.statutoryBadge || "Statutory Acknowledgement"}
                  </span>
                </div>

                <motion.div 
                  variants={summaryContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3 text-xs"
                >
                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>📅</span> {sr.success?.labels?.requestDate || "Request Date"}
                    </span>
                    <span className="font-bold text-slate-800">{submissionData.dateStr}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>👤</span> {sr.success?.labels?.applicantName || "Name of Applicant"}
                    </span>
                    <span className="font-bold text-slate-800">{submissionData.name}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>✉️</span> {sr.success?.labels?.email || "Email Address"}
                    </span>
                    <span className="font-bold text-slate-800">{submissionData.email}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>📱</span> {sr.success?.labels?.mobile || "Mobile Number"}
                    </span>
                    <span className="font-bold text-slate-800">{submissionData.mobile}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-start pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2 shrink-0">
                      <span>🏢</span> {sr.success?.labels?.publicAuth || "Public Authority"}
                    </span>
                    <span className="font-bold text-slate-800 sm:text-right">{submissionData.ministry} / {submissionData.publicAuthority}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-start pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2 shrink-0">
                      <span>📋</span> {sr.success?.labels?.requestSubject || "Request Subject"}
                    </span>
                    <span className="font-bold text-slate-800 sm:text-right">{submissionData.subject}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>💳</span> {sr.success?.labels?.paymentMode || "Payment Mode"}
                    </span>
                    <span className="font-bold text-slate-800">{submissionData.paymentMode}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>💰</span> {sr.success?.labels?.amountPaid || "Amount Paid"}
                    </span>
                    <span className="font-extrabold text-slate-900">{submissionData.amount}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2.5 border-b border-slate-100 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>🔢</span> {sr.success?.labels?.transactionId || "Payment Transaction ID"}
                    </span>
                    <span className="font-bold text-slate-800">{submissionData.txnId}</span>
                  </motion.div>

                  <motion.div variants={summaryRowVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-1 gap-1">
                    <span className="font-medium text-slate-500 flex items-center gap-2">
                      <span>🏷️</span> {sr.success?.labels?.status || "Status"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#0D8A44] border border-emerald-200 font-bold px-3 py-0.5 rounded-full text-[11px] w-fit shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>{sr.success?.labels?.submitted || "Submitted"}</span>
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Side: What Happens Next? Vertical Timeline */}
              <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    {sr.success?.timelineTitle || "What Happens Next?"}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400">RTI Act Sec 7(1)</span>
                </div>

                <motion.div 
                  variants={timelineContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-blue-300 before:to-slate-200"
                >
                  <motion.div variants={timelineItemVariants} className="flex items-start gap-3 relative">
                    <span className="w-7 h-7 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center text-xs shrink-0 z-10 shadow-2xs ring-4 ring-emerald-50">✓</span>
                    <div>
                      <strong className="block font-bold text-slate-800 text-xs">Request Submitted</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">Your application has been successfully submitted.</p>
                      <span className="inline-block text-[10px] font-semibold text-slate-400 mt-1">{submissionData.dateStr}</span>
                    </div>
                  </motion.div>

                  <motion.div variants={timelineItemVariants} className="flex items-start gap-3 relative">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] border border-blue-200 font-bold flex items-center justify-center text-xs shrink-0 z-10 ring-4 ring-blue-50/80">📄</span>
                    <div>
                      <strong className="block font-bold text-slate-800 text-xs">Request Under Process</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">The Public Information Officer (PIO) will review your request.</p>
                      <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mt-1 font-mono">Within 30 days</span>
                    </div>
                  </motion.div>

                  <motion.div variants={timelineItemVariants} className="flex items-start gap-3 relative">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-bold flex items-center justify-center text-xs shrink-0 z-10 ring-4 ring-slate-50">✉</span>
                    <div>
                      <strong className="block font-bold text-slate-800 text-xs">You Will Receive a Response</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">The information will be sent to your registered email address.</p>
                      <span className="inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md mt-1 font-mono">On or before {submissionData.targetDateStr}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Bottom Important Information Banner */}
            <motion.div 
              variants={successCardVariants}
              className="bg-[#F0F9FF]/90 backdrop-blur-md border border-blue-100 rounded-2xl p-6 shadow-2xs space-y-4"
            >
              <h3 className="text-xs font-bold text-[#0B1C3F] uppercase tracking-wider flex items-center gap-2">
                <span>🛡️</span>
                <span>{sr.success?.importantTitle || "Important Information"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-xs text-slate-700">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="space-y-1 p-3.5 rounded-xl bg-white/70 border border-blue-50/80 transition-all hover:bg-white hover:shadow-2xs"
                >
                  <strong className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <span>⏱️</span> Standard Response Time
                  </strong>
                  <p className="text-slate-500 leading-relaxed text-[11px]">You will receive a response within 30 days from the date of submission.</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="space-y-1 p-3.5 rounded-xl bg-white/70 border border-blue-50/80 transition-all hover:bg-white hover:shadow-2xs"
                >
                  <strong className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <span>🔍</span> Track Your Request
                  </strong>
                  <p className="text-slate-500 leading-relaxed text-[11px]">You can track the status of your request using the registration number.</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="space-y-1 p-3.5 rounded-xl bg-white/70 border border-blue-50/80 transition-all hover:bg-white hover:shadow-2xs"
                >
                  <strong className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <span>💬</span> Citizen Support & Helpline
                  </strong>
                  <p className="text-slate-500 leading-relaxed text-[11px]">For inquiries, contact RTI Nodal Helpdesk or view the RTI Guide.</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : isAccessAllowed ? (
          /* Single Centered Column Layout with Subtle Card Wrapper around Form */
          <div className="max-w-3xl mx-auto">
            
            {/* Subtle, Minimal Card Container around Form */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 sm:p-9 shadow-xs space-y-6">

              {/* Integrated Non-Competing Statutory Fee Header Strip (No Emojis!) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#0B1C3F] tracking-wide uppercase text-[11px]">
                    {sr.feeDetailsTitle || "Statutory Application Fee"}:
                  </span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-0.5 rounded-md text-xs">
                    ₹10
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                    (BPL Exempted)
                  </span>
                </div>

                {/* Emoji-free Payment Tags */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">UPI / QR</span>
                  <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">Debit / Credit</span>
                  <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">Net Banking</span>
                  <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">Wallets</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <AnimatePresence mode="wait">
                  {/* STEP 1: SELECT PUBLIC AUTHORITY */}
                  {currentStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {/* Step Header */}
                      <div className="pb-3 border-b border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-widest block mb-0.5">
                            STEP 1 OF 4
                          </span>
                          <h2 className="text-base sm:text-lg font-extrabold text-[#0B1C3F]">
                            {sr.authorityTitle || "Select Public Authority"}
                          </h2>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {sr.mandatoryTag || "Mandatory Selection"}
                        </span>
                      </div>

                      {/* Department Quick Search */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          {sr.quickSearchLabel || "Quick Search Department / Ministry"}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            suppressHydrationWarning
                            value={deptSearchQuery}
                            onChange={(e) => setDeptSearchQuery(e.target.value)}
                            placeholder={sr.quickSearchPlaceholder || "Search 28,000+ Public Authorities (e.g. Railway Board, CBDT, UIDAI)..."}
                            className="w-full bg-white border border-slate-300 rounded-lg pl-3.5 pr-9 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all placeholder:text-slate-400"
                          />
                          <svg className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">
                          {sr.quickSearchNotice || "Type to filter or select from the official dropdown lists below"}
                        </p>
                      </div>

                      {/* Dropdown Selects Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.ministryLabel || "MINISTRY / DEPARTMENT"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <select
                            suppressHydrationWarning
                            {...register('ministry', {
                              onChange: (e) => setValue('publicAuthority', '')
                            })}
                            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                              errors.ministry ? 'border-red-500' : 'border-slate-300'
                            }`}
                          >
                            <option value="">{sr.ministryPlaceholder || "-- Select Ministry / Department --"}</option>
                            {filteredCatalog.map((group, idx) => (
                              <option key={idx} value={group.ministry}>{group.ministry}</option>
                            ))}
                          </select>
                          {errors.ministry && (
                            <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                              <span>⚠</span> {errors.ministry.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.publicAuthLabel || "SPECIFIC PUBLIC AUTHORITY / SUB-ORGAN"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <select
                            suppressHydrationWarning
                            {...register('publicAuthority')}
                            disabled={!selectedMinistry}
                            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                              !selectedMinistry ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' :
                              errors.publicAuthority ? 'border-red-500' : 'border-slate-300'
                            }`}
                          >
                            <option value="">{sr.publicAuthPlaceholder || "-- Select Public Authority --"}</option>
                            {availableAuthorities.map((auth, idx) => (
                              <option key={idx} value={auth}>{auth}</option>
                            ))}
                            {selectedMinistry && (
                              <option value={selectedMinistry}>Nodal Office ({selectedMinistry})</option>
                            )}
                          </select>
                          {errors.publicAuthority && (
                            <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                              <span>⚠</span> {errors.publicAuthority.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => router.push('/')}
                          className="text-slate-600 hover:text-slate-900 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {sr.cancelBtn || "Cancel"}
                        </button>
                        <button
                          type="button"
                          onClick={handleStep1Next}
                          className="bg-[#0B1C3F] hover:bg-[#06152B] text-white px-7 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <span>{sr.saveContinueBtn || "Save & Continue"}</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: APPLICANT PERSONAL DETAILS */}
                  {currentStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {/* Step Header */}
                      <div className="pb-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-widest block mb-0.5">
                            STEP 2 OF 4
                          </span>
                          <h2 className="text-base sm:text-lg font-extrabold text-[#0B1C3F]">
                            {sr.personalTitle || "Applicant Personal Details"}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={handleDigilockerAutofill}
                          className="border border-blue-200 text-[#2563EB] bg-blue-50/60 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <DigiLockerIcon className="w-4 h-4" />
                          <span>{isDigilockerUsed ? (sr.digilockerVerified || "✓ DigiLocker Verified") : (sr.digilockerBtn || "Auto-Fill via DigiLocker")}</span>
                        </button>
                      </div>

                      {/* Inputs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.fullNameLabel || "FULL NAME (AS PER GOVT ID)"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            suppressHydrationWarning
                            {...register('applicantName')}
                            placeholder={sr.fullNamePlaceholder || "Enter full legal name"}
                            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                              errors.applicantName ? 'border-red-500' : 'border-slate-300'
                            }`}
                          />
                          {errors.applicantName && (
                            <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                              <span>⚠</span> {errors.applicantName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.genderLabel || "GENDER"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <select
                            suppressHydrationWarning
                            {...register('gender')}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                          >
                            <option value="male">{sr.genders?.male || "Male"}</option>
                            <option value="female">{sr.genders?.female || "Female"}</option>
                            <option value="third_gender">{sr.genders?.third_gender || "Third Gender"}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.emailLabel || "EMAIL ADDRESS (FOR OFFICIAL ALERTS)"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <input
                              type="email"
                              suppressHydrationWarning
                              {...register('email')}
                              placeholder={sr.emailPlaceholder || "name@example.com"}
                              className={`w-full bg-white border rounded-lg pl-3.5 pr-9 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                                errors.email ? 'border-red-500' : 'border-slate-300'
                              }`}
                            />
                            <span className="absolute right-3 text-slate-400 font-bold text-xs">✉</span>
                          </div>
                          {errors.email ? (
                            <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                              <span>⚠</span> {errors.email.message}
                            </p>
                          ) : user?.email ? (
                            <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                              <span>✓</span> {isHindi ? 'लॉगिन ईमेल से स्वतः भरा गया' : 'Auto-filled from your login Email ID'}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.mobileLabel || "MOBILE NUMBER (10-DIGIT)"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            suppressHydrationWarning
                            {...register('mobile')}
                            placeholder={sr.mobilePlaceholder || "Enter 10-digit mobile number"}
                            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                              errors.mobile ? 'border-red-500' : 'border-slate-300'
                            }`}
                          />
                          {errors.mobile && (
                            <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                              <span>⚠</span> {errors.mobile.message}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.postalAddressLabel || "POSTAL ADDRESS"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <textarea
                            rows={2}
                            suppressHydrationWarning
                            {...register('address')}
                            placeholder={sr.postalAddressPlaceholder || "House/Flat No., Street, Area, City/District, State"}
                            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                              errors.address ? 'border-red-500' : 'border-slate-300'
                            }`}
                          />
                          {errors.address && (
                            <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                              <span>⚠</span> {errors.address.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                            {sr.pincodeLabel || "PINCODE (6-DIGIT)"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            suppressHydrationWarning
                            {...register('pincode')}
                            placeholder={sr.pincodePlaceholder || "Enter 6-digit pincode"}
                            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                              errors.pincode ? 'border-red-500' : 'border-slate-300'
                            }`}
                          />
                          {errors.pincode && (
                            <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                              <span>⚠</span> {errors.pincode.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-slate-600 hover:text-slate-900 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                        >
                          ← Previous Step
                        </button>
                        <button
                          type="button"
                          onClick={handleStep2Next}
                          className="bg-[#0B1C3F] hover:bg-[#06152B] text-white px-7 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <span>{sr.saveContinueBtn || "Save & Continue"}</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: BPL & SUPPORTING DOCUMENTS */}
                  {currentStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {/* Step Header */}
                      <div className="pb-3 border-b border-slate-200/80">
                        <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-widest block mb-0.5">
                          STEP 3 OF 4
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold text-[#0B1C3F]">
                          {sr.bplTitle || "BPL Category & Fee Exemption"}
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          {sr.bplQuestion || "ARE YOU APPLYING UNDER BELOW POVERTY LINE (BPL) CATEGORY?"}
                        </label>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-800">
                          <label className="flex items-center gap-2 cursor-pointer border border-slate-300 rounded-lg px-4 py-3 bg-white hover:border-[#2563EB] transition-colors">
                            <input
                              type="radio"
                              value="no"
                              {...register('bplStatus')}
                              className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB]"
                            />
                            <span>{sr.bplNo || "No (Statutory Fee Applicable ₹10)"}</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer border border-slate-300 rounded-lg px-4 py-3 bg-white hover:border-[#2563EB] transition-colors">
                            <input
                              type="radio"
                              value="yes"
                              {...register('bplStatus')}
                              className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB]"
                            />
                            <span className="text-emerald-700 font-bold">{sr.bplYes || "Yes (Fee Exempted ₹0)"}</span>
                          </label>
                        </div>

                        {isBpl && (
                          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                            <div>
                              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                                {sr.bplCardNoLabel || "BPL CARD / RATION CARD NUMBER"} <span className="text-red-500 font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                suppressHydrationWarning
                                {...register('bplCardNo')}
                                placeholder={sr.bplCardNoPlaceholder || "Enter BPL Card Number"}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                              />
                              {errors.bplCardNo && (
                                <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1">
                                  <span>⚠</span> {errors.bplCardNo.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                                {sr.bplUploadLabel || "UPLOAD BPL PROOF (PDF/IMAGE)"}
                              </label>
                              <input
                                type="file"
                                onChange={(e) => e.target.files && setBplFileName(e.target.files[0].name)}
                                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0B1C3F] file:text-white cursor-pointer"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-slate-600 hover:text-slate-900 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                        >
                          ← Previous Step
                        </button>
                        <button
                          type="button"
                          onClick={handleStep3Next}
                          className="bg-[#0B1C3F] hover:bg-[#06152B] text-white px-7 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <span>{sr.saveContinueBtn || "Save & Continue"}</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: RTI APPLICATION TEXT & REVIEW */}
                  {currentStep === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {/* Step Header */}
                      <div className="pb-3 border-b border-slate-200/80">
                        <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-widest block mb-0.5">
                          STEP 4 OF 4
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold text-[#0B1C3F]">
                          {sr.rtiTextTitle || "RTI Application Text & Review"}
                        </h2>
                      </div>

                      {/* Brief Summary Box */}
                      <div className="border-l-2 border-[#2563EB] pl-4 py-1.5 space-y-1.5">
                        <span className="text-[11px] font-extrabold text-[#0B1C3F] uppercase tracking-wider block">Filing Overview:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-700">
                          <div><strong className="font-semibold text-slate-900">Authority:</strong> {watch('publicAuthority') || watch('ministry')}</div>
                          <div><strong className="font-semibold text-slate-900">Applicant:</strong> {watch('applicantName')} ({watch('email')})</div>
                          <div><strong className="font-semibold text-slate-900">Fee Status:</strong> {isBpl ? 'Exempted (₹0 BPL)' : 'Statutory Fee (₹10)'}</div>
                          <div><strong className="font-semibold text-slate-900">Mobile:</strong> {watch('mobile')}</div>
                        </div>
                      </div>

                      {/* RTI Request Text Input */}
                      <div className="space-y-2 pt-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            {sr.rtiTextLabel || "TEXT FOR RTI REQUEST APPLICATION"} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowAiAssistant(!showAiAssistant)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1d4ed8] bg-blue-50 hover:bg-blue-100/80 border border-blue-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none"
                          >
                            <span>{showAiAssistant 
                              ? (isHindi ? 'सहायक बंद करें' : 'Close AI Assistant') 
                              : (isHindi ? 'एआई प्रारूप सहायक' : 'Use AI Format Assistant')
                            }</span>
                          </button>
                        </div>

                        {/* Expandable AI Assistant Box */}
                        {showAiAssistant && (
                          <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 sm:p-5 space-y-4 mb-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-start gap-3">
                              <div>
                                <strong className="block text-xs font-bold text-[#0B1C3F]">
                                  {isHindi ? 'एआई आरटीआई प्रारूपक (AI RTI Formatter)' : 'AI RTI Application Formatter'}
                                </strong>
                                <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                                  {isHindi 
                                    ? 'अपनी पूछताछ साधारण शब्दों या कच्चे इनपुट में लिखें। एआई इसे एक औपचारिक सरकारी प्रारूप में बदल देगा।' 
                                    : 'Describe what you want to ask in simple, everyday words. The AI will convert it into a formal, legal RTI structure.'
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                {isHindi ? 'साधारण शब्दों में अपना अनुरोध लिखें' : 'Write your request in simple words / rough notes'}
                              </label>
                              <textarea
                                rows={3}
                                value={aiInput}
                                onChange={(e) => {
                                  setAiInput(e.target.value);
                                  if (validationError) setValidationError('');
                                }}
                                placeholder={isHindi 
                                  ? "उदा: मैं जानना चाहता हूँ कि मेरे वार्ड नंबर 12 की सड़क की मरम्मत क्यों रुकी हुई है, और इसके लिए कितना बजट जारी हुआ था।" 
                                  : "e.g., I want to check why the road work in Ward 12 is delayed, how much money was allocated for it, and who is the contractor."
                                }
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                              />
                            </div>

                            {/* Suggestion LLM Chips */}
                            {aiSuggestions.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>💡</span> {isHindi ? 'सुझाए गए आरटीआई विषय (कीवर्ड्स जोड़ने हेतु क्लिक करें):' : 'Suggested RTI Keywords (Click to add to your query):'}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {aiSuggestions.map((keyword, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setAiInput(prev => prev ? `${prev}, ${keyword}` : keyword);
                                        setValidationError('');
                                      }}
                                      className="bg-blue-50/80 hover:bg-blue-100/90 text-[#2563EB] border border-blue-200/80 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                                    >
                                      <span>+</span>
                                      <span>{keyword}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Verification LLM Non-Genuine Warning Alert */}
                            {validationError && (
                              <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 font-medium animate-in fade-in duration-200 shadow-2xs">
                                <span className="text-base shrink-0 mt-0.5">⚠️</span>
                                <div className="space-y-0.5">
                                  <strong className="font-bold text-amber-950 block text-xs">
                                    {isHindi ? 'अमान्य / गैर-वास्तविक कीवर्ड इनपुट' : 'Invalid / Non-Genuine Keyword Input Detected'}
                                  </strong>
                                  <p className="text-[11px] text-amber-800 leading-relaxed">{validationError}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-between items-center pt-1">
                              <span className="text-[10px] text-slate-400 font-semibold font-mono">
                                {aiInput.length} characters
                              </span>
                              <button
                                type="button"
                                onClick={handleAiFormat}
                                disabled={isFormatting || !aiInput.trim()}
                                className="bg-[#2563EB] hover:bg-[#1a4bba] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                {isFormatting ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                                    <span>{isHindi ? 'सत्यापन एवं प्रारूपण...' : 'Verifying & Formatting...'}</span>
                                  </>
                                ) : (
                                  <>
                                    <span>{isHindi ? 'सत्यापित करें एवं प्रारूप बनाएं' : 'Verify & Convert to Formal Format'}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Formatted Preview Box */}
                            {formattedPreview && (
                              <div className="space-y-3 pt-3 border-t border-slate-200">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                                    <span>✓</span> {isHindi ? 'सत्यापित आधिकारिक प्रारूप:' : 'Verified Formatted Application Draft:'}
                                  </span>
                                </div>

                                <pre className="w-full bg-white border border-slate-200 rounded-lg p-3 text-[11px] font-mono text-slate-800 overflow-x-auto max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                  {formattedPreview}
                                </pre>

                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFormattedPreview('')}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                                  >
                                    {isHindi ? 'साफ़ करें' : 'Clear Preview'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setValue('queryText', formattedPreview, { shouldValidate: true });
                                      setShowAiAssistant(false);
                                      setFormattedPreview('');
                                      setAiInput('');
                                    }}
                                    className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                                  >
                                    <span>{isHindi ? 'आवेदन में लागू करें' : 'Apply to Application'}</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <textarea
                          rows={7}
                          suppressHydrationWarning
                          {...register('queryText')}
                          placeholder={sr.rtiTextPlaceholder || "Clearly describe the specific information, public records, certified copies, or decision records requested under Section 6(1)..."}
                          className={`w-full bg-white border rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all ${
                            errors.queryText ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                          <span>{sr.maxChars || "Max 3000 characters"}</span>
                          <span className="font-mono">{queryTextValue.length} / 3000</span>
                        </div>
                        {errors.queryText && (
                          <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                            <span>⚠</span> {errors.queryText.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-slate-600 hover:text-slate-900 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                        >
                          ← Previous Step
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#0B1C3F] hover:bg-[#06152B] text-white px-8 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                        >
                          <span>{isSubmitting ? (sr.submittingBtn || "Submitting...") : "Submit Official RTI Request"}</span>
                          <ArrowRightIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
