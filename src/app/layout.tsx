import type { Metadata } from "next";
import { Bodoni_Moda, Great_Vibes, Manrope } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Veronica Adane | Official Website",
    template: "%s | Veronica Adane",
  },
  description:
    "Official digital platform for Veronica Adane featuring music, videos, events, merchandise, press, and brand collaborations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${greatVibes.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full paper-canvas">
        <Providers>
          <AppShell footer={<SiteFooter />} header={<SiteHeader />}>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
