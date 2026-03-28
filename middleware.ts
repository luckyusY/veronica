import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessAdminPath, isAdminRole } from "@/lib/admin-access";
import { env } from "@/lib/env";

const ADMIN_LOGIN_PATH = "/admin/login";

function buildRedirectUrl(request: NextRequest, pathname: string, notice: string) {
  const redirectUrl = new URL(pathname, request.url);
  redirectUrl.searchParams.set("notice", notice);

  return redirectUrl;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: env.AUTH_SECRET,
  });

  if (pathname === ADMIN_LOGIN_PATH) {
    if (token?.email && isAdminRole(token.role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (!token?.email || !isAdminRole(token.role)) {
    const loginUrl = buildRedirectUrl(request, ADMIN_LOGIN_PATH, "auth-required");
    const callbackUrl = `${pathname}${search}`;
    loginUrl.searchParams.set("callbackUrl", callbackUrl || "/admin");

    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessAdminPath(token.role, pathname)) {
    return NextResponse.redirect(buildRedirectUrl(request, "/admin", "no-access"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
