"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { SearchIcon, XIcon } from "./Icons";
import { useApp } from "../context/AppContext";

const emptySubscribe = () => () => {};

export default function AnimatedSearchBar({
  prompts: customPrompts,
  onSearch,
  className = "",
}) {
  const { t } = useApp();
  const prompts = customPrompts || t.searchBar.prompts;

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const timeoutRef = useRef(null);
  const displayTextSpanRef = useRef(null);
  const stateRef = useRef({
    promptIndex: 0,
    charIndex: 0,
    isDeleting: false
  });

  // Handle Typing & Backspacing animation loop with zero React re-render thrashing
  useEffect(() => {
    if (!isMounted) return;

    if (isFocused || query.trim() !== "") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const currentPrompts = prompts && prompts.length > 0 ? prompts : [""];

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      if (displayTextSpanRef.current) {
        displayTextSpanRef.current.textContent = currentPrompts[0] || "";
      }
      return;
    }

    const tick = () => {
      const state = stateRef.current;
      const currentPrompt = currentPrompts[state.promptIndex % currentPrompts.length] || "";

      if (!state.isDeleting) {
        if (state.charIndex < currentPrompt.length) {
          state.charIndex += 1;
          if (displayTextSpanRef.current) {
            displayTextSpanRef.current.textContent = currentPrompt.slice(0, state.charIndex);
          }
          timeoutRef.current = setTimeout(tick, 60);
        } else {
          timeoutRef.current = setTimeout(() => {
            state.isDeleting = true;
            tick();
          }, 2400);
        }
      } else {
        if (state.charIndex > 0) {
          state.charIndex -= 1;
          if (displayTextSpanRef.current) {
            displayTextSpanRef.current.textContent = currentPrompt.slice(0, state.charIndex);
          }
          timeoutRef.current = setTimeout(tick, 30);
        } else {
          state.isDeleting = false;
          state.promptIndex = (state.promptIndex + 1) % currentPrompts.length;
          timeoutRef.current = setTimeout(tick, 350);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, 200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isFocused, query, prompts, isMounted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  const showPlaceholderOverlay = isMounted && !isFocused && query.length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-3xl flex items-center h-[56px] sm:h-[60px] rounded-2xl border border-blue-300/80 bg-white p-1.5 mx-auto shadow-[0_4px_30px_-2px_rgba(29,104,242,0.26),0_0_18px_rgba(11,28,63,0.08)] hover:shadow-[0_6px_35px_-2px_rgba(29,104,242,0.34),0_0_24px_rgba(11,28,63,0.12)] hover:border-blue-400 focus-within:border-blue-600 focus-within:shadow-[0_8px_40px_-2px_rgba(29,104,242,0.4),0_0_28px_rgba(11,28,63,0.15)] focus-within:ring-4 focus-within:ring-blue-600/15 transition-all duration-300 relative group overflow-hidden ${className}`}
    >
      {/* Search Bar Body (White portion to the left of the search button) */}
      <div className="relative flex-1 h-full flex items-center min-w-0">
        {/* Real Input Element with Left Padding */}
        <input
          type="text"
          data-search-input="true"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Search public information or file an RTI"
          placeholder={showPlaceholderOverlay ? "" : (prompts[0] || t.searchBar.placeholder)}
          className="w-full h-full bg-transparent pl-6 sm:pl-7 pr-3 text-slate-800 placeholder:text-slate-400/80 text-base font-normal outline-none z-10 flex items-center leading-normal"
        />

        {/* Animated Typewriter Placeholder Overlay with Matching Left Padding */}
        <div
          className={`absolute inset-y-0 left-0 right-0 pl-6 sm:pl-7 pr-3 flex items-center pointer-events-none select-none z-0 transition-opacity duration-200 ${
            showPlaceholderOverlay ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <span
            ref={displayTextSpanRef}
            className="text-slate-400 text-base font-normal truncate max-w-full leading-normal"
          >
            {prompts[0] || ""}
          </span>
          <span className="inline-block w-[2px] h-[1.15em] bg-blue-600 align-middle ml-0.5 rounded-full animate-[pulse_1s_infinite]" />
        </div>

        {/* Clear Button when user types */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="z-20 p-1.5 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors shrink-0"
            title="Clear search"
            aria-label="Clear search query"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Blue Inset Search Button (Rounded Square Button inside container) */}
      <button
        type="submit"
        className="h-full aspect-square bg-[#1D68F2] hover:bg-[#1554C8] active:bg-[#1044A5] text-white rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-2xs ml-1"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5 text-white stroke-[2.2]" />
      </button>
    </form>
  );
}
