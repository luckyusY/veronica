"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const noticeMessages: Record<string, string> = {
  "auth-required": "Please sign in to continue.",
  "no-access": "You don't have access to that workspace.",
  "signed-out": "Signed out successfully.",
};

export function AdminRouteNotice() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const consumedNotice = useRef<string | null>(null);
  const notice = searchParams.get("notice");

  useEffect(() => {
    if (!notice || consumedNotice.current === `${pathname}:${notice}`) {
      return;
    }

    const message = noticeMessages[notice];

    if (message) {
      toast(message);
    }

    consumedNotice.current = `${pathname}:${notice}`;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("notice");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [notice, pathname, router, searchParams]);

  return null;
}
