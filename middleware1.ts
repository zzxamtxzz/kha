import { NextRequest, NextResponse } from "next/server";
import { decrypt, updateSession } from "./lib/session";

export default async function middleware(
  request: NextRequest & { session: any }
) {
  const url = request.nextUrl.clone();

  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }
  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // no need to login
  if (session && url.pathname === "/login") {
    url.pathname = "/home";
    const response = NextResponse.redirect(url);
    return await updateSession(request, response);
  }

  // login
  if (!session && url.pathname === "/api/auth" && request.method === "POST") {
    return NextResponse.next();
  }

  // please login
  if (!session && url.pathname !== "/login") {
    url.pathname = "/login";
    url.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next();

  //redirect to home
  if (session && url.pathname === "/") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  const themePreference = request.cookies.get("theme");
  if (!themePreference) response.cookies.set("theme", "dark");

  url.searchParams.set("pathname", request.nextUrl.pathname);
  response = NextResponse.rewrite(url);
  const searchParams = request.nextUrl.searchParams;
  response.headers.set("x-search", searchParams.toString());
  response.headers.set("x-pathname", request.nextUrl.pathname);

  return await updateSession(request, response);
}

export const config = {
  matcher: ["/api/:path*", "/:path*", "/login", "/"],
};
