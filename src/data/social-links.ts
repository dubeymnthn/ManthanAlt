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
    url: "https://github.com/manthandubey",
    type: "github",
    username: "@manthandubey",
    icon: "Github",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/manthandubey",
    type: "linkedin",
    username: "manthandubey",
    icon: "Linkedin",
  },
  {
    label: "Email",
    url: "mailto:manthandubey18@gmail.com",
    type: "email",
    username: "manthandubey18@gmail.com",
    icon: "Mail",
  },
  {
    label: "Resume",
    url: "#resume",
    type: "resume",
    username: "PDF / Resume",
    icon: "FileText",
  },
];
