"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function FlashRTI() {
  const user = useAppStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard/flash-rti');
    } else {
      router.replace('/login?redirect=/dashboard/flash-rti');
    }
  }, [user, router]);

  return (
    <div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-medium text-slate-500">Redirecting to Flash RTI...</span>
      </div>
    </div>
  );
}
