export interface NavItem {
  label: string;
  href: string;
  index: string;
  isExternal?: boolean;
}

export const navItems: NavItem[] = [
  { label: "WORK", href: "#work", index: "01" },
  { label: "EXPERTISE", href: "#expertise", index: "02" },
  { label: "EXPERIENCE", href: "#experience", index: "03" },
  { label: "ABOUT", href: "#about", index: "04" },
  { label: "EXPERIMENTS", href: "#experiments", index: "05" },
  { label: "CONTACT", href: "#contact", index: "06" },
];
