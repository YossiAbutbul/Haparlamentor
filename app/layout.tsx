import type { Metadata } from "next";
import { Heebo, Assistant, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "הפרלמנט — חיפוש משפטים",
  description: "חיפוש משפטים מתוך הסדרה הפרלמנט — מצא את הפרק והדקה.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${assistant.variable} ${mono.variable}`}>
      <body>
        <div className="scroll-root">{children}</div>
      </body>
    </html>
  );
}
