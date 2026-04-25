export function NoSignal({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center min-h-[40vh]">
      <div className="no-text-shadow bg-black/65 backdrop-blur-md px-8 py-10 border border-phosphor/15 max-w-lg w-full">
        <div className="inline-block bg-accent-red text-phosphor font-mono text-[10px] tracking-[0.25em] uppercase mb-4 px-2 py-0.5">
          אין שידור
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-phosphor mb-3">
          לא נמצאו תוצאות
        </h2>
        <p className="text-phosphor/60 leading-relaxed">
          המשפט{" "}
          <span className="bg-accent-red/90 text-phosphor px-1.5 py-0.5">
            {query}
          </span>{" "}
          לא הופיע באף פרק שנסרק. נסה ניסוח אחר או חתוך לחלק ממנו.
        </p>
      </div>
    </div>
  );
}
