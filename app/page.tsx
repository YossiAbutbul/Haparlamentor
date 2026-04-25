"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Stage } from "@/components/Stage";
import { ChannelBug } from "@/components/ChannelBug";
import { LowerThird } from "@/components/LowerThird";
import { Logo } from "@/components/Logo";
import { SearchInput } from "@/components/SearchInput";
import { ResultsList } from "@/components/ResultsList";
import { NoSignal } from "@/components/NoSignal";

import { search } from "@/lib/search";
import type { Episode } from "@/lib/types";
import episodesJson from "@/public/mock/transcripts.json";

const EPISODES = episodesJson as Episode[];

export default function Home() {
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();

  const hits = useMemo(() => search(query, EPISODES), [query]);
  const mode: "idle" | "results" | "empty" =
    query.trim().length < 2 ? "idle" : hits.length > 0 ? "results" : "empty";

  const fadeSlide = reduce
    ? { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const },
      };

  return (
    <Stage dim={mode === "idle" ? "soft" : "heavy"}>
      <ChannelBug />

      <motion.header
        layout={!reduce}
        transition={{ layout: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } }}
        className={
          mode === "idle"
            ? "relative flex flex-col items-center justify-center px-6 pt-24 md:pt-32 gap-10 isolate"
            : "sticky top-0 z-20 border-b border-phosphor/10 bg-black/55 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 flex items-center gap-4 md:gap-6"
        }
      >
        {mode === "idle" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex: -1,
              background:
                "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
        )}
        {mode === "idle" ? (
          <Logo size="hero" />
        ) : (
          <button
            onClick={() => setQuery("")}
            className="shrink-0 hover:opacity-80 transition-opacity"
            aria-label="חזור למסך הראשי"
          >
            <Logo size="small" />
          </button>
        )}

        <motion.div
          layout={!reduce}
          transition={{ layout: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } }}
          className={mode === "idle" ? "w-full max-w-2xl" : "flex-1"}
        >
          <SearchInput
            value={query}
            onChange={setQuery}
            size={mode === "idle" ? "hero" : "compact"}
            autoFocus
          />
        </motion.div>

        {mode === "idle" && (
          <p className="no-text-shadow inline-block bg-black/60 backdrop-blur-sm border border-phosphor/15 px-4 py-2 font-mono text-[13px] tracking-[0.22em] text-phosphor text-center">
            הקלד משפט · המערכת תמצא את הפרק והדקה
          </p>
        )}
      </motion.header>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait" initial={false}>
          {mode === "results" && (
            <motion.section
              key="results"
              {...fadeSlide}
              className="px-3 md:px-8 py-8 md:py-10 max-w-5xl mx-auto"
            >
              <ResultsList hits={hits} query={query} />
            </motion.section>
          )}

          {mode === "empty" && (
            <motion.section key="empty" {...fadeSlide} className="px-3 md:px-8 py-8">
              <NoSignal query={query} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {mode === "idle" && <LowerThird caption="חיפוש משפטים מתוך כל פרקי הסדרה" />}
    </Stage>
  );
}
