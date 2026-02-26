// Portfolio data extracted from Ayush's portfolio
export const portfolioData = {
  name: "Ayush Lahiri",
  title: "CS Student & Full-Stack Developer",
  tagline: "#OpenToWork",
  about: {
    bio: "I'm a CS student at IIIT Kalyani, Kolkata. Focused on building robust, full-stack solutions. I specialize in Back-end Engineering with Ruby on Rails and Native Android Development using Java. Currently exploring Neural Networks, NLP & Transformers.",
    detail:
      'Beyond high-level frameworks, I have a strong foundation in Operating Systems and Computer Organization. This "under-the-hood" knowledge allows me to write optimized, hardware-aware code. I love bridging the gap between complex system architecture and seamless user experiences.',
  },
  skills: [
    { name: "HTML", color: "#e34c26" },
    { name: "CSS", color: "#264ce4" },
    { name: "JavaScript", color: "#f7de1e" },
    { name: "Ruby", color: "#cc0000" },
    { name: "Rails", color: "#d30000" },
    { name: "Java", color: "#f89720" },
    { name: "Android", color: "#3ddc84" },
    { name: "C", color: "#5b94ff" },
    { name: "Linux/OS", color: "#252525" },
    { name: "Full Stack", color: "#4a0404" },
    { name: "XML", color: "#005fac" },
  ],
  projects: [
    {
      name: "Course-Craft",
      description:
        "A specialized platform for educational management. Built for Microsoft ImagineCup (Semi-finalist).",
      tech: ["Rails", "Java", "Android"],
      link: "https://github.com/ayushL2007",
      featured: true,
    },
    {
      name: "Signetic",
      description:
        "Led team to Top 10 finish in InnovateX. An innovative solution for digital communication.",
      tech: ["Full Stack", "Ruby", "Rails"],
      link: "https://github.com/ayushL2007",
      featured: true,
    },
    {
      name: "Portfolio Website",
      description:
        "Personal portfolio built with Ruby on Rails featuring scroll animations and crystal-tile UI.",
      tech: ["Rails", "HTML", "CSS", "JavaScript"],
      link: "https://github.com/ayushL2007/Portfolio",
      featured: false,
    },
    {
      name: "Android Apps",
      description:
        "Native Android applications built with Java and XML for GDG IIITK sessions.",
      tech: ["Java", "Android", "XML"],
      link: "https://github.com/ayushL2007",
      featured: false,
    },
  ],
  experience: [
    {
      role: "App Dev Lead",
      org: "Google Developer Group IIITK",
      period: "Nov 2025 - Jan 2026",
      description:
        "Built scalable Native Android Apps and conducted intensive technical sessions for aspiring Android developers.",
    },
    {
      role: "Team Lead (ImagineCup Semi-finalist)",
      org: "IronLegions Team",
      period: "Dec 2025 - Jan 2026",
      description:
        "Led the team to the semi-finals of Microsoft ImagineCup by building Course-Craft.",
    },
    {
      role: "Team Lead (InnovateX Top 10)",
      org: "IronLegions Team",
      period: "Dec 2025 - Jan 2026",
      description:
        "Guided the team to a Top 10 finish in InnovateX, spearheading the development of Signetic.",
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      school: "IIIT Kalyani, Kolkata",
      period: "Aug 2025 - July 2029",
      details: [
        "Specializing in Systems Programming and Native Android Development",
        "Deep interest in OS internals",
        "Currently exploring NLP, Transformers and Neural Networks",
      ],
    },
    {
      degree: "Higher Secondary Education",
      school: "Mothers' Int'l Academy",
      period: "2023 - 2025",
      details: ["Graduated in PCM (Physics, Chemistry, Maths)"],
    },
    {
      degree: "High School",
      school: "Carmel School",
      period: "2014 - 2023",
      details: [
        "Graduated in ICSE board with 93.4%",
        "Excellent score in Maths & Computer Science",
      ],
    },
  ],
  contact: {
    github: "https://github.com/ayushL2007",
    email: "ayushlahiri2008@gmail.com",
    linkedin: "https://linkedin.com/in/ayush-lahiri",
  },
};

// Building definitions for the game world
export interface Building {
  id: string;
  label: string;
  section: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  roofColor: string;
  doorColor: string;
  signText: string;
}

export const buildings: Building[] = [
  {
    id: "about",
    label: "ABOUT ME",
    section: "about",
    x: 3,
    y: 3,
    width: 5,
    height: 4,
    color: "#5b6ee1",
    roofColor: "#3f3f74",
    doorColor: "#e8c170",
    signText: "PROF. OAK'S LAB",
  },
  {
    id: "projects",
    label: "PROJECTS",
    section: "projects",
    x: 11,
    y: 2,
    width: 6,
    height: 5,
    color: "#e83b3b",
    roofColor: "#8b0000",
    doorColor: "#e8c170",
    signText: "POKE MART",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    section: "experience",
    x: 3,
    y: 11,
    width: 5,
    height: 4,
    color: "#3ddc84",
    roofColor: "#1a6b3c",
    doorColor: "#e8c170",
    signText: "POKEMON GYM",
  },
  {
    id: "education",
    label: "EDUCATION",
    section: "education",
    x: 11,
    y: 10,
    width: 6,
    height: 5,
    color: "#f89720",
    roofColor: "#a05a00",
    doorColor: "#e8c170",
    signText: "TRAINER SCHOOL",
  },
  {
    id: "contact",
    label: "CONTACT",
    section: "contact",
    x: 7,
    y: 17,
    width: 5,
    height: 3,
    color: "#9b59b6",
    roofColor: "#5e2d79",
    doorColor: "#e8c170",
    signText: "POKEMON CENTER",
  },
];

// NPC definitions
export interface NPC {
  id: string;
  x: number;
  y: number;
  message: string;
  color: string;
}

export const npcs: NPC[] = [
  {
    id: "guide",
    x: 9,
    y: 8,
    message:
      "Welcome to AYUSH TOWN! Walk up to a building and press SPACE or ENTER to explore!",
    color: "#e83b3b",
  },
  {
    id: "coder",
    x: 15,
    y: 8,
    message:
      "Ayush loves Ruby on Rails and Native Android. Check out the POKE MART for his projects!",
    color: "#3ddc84",
  },
  {
    id: "student",
    x: 5,
    y: 8,
    message:
      "Did you know? Ayush is a B.Tech CS student at IIIT Kalyani! Visit the TRAINER SCHOOL!",
    color: "#5b6ee1",
  },
];
