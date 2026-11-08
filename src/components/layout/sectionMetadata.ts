import type { Metadata } from "next";
import { personalData } from "@/data/personal";
import { getNavItem, getNavTitle } from "@/data/navigation";

/**
 * Metadata for a dedicated section page ("/work" -> "Work — Manthan Dubey").
 *
 * Next.js replaces nested objects such as `openGraph` and `twitter` instead of merging them with the
 * root layout's, so the site-wide share settings are repeated here alongside the page-specific ones.
 * Relative URLs resolve against the root layout's `metadataBase`.
 */
export function createSectionMetadata(href: string, description: string): Metadata {
  const item = getNavItem(href);
  if (!item) {
    throw new Error(`createSectionMetadata: no navigation item is registered for "${href}"`);
  }

  const title = `${getNavTitle(item)} — ${personalData.name}`;

  return {
    title,
    description,
    alternates: {
      canonical: href,
    },
    openGraph: {
      title,
      description,
      url: href,
      siteName: `${personalData.name} Portfolio`,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-preview.png",
          width: 1200,
          height: 630,
          alt: `${personalData.name} — Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@dubeymnthn",
    },
  };
}
