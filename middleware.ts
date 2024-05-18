import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Middleware function to handle authentication and routing for the Next.js server.
 *
 * @param {NextRequest} request - The incoming request object.
 * @return {Promise<NextResponse>} The response object.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const bypassPaths = [
    "/api", // Exclude all API routes
  ];

  // Check if the current path is in the bypass list
  if (bypassPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Create a Supabase client
  const supabase = createClient();

  // Get the user data from the Supabase authentication API
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define the URLs for different routes
  const loginUrl = new URL("/login", request.url);
  const registerUrl = new URL("/register", request.url);
  const homeUrl = new URL("/", request.url);
  const adminUrl = new URL("/admin", request.url);

  // If the user is not logged in
  if (!user) {
    // If the request is not for login or register, redirect to login
    if (request.nextUrl.pathname !== "/login" && request.nextUrl.pathname !== "/register") {
      return NextResponse.rewrite(loginUrl);
    }
  } else {
    // Get the user profile from the Supabase database
    const { data: profile } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      // If the user is logged in and an admin, and the current path is /login or /register, redirect to /admin
      if (profile.is_admin) {
        if (!request.nextUrl.pathname.startsWith("/admin")) {
          return NextResponse.rewrite(adminUrl);
        }
      } else {
        // If the user is logged in and not an admin, redirect appropriately
        if (
          request.nextUrl.pathname === "/login" ||
          request.nextUrl.pathname === "/register" ||
          request.nextUrl.pathname === "/admin"
        ) {
          return NextResponse.rewrite(homeUrl);
        }
      }
    }
  }

  // If none of the conditions are met, proceed to the next middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
