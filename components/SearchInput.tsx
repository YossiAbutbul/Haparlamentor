"use client";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  size = "hero",
  autoFocus = true,
}: {
  value: string;
  onChange: (v: string) => void;
  size?: "hero" | "compact";
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <label className="relative block w-full">
      <span className="sr-only">חיפוש משפט</span>
      <div
        className={clsx(
          "no-text-shadow flex items-center bg-black/55 backdrop-blur-md border border-phosphor/15 focus-within:border-phosphor focus-within:bg-black/70 transition-colors",
          size === "hero" ? "px-5 py-3 md:px-6 md:py-4 rounded-sm" : "px-4 py-2.5",
        )}
      >
        <svg
          className={clsx(
            "shrink-0 text-phosphor/55 ml-3",
            size === "hero" ? "h-5 w-5" : "h-4 w-4",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          ref={ref}
          dir="rtl"
          lang="he"
          type="text"
          inputMode="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="הקלד משפט מתוך הפרק…"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{ unicodeBidi: "plaintext", caretColor: "var(--color-phosphor)" }}
          className={clsx(
            "block w-full bg-transparent text-phosphor placeholder:text-phosphor/35 outline-none text-right",
            "font-display font-medium tracking-tight",
            size === "hero" ? "text-2xl md:text-4xl" : "text-base md:text-xl",
          )}
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              ref.current?.focus();
            }}
            aria-label="נקה חיפוש"
            className={clsx(
              "shrink-0 mr-2 cursor-pointer rounded-md p-1 text-phosphor/55 hover:text-phosphor hover:bg-phosphor/10 transition-colors",
              size === "hero" ? "" : "p-0.5",
            )}
          >
            <X
              className={clsx(size === "hero" ? "h-5 w-5" : "h-4 w-4")}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        )}
      </div>
    </label>
  );
}
