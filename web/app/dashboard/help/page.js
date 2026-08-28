'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardBackgroundWave from '../../../components/DashboardBackgroundWave';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ChevronDown, 
  Send,
  Scale
} from 'lucide-react';

const FAQS = [
  {
    q: 'What is the statutory timeline for receiving RTI replies?',
    a: 'Under Section 7(1) of the RTI Act 2005, the Public Information Officer (PIO) is mandated to provide information within 30 days of receiving the application. In cases concerning life and liberty, the timeline is strictly 48 hours.'
  },
  {
    q: 'What is the difference between Flash RTI and filing a statutory RTI application?',
    a: 'Flash RTI searches pre-published government gazettes and Section 4(1)(b) proactive disclosures instantly using AI without any waiting period. Filing a statutory RTI is used when seeking internal, unaudited, or specific administrative files directly from the CPIO.'
  },
  {
    q: 'What can I do if the PIO does not reply within 30 days or rejects my request?',
    a: 'You have the legal right to file a First Appeal under Section 19(1) of the RTI Act to the First Appellate Authority (FAA) within 30 days of the deadline expiry without any additional fee.'
  },
  {
    q: 'Are BPL (Below Poverty Line) citizens required to pay the ₹10 fee?',
    a: 'No. Under the RTI Rules, applicants holding a valid BPL ration card/certificate are fully exempted from paying application fees and copying charges.'
  }
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setIsSent(false);
    }, 3000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-white rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden p-6 sm:p-8 lg:p-10 space-y-6">
      {/* Consistent Dotted Wave Background from Landing Page */}
      <DashboardBackgroundWave />

      <div className="relative z-10 space-y-6 max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-50 text-[#2563EB] rounded-2xl">
                <HelpCircle className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                Help & Citizen Support
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Guidance, statutory FAQ directory, and central RTI nodal officer assistance.
            </p>
          </div>
        </div>

        {/* 3 Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/95 backdrop-blur-xs p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">National RTI Helpline</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">Toll-Free: 1800-11-7840</p>
            <p className="text-xs text-slate-400 font-medium">9:30 AM - 5:30 PM (Mon-Fri)</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xs p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">DoPT Helpdesk Email</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">helprtionline-dopt@nic.in</p>
            <p className="text-xs text-slate-400 font-medium">Response within 24 business hours</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xs p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Central Information Commission</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">CIC Bhawan, Baba Gangnath Marg</p>
            <p className="text-xs text-slate-400 font-medium">Munirka, New Delhi - 110067</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B192C]">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Legal clarifications and citizen rights under RTI Act 2005.</p>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-800">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>

                {openFaq === i && (
                  <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Support Query Form */}
        <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B192C]">Submit a Citizen Support Request</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Direct technical and portal assistance ticket.</p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Subject *
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Query regarding CPIO assignment for RTI/2026/CBDT/89234"
                className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:bg-white focus:border-[#2563EB] font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Query Details *
              </label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Please provide specifics of the issue you are encountering..."
                className="w-full text-sm sm:text-base px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:bg-white focus:border-[#2563EB] font-medium text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSent ? (
                <span className="text-sm font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Ticket #RTI-TKT-8921 created! We will reply via email within 24h.</span>
                </span>
              ) : <span />}

              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
