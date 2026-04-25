export function LowerThird({ caption }: { caption: string }) {
  return (
    <div className="pointer-events-none absolute bottom-6 right-6 left-6 z-20 flex items-center justify-center">
      <div className="flex items-center gap-3 bg-black/55 backdrop-blur-sm border border-phosphor/15 px-4 py-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-red animate-pulse" />
        <span className="font-mono text-[11px] tracking-[0.25em] text-phosphor/70">
          {caption}
        </span>
      </div>
    </div>
  );
}
