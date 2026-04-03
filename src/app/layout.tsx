import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Jost } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCmsSiteSettings } from "@/lib/cms-store";
import "./globals.css";

const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
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
  variable: "--font-body-sans",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getCmsSiteSettings();

  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${greatVibes.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="min-h-full paper-canvas">
        <Providers>
          <AppShell
            footer={<SiteFooter settings={siteSettings.footer} />}
            header={<SiteHeader settings={siteSettings.header} />}
          >
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
