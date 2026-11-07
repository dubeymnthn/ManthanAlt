import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.scss";
import { personalData } from "@/data/personal";
import { SmoothScroll } from "@/components/shared/SmoothScroll";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${personalData.name} — ${personalData.role}`,
  description:
    "Engineering portfolio of Manthan Dubey — Software Engineer specializing in full-stack architecture, distributed systems, mobile engineering, and emerging AI technologies.",
  keywords: [
    "Manthan Dubey",
    "Software Engineer",
    "Full-Stack Developer",
    "Product Builder",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "Flutter",
    "Three.js",
    "Fastify",
    "PostgreSQL",
    "Gemini AI",
    "India",
  ],
  authors: [{ name: personalData.name, url: personalData.github }],
  creator: personalData.name,
  metadataBase: new URL("https://builtbymanthan.netlify.app"),
  openGraph: {
    title: `${personalData.name} — ${personalData.role}`,
    description: personalData.heroBio,
    url: "https://builtbymanthan.netlify.app",
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
    title: `${personalData.name} — ${personalData.role}`,
    description: personalData.heroBio,
    creator: "@dubeymnthn",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F8F3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalData.name,
    jobTitle: personalData.title,
    description: personalData.heroBio,
    url: "https://builtbymanthan.netlify.app",
    sameAs: [personalData.github, personalData.linkedin],
    knowsAbout: [
      "Software Engineering",
      "Full-Stack Architecture",
      "Node.js",
      "TypeScript",
      "Flutter",
      "Distributed Systems",
      "Fastify",
      "AI Orchestration",
      "Three.js",
    ],
  };

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <div className="technical-grid-bg" aria-hidden="true" />
          <div className="site-wrapper">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
