'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, Check, X, Share2, PlusSquare, ArrowUpRight, Sparkles } from 'lucide-react';

export default function InstallAppModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsInstalled(isStandalone);

      // Detect iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);

      // Listen for browser install prompt
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setIsOpen(false);
      };

      const handleOpenInstall = () => {
        setIsOpen(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      window.addEventListener('rti_open_install_app', handleOpenInstall);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('rti_open_install_app', handleOpenInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 text-slate-900 space-y-5 overflow-hidden"
          >
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -z-0 pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="App Logo"
                  width={38}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    Install RTI Portal App
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Fast, standalone citizen access
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Features preview */}
            <div className="space-y-2 relative z-10 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-latency offline-ready dashboard</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Flash RTI AI search with 1-tap reload</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full screen experience without browser address bars</span>
              </div>
            </div>

            {/* Instructions based on platform */}
            <div className="space-y-3 relative z-10">
              {isInstalled ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>RTI Portal is already installed on your device!</span>
                </div>
              ) : deferredPrompt ? (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install RTI Portal App Now</span>
                </button>
              ) : isIOS ? (
                <div className="space-y-2.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 text-xs text-slate-800">
                  <p className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>How to Install on iPhone / iPad:</span>
                  </p>
                  <ol className="space-y-1.5 text-slate-700 list-decimal list-inside font-medium leading-relaxed">
                    <li>Tap the <span className="font-bold text-blue-700">Share button (⎋)</span> in Safari's bottom toolbar.</li>
                    <li>Scroll down and select <span className="font-bold text-blue-700">Add to Home Screen (⊞)</span>.</li>
                    <li>Tap <span className="font-bold text-blue-700">Add</span> in the top right corner.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">Install via Browser Menu:</p>
                  <p className="leading-relaxed">
                    Tap your browser's menu (⋮ or ⋯) and select <span className="font-bold text-blue-700">"Install app"</span> or <span className="font-bold text-blue-700">"Add to Home Screen"</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>PWA Certified</span>
              </span>
              <span>Govt. of India Certified</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
