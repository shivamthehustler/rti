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
      username: email.trim().split('@')[0] || 'citizen.rti',
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
    }, 1000);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-6 sm:p-9 shadow-xs">
      {isLoggedIn ? (
        /* Success State */
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {loginT.authSuccessTitle || (isHindi ? 'लॉगिन सफल!' : 'Authentication Successful!')}
          </h3>
          <p className="text-xs font-medium text-slate-600 mb-1">
            {isHindi ? `स्वागत है, ${loggedInUser}` : `Welcome back, ${loggedInUser}`}
          </p>
          <p className="text-xs text-slate-400 mb-6">
            {isHindi ? 'आपको RTI आवेदन पृष्ठ पर भेजा जा रहा है...' : 'Redirecting to RTI Application page...'}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href={redirectTarget}
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all text-center"
            >
              {isHindi ? 'RTI आवेदन जारी रखें →' : 'Continue to File RTI →'}
            </Link>
            <Link
              href="/"
              className="bg-[#0B1C3F] hover:bg-[#152e60] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all text-center"
            >
              {loginT.returnHomeBtn || (isHindi ? 'मुख्य पृष्ठ पर जाएं' : 'Return to Home')}
            </Link>
          </div>
        </div>
      ) : (
        /* CITIZEN LOGIN */
        <div>
          {/* Heading */}
          <div className="mb-5 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a56db] tracking-tight mb-1">
              {loginT.pageTitle || 'Citizen Login'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isHindi ? 'RTI आवेदन दर्ज करने के लिए लॉगिन करें' : 'Sign in to file statutory RTI applications'}
            </p>
          </div>



          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleCitizenSubmit} className="space-y-4" suppressHydrationWarning>
            {/* Email Row */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {loginT.enterEmail || (isHindi ? 'ईमेल आईडी' : 'Email Address')} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                suppressHydrationWarning
                className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 transition-all font-medium text-gray-800"
              />
            </div>

            {/* Password Row */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {loginT.enterPassword || (isHindi ? 'पासवर्ड' : 'Password')} *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  suppressHydrationWarning
                  className="w-full text-xs sm:text-sm px-3 py-2.5 pr-10 bg-slate-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 transition-all font-medium text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#153eb2] text-white py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer mt-2"
            >
              {loginT.submitBtn || 'Sign In'}
            </button>
          </form>

          {/* Additional Useful Portal Links */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center text-xs">
            <button
              type="button"
              onClick={() => {
                alert(isHindi ? 'पासवर्ड रीसेट करने के लिए कृपया अपने नोडल विभाग या हेल्पडेस्क (helprtionline-dopt@nic.in) से संपर्क करें।' : 'To reset your password, please contact the RTI Helpdesk at helprtionline-dopt@nic.in.');
              }}
              className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer font-medium"
            >
              {loginT.forgotPassword || 'Forgot Password?'}
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Login Policy Banner */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center bg-blue-50/50 p-3 rounded-xl border border-blue-100">
        <p className="text-xs font-semibold text-[#0B1C3F]">
          {loginT.guestModePrompt || 'RTI Access Policy'}
        </p>
        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
          {loginT.mandatoryLoginNotice || (isHindi ? 'नोट: आधिकारिक सुरक्षा दिशा-निर्देशों के तहत RTI आवेदन दर्ज करने के लिए नागरिक लॉगिन अनिवार्य है।' : 'Note: Citizen Login is mandatory to file an RTI application under official security guidelines.')}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { language, t } = useApp();
  const isHindi = language === 'hi';
  const loginT = t.login || {};

  return (
    <div className="w-full min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-12 font-sans relative overflow-hidden bg-[#FAFAFC]">
      {/* Background Dotted Wave */}
      <DottedWave />

      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        {/* Breadcrumb Trail */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2563EB] transition-colors shrink-0">
            {loginT.breadcrumbHome || (isHindi ? 'मुख्य पृष्ठ' : 'Home')}
          </Link>
          <span className="text-slate-300 shrink-0">&gt;</span>
          <span className="font-semibold text-slate-800 shrink-0">
            {loginT.breadcrumbLogin || (isHindi ? 'नागरिक लॉगिन' : 'Citizen Authentication')}
          </span>
        </div>

        {/* Header Hero Area with Generous Whitespace - Aligned across all portal pages */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1C3F] tracking-tight mb-4 leading-tight">
            {isHindi ? 'नागरिक पोर्टल प्रवेश' : 'Citizen Portal Authentication'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            {isHindi
              ? 'RTI आवेदन दर्ज करने, स्थिति देखने अथवा वैधानिक अनुरोधों के प्रबंधन हेतु पंजीकृत नागरिक क्रेडेंशियल से लॉगिन करें।'
              : 'Sign in to file statutory RTI applications, monitor application progress, and manage your official requests.'}
          </p>
        </div>

        {/* Main Citizen Login Card Container wrapped in Suspense */}
        <div className="max-w-md mx-auto pb-12 pt-1">
          <Suspense fallback={
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 sm:p-9 shadow-xs text-center text-xs text-slate-500">
              Loading form...
            </div>
          }>
            <LoginFormContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
