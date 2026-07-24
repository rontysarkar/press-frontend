import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./service/refreshToken";
import { cookies } from "next/headers";

const publicRoute = ["/", "/news", "/login", "/register"]; // এখানে /register করা হয়েছে

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isLogin = false;
  let userRole = null;
  let verifyAccessToken = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET as string,
  );
  const verifyRefreshToken = jwtUtils.verifyToken(
    refreshToken as string,
    process.env.JWT_REFRESH_SECRET as string,
  );

  let newAccessTokenData = null;

  if (!verifyAccessToken.success && verifyRefreshToken.success) {
    const newAccessToken = await getNewAccessToken();
    if (newAccessToken.success) {
      newAccessTokenData = newAccessToken.data?.accessToken; 
      accessToken = newAccessTokenData;
      verifyAccessToken = jwtUtils.verifyToken(
        accessToken as string,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  if (verifyAccessToken.success) {
    isLogin = true;
    userRole = verifyAccessToken.data?.role;
  } else {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  }

  if (isLogin && (pathname === "/login" || pathname === "/register")) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL("/author-dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const isPublicRoute = publicRoute.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!isLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (
    pathname.startsWith("/author-dashboard") &&
    userRole !== "AUTHOR"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  const response = NextResponse.next();

  if (newAccessTokenData) {
    response.cookies.set({
      name: "accessToken",
      value: newAccessTokenData,
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};