'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HelpRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/help');
  }, [router]);

  return null;
}
