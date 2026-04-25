import Image from "next/image";
import clsx from "clsx";

const NATIVE_W = 396;
const NATIVE_H = 122;

export function Logo({ size = "hero" }: { size?: "hero" | "small" }) {
  const cls = size === "hero" ? "w-[min(78vw,460px)]" : "w-[160px]";
  const src = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.png`;

  return (
    <div className={clsx(cls, "drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]")}>
      <Image
        src={src}
        alt="הפרלמנט"
        width={NATIVE_W}
        height={NATIVE_H}
        priority
        className="w-full h-auto"
      />
    </div>
  );
}
