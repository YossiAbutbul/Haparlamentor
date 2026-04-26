import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="no-text-shadow relative z-10 mt-12 border-t border-phosphor/10 px-6 py-5"
      dir="rtl"
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-4 text-[12px] text-phosphor/45 font-display">
        <p>
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
        <Link
          href="/about"
          className="text-phosphor/70 hover:text-phosphor underline-offset-2 hover:underline whitespace-nowrap"
        >
          אודות והסרת תוכן
        </Link>
      </div>
    </footer>
  );
}
