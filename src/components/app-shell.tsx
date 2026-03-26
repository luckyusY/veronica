"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

type AppShellProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
};

export function AppShell({ children, header, footer }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      <NextTopLoader
        color="#F2D28B"
        crawlSpeed={180}
        height={2}
        initialPosition={0.12}
        shadow="0 0 12px rgba(242, 210, 139, 0.85), 0 0 24px rgba(217, 79, 43, 0.28)"
        showSpinner={false}
      />

      {isAdminRoute ? (
        <div className="min-h-screen">{children}</div>
      ) : (
        <div className="flex min-h-screen flex-col">
          {header}
          <div className="flex-1">{children}</div>
          {footer}
        </div>
      )}
    </>
  );
}
