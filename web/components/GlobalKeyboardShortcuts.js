'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function GlobalKeyboardShortcuts() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const routerRef = useRef(router);

  useEffect(() => {
    pathnameRef.current = pathname;
    routerRef.current = router;
  }, [pathname, router]);

  useEffect(() => {
    const handleCaptureKeyDown = (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;
      const isKeyO =
        (typeof e.key === 'string' && e.key.toLowerCase() === 'o') ||
        e.code === 'KeyO' ||
        e.keyCode === 79 ||
        e.which === 79;

      // ⌘ + Shift + O or Ctrl + Shift + O -> New Chat / Reset Search
      if (isMod && isShift && isKeyO) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') {
          e.stopImmediatePropagation();
        }

        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('flash_rti_force_new', '1');
          window.dispatchEvent(new CustomEvent('flash_rti_reset_search'));
        }

        const currentPath = pathnameRef.current;
        if (currentPath !== '/dashboard/flash-rti') {
          routerRef.current.push('/dashboard/flash-rti?new=' + Date.now());
        } else {
          routerRef.current.replace('/dashboard/flash-rti?new=' + Date.now());
        }

        // Reliably focus and select search input
        const triggerFocus = () => {
          const searchInput = document.querySelector('input[data-search-input="true"]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        };

        triggerFocus();
        setTimeout(triggerFocus, 50);
        setTimeout(triggerFocus, 150);
        setTimeout(triggerFocus, 300);
        return;
      }

      // ⌘K or Ctrl+K -> Focus Search
      const isKeyK =
        (typeof e.key === 'string' && e.key.toLowerCase() === 'k') ||
        e.code === 'KeyK' ||
        e.keyCode === 75 ||
        e.which === 75;

      if (isMod && !isShift && !e.altKey && isKeyK) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') {
          e.stopImmediatePropagation();
        }

        const currentPath = pathnameRef.current;
        if (currentPath !== '/dashboard/flash-rti' && currentPath !== '/dashboard') {
          routerRef.current.push('/dashboard/flash-rti');
        }

        const triggerFocus = () => {
          const searchInput = document.querySelector('input[data-search-input="true"]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          } else if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('flash_rti_focus_search'));
          }
        };

        triggerFocus();
        setTimeout(triggerFocus, 50);
        setTimeout(triggerFocus, 150);
        return;
      }
    };

    // Use capturing phase (true) so the browser Bookmark Manager or other handlers are intercepted first
    window.addEventListener('keydown', handleCaptureKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleCaptureKeyDown, true);
    };
  }, []);

  return null;
}
