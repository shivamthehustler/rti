'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import DottedWave from '../../components/DottedWave';
import { useApp } from '../../context/AppContext';
import { useAppStore } from '../../store/useAppStore';
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

function LoginFormContent() {
  const { language, t } = useApp();
  const isHindi = language === 'hi';
  const loginT = t.login || {};

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard/flash-rti';
  const { loginUser } = useAppStore();

  // Form states - pre-filled by default for instant login
  const [email, setEmail] = useState('citizen.rti@gov.in');
  const [password, setPassword] = useState('RtiPortal@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auth Success state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // Submit Citizen Login form
  const handleCitizenSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage(loginT.errorEmptyEmail || (isHindi ? 'कृपया ईमेल आईडी दर्ज करें।' : 'Please enter your email address.'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(loginT.errorInvalidEmail || (isHindi ? 'कृपया एक वैध ईमेल आईडी दर्ज करें।' : 'Please enter a valid email address.'));
      return;
    }

    if (!password) {
      setErrorMessage(loginT.errorEmptyPassword || (isHindi ? 'कृपया पासवर्ड दर्ज करें।' : 'Please enter your password.'));
      return;
    }

    // Login successful
    const userObj = {
      username: email.trim().split('@')[0] || 'shivam.gupta',
      name: email.trim() === 'citizen.rti@gov.in' ? 'Shivam Gupta' : email.trim().split('@')[0],
      email: email.trim(),
      role: 'Citizen Applicant',
      state: 'Maharashtra',
      digilockerVerified: true,
      aadhaarMasked: 'XXXX-XXXX-8921'
    };
    loginUser(userObj);
    setLoggedInUser(userObj.name);
    setIsLoggedIn(true);

    // Auto redirect after short delay
    setTimeout(() => {
      router.push(redirectTarget);
    }, 600);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-6 sm:p-9 shadow-xs">
      {isLoggedIn ? (
        /* Success State */
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {loginT.successHeading || (isHindi ? 'सत्यापन सफल!' : 'Authentication Successful!')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            {loginT.successMessage || (isHindi ? 'स्वागत है, ' : 'Welcome, ')}
            <strong className="text-slate-800">{loggedInUser}</strong>
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-blue-600 font-medium animate-pulse">
            <span>{loginT.redirecting || (isHindi ? 'डैशबोर्ड पर निर्देशित किया जा रहा है...' : 'Redirecting to your RTI Dashboard...')}</span>
          </div>
        </div>
      ) : (
        /* Citizen Login Form */
        <form onSubmit={handleCitizenSubmit} className="space-y-4">
          <div className="text-left mb-5">
            <h2 className="text-base sm:text-lg font-bold text-[#0B192C]">
              {loginT.formTitle || (isHindi ? 'नागरिक लॉगिन' : 'Citizen Access Portal')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {loginT.formSubtitle || (isHindi ? 'अपने पंजीकृत ईमेल और पासवर्ड से साइन इन करें' : 'Sign in with your verified citizen credentials')}
            </p>
          </div>

          {/* Error message banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email / Username Field */}
          <div className="space-y-1 text-left">
            <label className="block text-xs font-semibold text-slate-700">
              {loginT.emailLabel || (isHindi ? 'पंजीकृत ईमेल आईडी / यूज़रनेम' : 'Registered Email Address')}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. citizen.rti@gov.in"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 font-medium transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                {loginT.passwordLabel || (isHindi ? 'पासवर्ड' : 'Password')}
              </label>
              <Link href="/contact" className="text-[11px] text-[#2563EB] hover:underline font-medium">
                {loginT.forgotPassword || (isHindi ? 'पासवर्ड भूल गए?' : 'Forgot password?')}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 font-medium transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* DigiLocker Auto-Verification Note */}
          <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 flex items-center justify-between">
            <span className="font-semibold">Demo Citizen Account:</span>
            <span className="font-mono text-blue-900 bg-blue-100/80 px-1.5 py-0.5 rounded text-[10px]">citizen.rti@gov.in</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            {loginT.submitBtn || (isHindi ? 'साइन इन करें' : 'Sign In to Dashboard')}
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { language, t } = useApp();
  const isHindi = language === 'hi';
  const loginT = t.login || {};

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 sm:px-6 overflow-hidden">
      <DottedWave />

      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
            {loginT.mainTitle || (isHindi ? 'आरटीआई पोर्टल में प्रवेश करें' : 'Sign in to RTI Portal')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {loginT.mainSubtitle || (isHindi ? 'अपने सभी आरटीआई आवेदनों और अपीलों को प्रबंधित करें' : 'Access statutory services, Flash RTI, and track your petitions')}
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading sign in form...</div>}>
          <LoginFormContent />
        </Suspense>

        <p className="text-xs text-slate-500">
          {loginT.needHelp || (isHindi ? 'सहायता चाहिए? ' : 'Need assistance? ')}
          <Link href="/faq" className="text-[#2563EB] hover:underline font-semibold">
            {loginT.viewFaq || (isHindi ? 'अक्सर पूछे जाने वाले प्रश्न देखें' : 'View RTI FAQs')}
          </Link>
        </p>
      </div>
    </div>
  );
}
