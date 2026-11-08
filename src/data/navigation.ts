export interface NavItem {
  label: string;
  href: string;
  index: string;
  isExternal?: boolean;
}

export const navItems: NavItem[] = [
  { label: "WORK", href: "/#work", index: "02" },
  { label: "EXPERTISE", href: "/#expertise", index: "03" },
  { label: "EXPERIENCE", href: "/#experience", index: "04" },
  { label: "ABOUT", href: "/#about", index: "05" },
  { label: "EXPERIMENTS", href: "/#experiments", index: "06" },
  { label: "CONTACT", href: "/#contact", index: "08" },
];
