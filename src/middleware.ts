import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "cms_session";

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

async function isValidShareToken(
  token: string | null,
  expectedSlug: string
): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload.kind === "share" && payload.slug === expectedSlug;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  // Existing session cookie? Allow.
  const sessionToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (await isValidSession(sessionToken)) {
    return NextResponse.next();
  }

  // Share-link token? Allow only for the matching preview slug.
  const pathname = req.nextUrl.pathname;
  const shareToken = req.nextUrl.searchParams.get("share");
  if (shareToken && pathname.startsWith("/preview/")) {
    const slug = pathname.split("/")[2] ?? "";
    if (await isValidShareToken(shareToken, slug)) {
      return NextResponse.next();
    }
  }

  // Otherwise redirect to login.
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/preview", "/preview/:path*"],
};
