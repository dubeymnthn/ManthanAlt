export interface SocialLink {
  label: string;
  url: string;
  type: "github" | "linkedin" | "email" | "resume";
  username?: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    url: "https://github.com/dubeymnthn",
    type: "github",
    username: "@dubeymnthn",
    icon: "Github",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/dubeymnthn",
    type: "linkedin",
    username: "in/dubeymnthn",
    icon: "Linkedin",
  },
  {
    label: "Email",
    url: "mailto:manthan1181999@gmail.com",
    type: "email",
    username: "manthan1181999@gmail.com",
    icon: "Mail",
  },
  {
    label: "Resume",
    url: "/resume-manthan-dubey.pdf",
    type: "resume",
    username: "PDF / Verified Resume",
    icon: "FileText",
  },
];
