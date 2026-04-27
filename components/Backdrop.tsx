"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Backdrop({ dim = "soft" }: { dim?: "soft" | "heavy" }) {
  return (
    <div
      className="fixed overflow-hidden bg-black"
      style={{ zIndex: 0, top: 0, left: 0, width: "100vw", height: "100dvh" }}
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${BASE}/bg.jpg)`,
          backgroundPosition: "center 30%",
          filter: dim === "soft" ? "saturate(0.95)" : "blur(4px) saturate(0.75)",
          opacity: dim === "soft" ? 1 : 0.55,
          transform: "scale(1.02)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            dim === "heavy"
              ? "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {dim === "soft" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 75%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 95% 75% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        </>
      )}
    </div>
  );
}
