import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// 1. Specify protected and public routes
const protectedRoutes = ["/", "/transactions"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const session = req ? req.cookies?.get("token") : null;

  const tokenExpired = session && isTokenExpired(session.value);

  // 4. Redirect to /login if the user is not authenticated
  if ((isProtectedRoute && !session) || tokenExpired) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && session && !tokenExpired) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

// Function to check if the token is expired
export const isTokenExpired = (token: string) => {
  if (!token) {
    return true; // No token, consider it expired
  }

  // Decode the token to get the payload
  const decoded = jwtDecode(token);

  // Check if the token has an `exp` claim
  if (!decoded.exp) {
    return true; // No expiration claim, consider it expired
  }

  // Get the current time in seconds (since `exp` is in seconds)
  const currentTime = Math.floor(Date.now() / 1000);

  // Return true if current time is greater than token expiration time
  return decoded.exp < currentTime;
};
