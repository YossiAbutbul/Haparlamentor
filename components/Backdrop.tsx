"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Backdrop({ dim = "soft" }: { dim?: "soft" | "heavy" }) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black" style={{ zIndex: 0 }} aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BASE}/bg.jpg)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            dim === "heavy"
              ? "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.78) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
