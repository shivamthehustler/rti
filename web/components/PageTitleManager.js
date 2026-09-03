'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useApp } from '../context/AppContext';

const ROUTE_TITLES = {
  en: {
    '/': 'RTI Information Access Portal | Government of India',
    '/dashboard': 'Citizen Dashboard & Analytics | RTI Portal',
    '/dashboard/overview': 'Citizen Dashboard & Analytics | RTI Portal',
    '/dashboard/flash-rti': 'Flash RTI — Instant Public Information Search | RTI Portal',
    '/flash-rti': 'Flash RTI — Instant Public Information Search | RTI Portal',
    '/dashboard/file-rti': 'File an RTI Application — Section 6(1) | RTI Portal',
    '/submit-request': 'Online RTI Application Filing — Section 6(1) | RTI Portal',
    '/dashboard/my-requests': 'My RTI Applications & Statutory Records | RTI Portal',
    '/dashboard/track': 'Track Application Status | RTI Portal',
    '/view-status': 'Track Application Status | RTI Portal',
    '/dashboard/profile': 'My Profile & DigiLocker Verification | RTI Portal',
    '/dashboard/my-profile': 'My Profile & DigiLocker Verification | RTI Portal',
    '/profile': 'My Profile & DigiLocker Verification | RTI Portal',
    '/dashboard/notifications': 'Statutory Alerts & Notifications | RTI Portal',
    '/notifications': 'Statutory Alerts & Notifications | RTI Portal',
    '/dashboard/help': 'Citizen Help & Support Center | RTI Portal',
    '/dashboard/help-and-support': 'Citizen Help & Support Center | RTI Portal',
    '/help': 'Citizen Help & Support Center | RTI Portal',
    '/guide': 'Citizen RTI Guide & Statutory Procedures | RTI Portal',
    '/user-manual': 'Official Portal User Manual & Guidelines | RTI Portal',
    '/faqs': 'Frequently Asked Questions (FAQs) | RTI Portal',
    '/faq': 'Frequently Asked Questions (FAQs) | RTI Portal',
    '/contact': 'Contact Nodal Officers & Support Helpline | RTI Portal',
    '/contact-us': 'Contact Nodal Officers & Support Helpline | RTI Portal',
    '/first-appeal': 'File First Appeal — Section 19(1) | RTI Portal',
    '/login': 'Citizen & Officer Secure Sign In | RTI Portal',
    '/payment-reconciliation': 'Payment Reconciliation & Status | RTI Portal',
    '/get-information': 'Proactive Public Disclosures — Section 4 | RTI Portal',
    '/get-information/personalised': 'Proactive Public Disclosures — Section 4 | RTI Portal',
    '404': 'Page Not Found (404) | RTI Portal'
  },
  hi: {
    '/': 'सूचना का अधिकार पोर्टल | भारत सरकार',
    '/dashboard': 'नागरिक डैशबोर्ड एवं विश्लेषिकी | सूचना का अधिकार पोर्टल',
    '/dashboard/overview': 'नागरिक डैशबोर्ड एवं विश्लेषिकी | सूचना का अधिकार पोर्टल',
    '/dashboard/flash-rti': 'फ्लैश आरटीआई — त्वरित सार्वजनिक अभिलेख खोज | सूचना का अधिकार पोर्टल',
    '/flash-rti': 'फ्लैश आरटीआई — त्वरित सार्वजनिक अभिलेख खोज | सूचना का अधिकार पोर्टल',
    '/dashboard/file-rti': 'ऑनलाइन आरटीआई आवेदन दर्ज करें — धारा 6(1) | सूचना का अधिकार पोर्टल',
    '/submit-request': 'ऑनलाइन आरटीआई आवेदन दर्ज करें — धारा 6(1) | सूचना का अधिकार पोर्टल',
    '/dashboard/my-requests': 'मेरे आरटीआई आवेदन एवं इतिहास | सूचना का अधिकार पोर्टल',
    '/dashboard/track': 'आवेदन की स्थिति ट्रैक करें | सूचना का अधिकार पोर्टल',
    '/view-status': 'आवेदन की स्थिति ट्रैक करें | सूचना का अधिकार पोर्टल',
    '/dashboard/profile': 'मेरी प्रोफ़ाइल एवं डिजीलॉकर सत्यापन | सूचना का अधिकार पोर्टल',
    '/dashboard/my-profile': 'मेरी प्रोफ़ाइल एवं डिजीलॉकर सत्यापन | सूचना का अधिकार पोर्टल',
    '/profile': 'मेरी प्रोफ़ाइल एवं डिजीलॉकर सत्यापन | सूचना का अधिकार पोर्टल',
    '/dashboard/notifications': 'वैधानिक सूचनाएं एवं अलर्ट | सूचना का अधिकार पोर्टल',
    '/notifications': 'वैधानिक सूचनाएं एवं अलर्ट | सूचना का अधिकार पोर्टल',
    '/dashboard/help': 'नागरिक सहायता केंद्र | सूचना का अधिकार पोर्टल',
    '/dashboard/help-and-support': 'नागरिक सहायता केंद्र | सूचना का अधिकार पोर्टल',
    '/help': 'नागरिक सहायता केंद्र | सूचना का अधिकार पोर्टल',
    '/guide': 'नागरिक आरटीआई मार्गदर्शिका एवं प्रक्रिया | सूचना का अधिकार पोर्टल',
    '/user-manual': 'उपयोगकर्ता नियमावली एवं निर्देश | सूचना का अधिकार पोर्टल',
    '/faqs': 'सामान्य प्रश्न (FAQs) | सूचना का अधिकार पोर्टल',
    '/faq': 'सामान्य प्रश्न (FAQs) | सूचना का अधिकार पोर्टल',
    '/contact': 'नोडल अधिकारी संपर्क एवं हेल्पलाइन | सूचना का अधिकार पोर्टल',
    '/contact-us': 'नोडल अधिकारी संपर्क एवं हेल्पलाइन | सूचना का अधिकार पोर्टल',
    '/first-appeal': 'प्रथम अपील दर्ज करें — धारा 19(1) | सूचना का अधिकार पोर्टल',
    '/login': 'नागरिक एवं अधिकारी सुरक्षित लॉगिन | सूचना का अधिकार पोर्टल',
    '/payment-reconciliation': 'भुगतान समाधान एवं स्थिति | सूचना का अधिकार पोर्टल',
    '/get-information': 'स्वतः प्रकटीकरण एवं सरकारी रिकॉर्ड | सूचना का अधिकार पोर्टल',
    '/get-information/personalised': 'स्वतः प्रकटीकरण एवं सरकारी रिकॉर्ड | सूचना का अधिकार पोर्टल',
    '404': 'पृष्ठ नहीं मिला (404) | सूचना का अधिकार पोर्टल'
  }
};

