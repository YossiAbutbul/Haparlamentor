"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function AboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 py-16 bg-black/55 backdrop-blur-sm"
      dir="rtl"
      onClick={onClose}
      role="presentation"
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
        className="no-text-shadow relative w-full max-w-2xl rounded-lg overflow-hidden"
        style={{
          background: "rgba(28,42,48,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow:
            "inset 0 0 0 1px rgba(241,233,200,0.14), 0 12px 28px -16px rgba(0,0,0,0.6)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="סגור"
          className="absolute top-3 left-3 cursor-pointer rounded-md p-1.5 text-phosphor/55 hover:text-phosphor hover:bg-phosphor/10 transition-colors"
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>

        <div className="px-6 md:px-9 py-7 md:py-9 text-phosphor space-y-6">
          <header className="pb-4 border-b border-phosphor/10">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-phosphor/60">
              אודות
            </span>
            <h1
              id="about-title"
              className="mt-2 font-display text-[26px] md:text-[30px] font-semibold"
            >
              הפרלמנטור
            </h1>
            <p className="mt-3 sm:hidden font-display text-[12px] leading-[1.6] text-phosphor/55">
              התמלולים והתוכן המקורי שייכים ל
              <a
                href="https://www.mako.co.il/mako-vod-keshet/parliament"
                target="_blank"
                rel="noreferrer"
                className="text-phosphor/80 hover:text-phosphor underline-offset-2 hover:underline"
              >
                קשת 12 / מאקו
              </a>
              . האתר עושה שימוש הוגן לצורכי חיפוש וקישור בלבד.
            </p>
          </header>

          <section className="space-y-3 font-display text-[17px] leading-[1.7] text-phosphor/85">
            <p>
              כלי חיפוש לא רשמי שנבנה על ידי מעריצי הסדרה
              <span> </span>
              <strong>הפרלמנט</strong>. מאפשר לחפש משפט מתוך הקליפים הקצרים
              ולקפוץ ישר לקטע הרלוונטי במאקו.
            </p>
            <p>
              האתר אינו משדר, מארח או מוריד וידאו. כל הקליפים נפתחים באתר
              המקור של מאקו ומתנגנים שם.
            </p>
          </section>

          <section className="space-y-3 font-display text-[15px] leading-[1.7] text-phosphor/65">
            <h2 className="font-display text-[17px] font-semibold text-phosphor">
              זכויות יוצרים
            </h2>
            <p>
              כל הזכויות על הסדרה <em>הפרלמנט</em>, על התסריט, ההפקה והשידור
              שמורות ל
              <a
                href="https://www.mako.co.il/mako-vod-keshet/parliament"
                target="_blank"
                rel="noreferrer"
                className="text-phosphor hover:opacity-80 underline-offset-2 hover:underline"
              >
                קשת 12 / מאקו
              </a>
              . התמלולים נוצרו אוטומטית באמצעות מערכת זיהוי דיבור ומיועדים
              לאינדוקס וחיפוש בלבד תחת דוקטרינת השימוש ההוגן.
            </p>
          </section>

          <section className="space-y-3 font-display text-[15px] leading-[1.7] text-phosphor/65">
            <h2 className="font-display text-[17px] font-semibold text-phosphor">
              הסרת תוכן
            </h2>
            <p>
              בעלי זכויות שמעוניינים בהסרה של תוכן ספציפי או של האתר כולו
              מוזמנים לפתוח issue בריפו של הפרויקט. הבקשה תטופל מיידית.
            </p>
            <p>
              <a
                href="https://github.com/YossiAbutbul/Haparlamentor/issues"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80 underline-offset-2 hover:underline"
                style={{ color: "var(--color-accent-red-bright)" }}
              >
                פתיחת issue ב-GitHub ↗
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
