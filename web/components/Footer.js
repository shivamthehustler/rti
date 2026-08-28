'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { t } = useApp();
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="font-sans text-slate-300">
      {/* Main Footer Section */}
      <div className="bg-[#071325] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand & Mission Column (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="State Emblem of India" 
                  width={38} 
                  height={56} 
                  className="h-11 w-auto object-contain brightness-110 shrink-0" 
                />
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">{t.footer.portalTitle}</h2>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">{t.footer.govIndia}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                {t.footer.tagline}
              </p>

              {/* Minimal Monochromatic Social Media Links */}
              <div className="flex items-center gap-2 pt-1">
                <a 
                  href="#" 
                  aria-label="X" 
                  className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center text-xs font-semibold"
                >
                  𝕏
                </a>
                <a 
                  href="#" 
                  aria-label="Facebook" 
                  className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center text-xs font-bold"
                >
                  f
                </a>
                <a 
                  href="#" 
                  aria-label="LinkedIn" 
                  className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center text-xs font-bold"
                >
                  in
                </a>
                <a 
                  href="#" 
                  aria-label="Portal Info" 
                  className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center text-xs font-bold"
                >
                  @
                </a>
              </div>
            </div>

            {/* Quick Links Column (2.5 cols) */}
            <div className="md:col-span-2 flex flex-col gap-3.5">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{t.footer.quickLinks}</h3>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
                <li><Link href="/" className="hover:text-white transition-colors">{t.footer.links.home}</Link></li>
                <li><Link href="/submit-request" className="hover:text-white transition-colors">{t.footer.links.fileRTI}</Link></li>
                <li><Link href="/my-requests" className="hover:text-white transition-colors">{t.footer.links.myRequests}</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">{t.footer.links.help}</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition-colors">{t.footer.links.contactUs}</Link></li>
              </ul>
            </div>

            {/* Resources Column (2.5 cols) */}
            <div className="md:col-span-2 flex flex-col gap-3.5">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{t.footer.resources}</h3>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
                <li><Link href="/act" className="hover:text-white transition-colors">{t.footer.links.act}</Link></li>
                <li><Link href="/rules" className="hover:text-white transition-colors">{t.footer.links.rules}</Link></li>
                <li><Link href="/cic" className="hover:text-white transition-colors">{t.footer.links.cic}</Link></li>
                <li><Link href="/cpgrams" className="hover:text-white transition-colors">{t.footer.links.cpgrams}</Link></li>
                <li><Link href="/directory" className="hover:text-white transition-colors">{t.footer.links.directory}</Link></li>
              </ul>
            </div>

            {/* Contact Support Column (2.5 cols) */}
            <div className="md:col-span-3 flex flex-col gap-3.5">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{t.footer.contactSupport}</h3>
              <ul className="flex flex-col gap-3 text-xs text-slate-400">
                <li className="flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.footer.address}</span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{t.footer.phone}</span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${t.footer.email}`} className="hover:text-white transition-colors">{t.footer.email}</a>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{t.footer.hours}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Darker Bottom Bar Section */}
      <div className="bg-[#030914] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-xs text-slate-400 text-center md:text-left">
          
          <p className="text-center md:text-left">{t.footer.copyright}</p>

          <div className="flex flex-wrap items-center justify-center gap-y-1.5 gap-x-2 sm:gap-x-3 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-200 transition-colors whitespace-nowrap">{t.footer.links.privacy}</Link>
            <span className="text-slate-600 select-none">·</span>
            <Link href="/terms" className="hover:text-slate-200 transition-colors whitespace-nowrap">{t.footer.links.terms}</Link>
            <span className="text-slate-600 select-none">·</span>
            <Link href="/accessibility" className="hover:text-slate-200 transition-colors whitespace-nowrap">{t.footer.links.accessibility}</Link>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Image 
              src="/di.svg" 
              alt="Digital India" 
              width={100} 
              height={36} 
              className="h-5 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity" 
              unoptimized
            />
          </div>

        </div>
      </div>
    </footer>
  );
}
