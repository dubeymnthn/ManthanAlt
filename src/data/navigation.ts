export interface NavItem {
  label: string;
  href: string;
  index: string;
  isExternal?: boolean;
  /** One-line teaser shown by the PREV / NEXT section pager. */
  summary?: string;
  /** Extra route prefixes that also mark this item active (e.g. case studies under /projects). */
  activeFor?: string[];
}

/** The homepage is page 01; every dedicated section page continues the sequence from it. */
export const homeNavItem: NavItem = {
  label: "INDEX",
  href: "/",
  index: "01",
  summary: "Introduction: portrait and the five featured products.",
};

export const navItems: NavItem[] = [
  {
    label: "WORK",
    href: "/work",
    index: "02",
    summary: "11 completed systems, from real-time voice to inventory SaaS.",
    activeFor: ["/projects"],
  },
  {
    label: "EXPERTISE",
    href: "/expertise",
    index: "03",
    summary: "An interactive 3D constellation of the stack I build with.",
  },
  {
    label: "EXPERIENCE",
    href: "/experience",
    index: "04",
    summary: "Backend, clinical and financial systems shipped to production.",
  },
  {
    label: "ABOUT",
    href: "/about",
    index: "05",
    summary: "Curious by nature. Engineer by profession.",
  },
  {
    label: "EXPERIMENTS",
    href: "/experiments",
    index: "06",
    summary: "Local LLMs, MCP tooling, generative audio and shaders.",
  },
  {
    label: "CONTACT",
    href: "/contact",
    index: "07",
    summary: "Have an interesting problem? Let's talk.",
  },
];

/** Every page in reading order: INDEX (01) followed by the section pages (02-07). */
export const pageSequence: NavItem[] = [homeNavItem, ...navItems];

export function getNavItem(href: string): NavItem | undefined {
  return pageSequence.find((item) => item.href === href);
}

/** "WORK" -> "Work", for document titles and headings. */
export function getNavTitle(item: NavItem): string {
  return item.label.charAt(0) + item.label.slice(1).toLowerCase();
}

function isWithinRoute(pathname: string, route: string): boolean {
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * How the current pathname relates to a nav item:
 * "page" for its own route, "section" for a route nested under it (or listed in activeFor),
 * null otherwise.
 */
export function getNavMatch(
  pathname: string | null | undefined,
  item: NavItem
): "page" | "section" | null {
  if (!pathname) return null;
  if (pathname === item.href) return "page";
  if (isWithinRoute(pathname, item.href)) return "section";
  if (item.activeFor?.some((route) => isWithinRoute(pathname, route))) return "section";
  return null;
}

/** Neighbouring pages in the 01-07 sequence; the homepage closes the loop at both ends. */
export function getAdjacentNavItems(href: string): { prev: NavItem; next: NavItem } {
  const total = pageSequence.length;
  const found = pageSequence.findIndex((item) => item.href === href);
  const current = found === -1 ? 0 : found;

  return {
    prev: pageSequence[(current - 1 + total) % total],
    next: pageSequence[(current + 1) % total],
  };
}
