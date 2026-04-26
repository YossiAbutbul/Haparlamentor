"use client";

import { useState } from "react";
import { AboutModal } from "./AboutModal";

export function Footer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <footer
        className="no-text-shadow fixed bottom-0 inset-x-0 z-20 border-t border-phosphor/10 bg-black/55 backdrop-blur-md px-6 py-3"
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-4 text-[12px] text-phosphor/45 font-display">
          <p className="hidden sm:block">
            התמלולים והתוכן המקורי שייכים ל
            <a
              href="https://www.mako.co.il/mako-vod-keshet/parliament"
              target="_blank"
              rel="noreferrer"
              className="text-phosphor/70 hover:text-phosphor underline-offset-2 hover:underline"
            >
              קשת 12 / מאקו
            </a>
            . האתר עושה שימוש הוגן לצורכי חיפוש וקישור בלבד.
          </p>
          <span className="sm:hidden" aria-hidden />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-phosphor/70 hover:text-phosphor underline-offset-2 hover:underline whitespace-nowrap cursor-pointer"
          >
            אודות והסרת תוכן
          </button>
        </div>
      </footer>
      <AboutModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
