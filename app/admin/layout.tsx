import { DM_Serif_Display, Manrope } from "next/font/google";

const heading = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-heading" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`nm-theme ${heading.variable} ${body.variable}`}>{children}</div>;
}