function PageTitleUpdater() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useApp();
  const isHindi = language === 'hi';

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const langKey = isHindi ? 'hi' : 'en';
    const titles = ROUTE_TITLES[langKey] || ROUTE_TITLES.en;

    // Direct match
    let pageTitle = titles[pathname];

    // Check for dynamic query variations
    if (pathname === '/dashboard/track' || pathname === '/view-status') {
      const reg = searchParams.get('reg');
      if (reg) {
        pageTitle = isHindi 
          ? `ट्रैकिंग: ${reg} | सूचना का अधिकार पोर्टल` 
          : `Tracking: ${reg} | RTI Portal`;
      }
    } else if (pathname === '/dashboard/flash-rti' || pathname === '/flash-rti') {
      const q = searchParams.get('query') || searchParams.get('q');
      if (q) {
        const truncated = q.length > 28 ? `${q.slice(0, 28)}...` : q;
        pageTitle = isHindi
          ? `खोज: "${truncated}" | फ्लैश आरटीआई`
          : `Search: "${truncated}" | Flash RTI`;
      }
    }

    // Default fallback if no match found
    if (!pageTitle) {
      pageTitle = isHindi 
        ? 'सूचना का अधिकार पोर्टल | भारत सरकार' 
        : 'RTI Information Access Portal | Government of India';
    }

    document.title = pageTitle;
  }, [pathname, searchParams, isHindi]);

  return null;
}

export default function PageTitleManager() {
  return (
    <Suspense fallback={null}>
      <PageTitleUpdater />
    </Suspense>
  );
}
