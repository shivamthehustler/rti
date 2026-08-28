'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardBackgroundWave from '../../../components/DashboardBackgroundWave';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Landmark, 
  FileCheck 
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'CPIO Requisition Progress Updated',
    message: 'Central Board of Direct Taxes (CBDT) has initiated internal Section 5(4) records compilation for application RTI/2026/CBDT/89234.',
    regNo: 'RTI/2026/CBDT/89234',
    time: '2 hours ago',
    read: false,
    type: 'status',
    badge: 'In Progress',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'notif-2',
    title: 'Statutory Reply Document Dispatched',
    message: 'National Highways Authority of India (NHAI) has signed and dispatched the certified response regarding Mumbai-Goa NH-66 tender awards.',
    regNo: 'RTI/2026/MORTH/4421',
    time: 'Yesterday',
    read: false,
    type: 'reply',
    badge: 'Reply Ready',
    badgeColor: 'bg-green-100 text-green-800'
  },
  {
    id: 'notif-3',
    title: 'New Section 4(1)(b) Proactive Disclosure Published',
    message: 'Ministry of Road Transport and Highways published the audited capital outlay report on the Flash RTI repository.',
    time: '3 days ago',
    read: false,
    type: 'disclosure',
    badge: 'Public Record',
    badgeColor: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'notif-4',
    title: 'Fee Payment Reconciliation Verified',
    message: 'Statutory application fee of ₹10.00 for RTI/2026/CBDT/89234 successfully reconciled through Bharatkosh treasury.',
    regNo: 'RTI/2026/CBDT/89234',
    time: '5 days ago',
    read: true,
    type: 'payment',
    badge: 'Payment Verified',
    badgeColor: 'bg-slate-100 text-slate-700'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

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
                <Bell className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                Notifications & Official Alerts
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Real-time status updates, PIO communications, and proactive disclosure announcements.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer w-fit"
            >
              <Check className="w-4 h-4" />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification Cards */}
        <div className="space-y-3.5">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-3.5 bg-white/95 backdrop-blur-xs ${
                !item.read
                  ? 'border-blue-400 ring-2 ring-blue-500/10 shadow-sm'
                  : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    !item.read ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm sm:text-base font-bold ${!item.read ? 'text-[#0B192C]' : 'text-slate-700'}`}>
                        {item.title}
                      </h3>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
                      {item.message}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-400 shrink-0">
                  {item.time}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm">
                <div>
                  {item.regNo && (
                    <Link
                      href={`/dashboard/track?reg=${item.regNo}`}
                      className="text-[#2563EB] font-bold hover:underline flex items-center gap-1.5"
                    >
                      <span>Track Status ({item.regNo})</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleRead(item.id)}
                  className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  {item.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
