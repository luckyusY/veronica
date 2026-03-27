import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Jost } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const displaySerif = Cormorant_Garamond({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

const bodySans = Jost({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
      className={`${displaySerif.variable} ${greatVibes.variable} ${bodySans.variable} h-full antialiased`}
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
