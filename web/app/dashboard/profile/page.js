'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import ModernAvatar from '../../../components/ModernAvatar';
import { 
  UserCircle, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  CheckCircle2, 
  Key, 
  Smartphone,
  Calendar,
  Globe,
  Award,
  Sparkles,
  Camera,
  Check
} from 'lucide-react';

export default function ProfilePage() {
  const user = useAppStore((state) => state.user);
  const setAvatar = useAppStore((state) => state.setAvatar);
  const userName = user?.name || 'Shivam Gupta';
  const userEmail = user?.email || 'citizen.rti@gov.in';
  const userAvatar = user?.avatar || '/avatars/avatar-shivam.jpg';

  const [mobile, setMobile] = useState('+91 98765 43210');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('Flat 402, Shanti Heights, Shivajinagar, Pune - 411005');
  const [isSaved, setIsSaved] = useState(false);

  const avatarOptions = [
    {
      id: 'shivam',
      name: 'Shivam (Cyber Tech)',
      role: 'Tech Citizen Applicant',
      src: '/avatars/avatar-shivam.jpg',
      tag: 'Current Default',
      glow: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'ananya',
      name: 'Ananya (Civic Lead)',
      role: 'Legal & Public Advocate',
      src: '/avatars/avatar-ananya.jpg',
      tag: 'Civic Specialist',
      glow: 'from-indigo-600 to-purple-500'
    },
    {
      id: 'tech',
      name: 'Aryan (Modern Pro)',
      role: 'Corporate RTI Lead',
      src: '/avatars/avatar-tech.jpg',
      tag: 'Executive',
      glow: 'from-blue-700 to-indigo-600'
    }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full min-h-full bg-transparent relative overflow-hidden p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="relative z-10 space-y-6 max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-50 text-[#2563EB] rounded-2xl">
                <UserCircle className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                My Profile & Citizen Identity
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Authenticated citizen identity particulars for statutory RTI applications.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 px-4 py-2.5 rounded-2xl w-fit">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-green-800">DigiLocker Identity Verified</p>
              <p className="text-[11px] text-green-600 font-semibold">UIDAI Aadhaar Linked</p>
            </div>
          </div>
        </div>

        {/* 3D-Styled Citizen ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#071325] via-[#0B1C3F] to-[#1E3A8A] text-white p-6 sm:p-9 rounded-3xl shadow-xl relative overflow-hidden space-y-6"
        >
          {/* Background Emblem Accent */}
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-5 pointer-events-none flex items-center justify-center">
            <Award className="w-48 h-48 text-white" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-5">
              <ModernAvatar
                src={userAvatar}
                name={userName}
                size="lg"
                showBadge={true}
                status="verified"
                className="ring-4 ring-white/20 shadow-2xl"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{userName}</h2>
                <p className="text-xs sm:text-sm text-blue-200 font-medium">
                  Citizen ID: <span className="font-mono font-bold text-white">CITIZEN-IN-8921</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
              <span>Aadhaar: XXXX-XXXX-8921</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-white/15 text-xs sm:text-sm relative z-10">
            <div>
              <span className="text-blue-300 font-semibold block mb-0.5">Registered Email</span>
              <span className="font-bold text-white">{userEmail}</span>
            </div>
            <div>
              <span className="text-blue-300 font-semibold block mb-0.5">Mobile Contact</span>
              <span className="font-bold text-white">{mobile}</span>
            </div>
            <div>
              <span className="text-blue-300 font-semibold block mb-0.5">Domicile State</span>
              <span className="font-bold text-white">{state}</span>
            </div>
          </div>
        </motion.div>

        {/* 3D Modern Avatar Persona Selector */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-[#0B192C]">Modern 3D Citizen Avatar</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose your official high-fidelity 3D profile persona for statutory portal interactions.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full w-fit">
              DigiLocker Verified Graphic
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {avatarOptions.map((option) => {
              const isSelected = userAvatar === option.src;
              return (
                <div
                  key={option.id}
                  onClick={() => setAvatar && setAvatar(option.src)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer relative flex flex-col items-center text-center gap-3 group ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-lg shadow-blue-500/10'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <ModernAvatar
                    src={option.src}
                    name={option.name}
                    size="lg"
                    showBadge={true}
                    status="verified"
                    className="shadow-xl group-hover:scale-105 transition-transform"
                  />

                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {option.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">{option.role}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    }`}
                  >
                    {isSelected ? 'Active Persona' : 'Select Persona'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#0B192C]">Personal & Communication Details</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Used for official postal dispatch of certified records under Section 7(1).</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name (As per Aadhaar/DigiLocker)
                </label>
                <input
                  type="text"
                  disabled
                  value={userName}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-100 border border-slate-300 rounded-2xl text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={userEmail}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-100 border border-slate-300 rounded-2xl text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Contact Number *
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Union Territory *
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Postal Address for Speed Post Communication *
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-medium text-slate-900 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isSaved ? (
                <span className="text-sm font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Profile particulars updated successfully!</span>
                </span>
              ) : <span />}

              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Security & Sessions */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#0B192C]">Security & Audit Trail</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Government security compliant session monitoring.</p>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">Current Active Session</p>
                <p className="text-xs text-slate-500 font-medium">IP: 103.21.244.12 • Chrome on macOS • New Delhi</p>
              </div>
              <span className="text-green-700 bg-green-50 border border-green-200 font-bold px-3 py-1 rounded-full text-xs">
                Active Now
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">DigiLocker Integration</p>
                <p className="text-xs text-slate-500 font-medium">Consent granted for statutory citizen identity verification.</p>
              </div>
              <span className="text-blue-700 bg-blue-50 border border-blue-200 font-bold px-3 py-1 rounded-full text-xs">
                Linked & Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
