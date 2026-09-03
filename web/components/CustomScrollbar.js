'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export default function CustomScrollbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const dragStartYRef = useRef(0);
  const dragStartScrollTopRef = useRef(0);
  const rafIdRef = useRef(null);

  // Directly update DOM position for 60-120fps performance without React render thrashing
  const syncThumbPosition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = window.innerHeight || 0;

    const totalScrollable = scrollHeight - clientHeight;

    if (totalScrollable <= 10 || window.innerWidth < 768) {
      if (trackRef.current) trackRef.current.style.display = 'none';
      return;
    }

    if (trackRef.current) trackRef.current.style.display = 'flex';

    // Calculate thumb height proportionally (minimum 36px)
    const calculatedHeight = Math.max(36, (clientHeight / scrollHeight) * clientHeight);
    const availableTrackHeight = clientHeight - calculatedHeight;
    const progress = Math.min(1, Math.max(0, scrollTop / totalScrollable));
    const thumbTop = progress * availableTrackHeight;

    if (thumbRef.current) {
      thumbRef.current.style.height = `${calculatedHeight}px`;
      thumbRef.current.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      syncThumbPosition();
    });

    setIsScrolling(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1200);
  }, [syncThumbPosition]);

  useEffect(() => {
    const onResize = () => {
      syncThumbPosition();
    };

    // Initial position sync on next frame after mount
    const initRaf = requestAnimationFrame(() => {
      syncThumbPosition();
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Observe DOM mutations to update scrollbar if page height changes dynamically
    const resizeObserver = new ResizeObserver(() => {
      syncThumbPosition();
    });
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(initRaf);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
    };
  }, [handleScroll, syncThumbPosition]);

  // Pointer drag support
  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartScrollTopRef.current = window.scrollY || document.documentElement.scrollTop;

    document.body.style.userSelect = 'none';

    const handlePointerMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const clientHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const totalScrollable = scrollHeight - clientHeight;
      const thumbHeight = thumbRef.current ? thumbRef.current.offsetHeight : 36;
      const availableTrackHeight = clientHeight - thumbHeight;

      if (availableTrackHeight <= 0) return;

      const scrollRatio = totalScrollable / availableTrackHeight;
      const newScrollTop = dragStartScrollTopRef.current + deltaY * scrollRatio;

      window.scrollTo({
        top: Math.min(totalScrollable, Math.max(0, newScrollTop)),
        behavior: 'instant',
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1200);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const showThumb = isScrolling || isHovered || isDragging;

  return (
    <div
      ref={trackRef}
      style={{ display: 'none' }}
      className="hidden md:flex fixed right-0 top-0 bottom-0 w-2 z-[99999] pointer-events-auto justify-end pr-0 transition-opacity duration-300 ease-out select-none cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={thumbRef}
        className={`rounded-full bg-slate-500/50 hover:bg-slate-700/80 active:bg-slate-900 w-2 cursor-default transition-[opacity,background-color] duration-200 ease-out ${
          showThumb ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${isHovered || isDragging ? 'bg-slate-700/80' : ''}`}
        style={{
          height: '36px',
          transform: 'translate3d(0, 0, 0)',
        }}
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}
