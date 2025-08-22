import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api/webhooks(.*)", "/api/interviews"],
  afterAuth(auth, req) {
    console.log(`[MIDDLEWARE] Processing ${req.url} at ${new Date().toISOString()}`);
    console.log("[MIDDLEWARE] Auth result:", {
      userId: auth.userId,
      sessionId: auth.sessionId,
      isPublicRoute: auth.isPublicRoute,
    });

    if (!auth.userId && !auth.isPublicRoute) {
      console.log("[MIDDLEWARE] Unauthenticated, redirecting to /sign-in");
      if (req.url.includes("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Please sign in" },
          { status: 401 }
        );
      }
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};