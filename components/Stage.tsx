import { Backdrop } from "./Backdrop";

export function Stage({
  children,
  dim = "soft",
}: {
  children: React.ReactNode;
  dim?: "soft" | "heavy";
}) {
  return (
    <div className="relative min-h-screen w-full">
      <Backdrop dim={dim} />
      <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>{children}</div>
    </div>
  );
}
