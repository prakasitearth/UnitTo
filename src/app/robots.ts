import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unittogo.com";

/**
 * Next.js robots.txt generator.
 *
 * Rules:
 *  – Allow all public pages (incl. /privacy, /terms, /about).
 *  – Disallow Next.js build internals and any future API routes.
 *  – Point crawlers to the XML sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/_next/",   // Next.js build output – not useful for crawlers
          "/static/",  // Static asset dump (if ever used)
          "/api/",     // API routes (future-proof)
          "/*/widget/", // Block widget routes in any language (e.g. /en/widget/, /th/widget/)
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
