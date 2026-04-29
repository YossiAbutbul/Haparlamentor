"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { AboutModal } from "./AboutModal";

export function Footer() {
  const [open, setOpen] = useState(false);
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    if (!thanks) return;
    const id = setTimeout(() => setThanks(false), 3500);
    return () => clearTimeout(id);
  }, [thanks]);

  return (
    <>
      <AnimatePresence>
        {thanks && (
          <motion.div
            key="bmc-thanks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="no-text-shadow fixed bottom-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full border border-phosphor/30 bg-black/80 backdrop-blur-md text-phosphor text-sm font-display flex items-center gap-2 shadow-lg"
            role="status"
            dir="rtl"
          >
            <Coffee className="w-4 h-4" aria-hidden />
            <span>תודה רבה! ❤️</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer
        className="no-text-shadow fixed bottom-0 inset-x-0 z-20 border-t border-phosphor/10 bg-black/55 backdrop-blur-md px-6 py-3"
        dir="rtl"
      >
        <div className="grid grid-cols-3 items-center gap-4 text-[12px] text-phosphor/45 font-display">
          <p className="hidden sm:block justify-self-start">
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
          <span className="sm:hidden justify-self-start" aria-hidden />

          {/* TODO: replace # with https://www.buymeacoffee.com/<username> when BMC account is set up */}
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            onClick={() => setThanks(true)}
            className="justify-self-center flex items-center gap-1.5 text-phosphor/70 hover:text-phosphor underline-offset-2 hover:underline whitespace-nowrap cursor-pointer"
            aria-label="קנה לי קפה — תמיכה ביוצר"
          >
            <Coffee className="w-3.5 h-3.5" aria-hidden />
            <span>קנה לי קפה</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="justify-self-end text-phosphor/70 hover:text-phosphor underline-offset-2 hover:underline whitespace-nowrap cursor-pointer"
          >
            אודות והסרת תוכן
          </button>
        </div>
      </footer>
      <AboutModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
