export function NoSignal({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center min-h-[40vh]">
      <article
        className="no-text-shadow relative rounded-lg overflow-hidden max-w-lg w-full"
        style={{
          background: "rgba(28,42,48,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow:
            "inset 0 0 0 1px rgba(241,233,200,0.14), 0 12px 28px -16px rgba(0,0,0,0.6)",
        }}
      >
        <div className="px-6 md:px-9 py-6 md:py-7 text-phosphor text-right" dir="rtl">
          <header className="mb-5 flex items-baseline gap-3">
            <span
              className="font-mono text-[11px] tracking-[0.22em] uppercase tabular-nums"
              style={{ color: "var(--color-accent-red-bright)" }}
            >
              אין שידור
            </span>
            <span aria-hidden className="text-phosphor/25 select-none">⁄</span>
            <span className="font-display text-[15px] md:text-base font-semibold text-phosphor">
              לא נמצאו תוצאות
            </span>
          </header>

          <p className="font-display text-[22px] md:text-[26px] leading-[1.45] font-medium">
            המשפט{" "}
            <mark className="match">{query}</mark>{" "}
            לא הופיע באף פרק שנסרק.
          </p>

          <p className="mt-4 text-[15px] text-phosphor/45">
            נסה ניסוח אחר או חתוך לחלק ממנו.
          </p>
        </div>
      </article>
    </div>
  );
}
