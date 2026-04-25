"use client";
import { useEffect, useState } from "react";

export function ChannelBug() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute top-5 left-5 z-20 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-phosphor/85">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-red shadow-[0_0_8px_var(--color-accent-red)]" />
      <span>LIVE</span>
      <span className="text-phosphor/30">·</span>
      <span suppressHydrationWarning>{time || "--:--"}</span>
    </div>
  );
}
