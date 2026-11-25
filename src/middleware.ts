import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Malicious scanning signatures and attack patterns to drop at the Edge
const ATTACK_SIGNATURES = [
  // Directory traversal
  /\.\./,
  /%2e%2e/i,
  // Sensitive configuration probing
  /\/\.env/i,
  /\/\.git/i,
  /\/\.svn/i,
  /\/\.aws/i,
  /\/\.config/i,
  // CMS & legacy PHP probe targets
  /\.php/i,
  /\.asp/i,
  /\.jsp/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/wp-includes/i,
  /\/phpmyadmin/i,
  /\/cgi-bin/i,
  /\/xmlrpc/i,
  /\/actuator/i,
  // XSS and SQL injection patterns
  /<script/i,
  /%3cscript/i,
  /javascript:/i,
  /union\s+select/i,
  /information_schema/i,
  /base64_decode/i,
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullPath = pathname + search;

  // 1. Threat & Vulnerability Scanner Block
  for (const pattern of ATTACK_SIGNATURES) {
    if (pattern.test(fullPath)) {
      console.warn(`[SECURITY BLOCK] Rejected malicious probe: ${pathname} from IP: ${request.headers.get("x-forwarded-for") || "unknown"}`);
      return new NextResponse(
        JSON.stringify({ 
          error: "Forbidden", 
          message: "Request blocked by Digital Dictionary Edge Threat Shield." 
        }),
        { 
          status: 403, 
          headers: { 
            "Content-Type": "application/json",
            "X-Robots-Tag": "noindex, nofollow, noarchive" 
          } 
        }
      );
    }
  }

  // 2. Clone response and inject Edge Security & Speed Headers
  const response = NextResponse.next();

  // Edge Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()"
  );

  // Cross-Origin Isolations
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Prevent Information Disclosure
  response.headers.delete("x-powered-by");

  // Performance: Enable DNS prefetching for client navigation speed
  response.headers.set("X-DNS-Prefetch-Control", "on");

  return response;
}

// Optimized matcher to exclude static assets, avoiding unnecessary middleware cycles
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Static asset files (.svg, .png, .jpg, .jpeg, .gif, .webp, .avif, .woff, .woff2, .ttf)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf)$).*)",
  ],
};
