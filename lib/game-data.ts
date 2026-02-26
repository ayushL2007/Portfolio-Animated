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
    x: 12,
    y: 2,
    width: 6,
    height: 5,
    color: "#e83b3b",
    roofColor: "#8b0000",
    doorColor: "#e8c170",
    signText: "POKE MART",
  },
  {
    id: "skills",
    label: "SKILLS",
    section: "skills",
    x: 22,
    y: 3,
    width: 5,
    height: 4,
    color: "#f7de1e",
    roofColor: "#b8a010",
    doorColor: "#e8c170",
    signText: "SKILLS DOJO",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    section: "experience",
    x: 3,
    y: 12,
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
    x: 12,
    y: 11,
    width: 6,
    height: 5,
    color: "#f89720",
    roofColor: "#a05a00",
    doorColor: "#e8c170",
    signText: "TRAINER SCHOOL",
  },
  {
    id: "links",
    label: "LINKS",
    section: "links",
    x: 22,
    y: 12,
    width: 5,
    height: 4,
    color: "#5bc4e8",
    roofColor: "#2a7a99",
    doorColor: "#e8c170",
    signText: "POKE LIBRARY",
  },
  {
    id: "contact",
    label: "CONTACT",
    section: "contact",
    x: 12,
    y: 20,
    width: 6,
    height: 4,
    color: "#9b59b6",
    roofColor: "#5e2d79",
    doorColor: "#e8c170",
    signText: "POKEMON CENTER",
  },
];

// Random facts about Ayush for NPCs
export const ayushFacts: string[] = [
  "Ayush scored 93.4% in his ICSE boards. His best subjects were Maths and Computer Science!",
  "Ayush specializes in Ruby on Rails for back-end and Java for Native Android development.",
  "Fun fact: Ayush's team IronLegions made it to the semi-finals of Microsoft ImagineCup!",
  "Ayush is currently exploring Neural Networks, NLP, and Transformers at IIIT Kalyani.",
  "Did you know? Ayush was the App Dev Lead at Google Developer Group IIITK!",
  "Ayush built Course-Craft, an educational management platform, for Microsoft ImagineCup.",
  "Ayush led his team to a Top 10 finish in InnovateX with a project called Signetic.",
  "Ayush has deep knowledge of Operating Systems and Computer Organization -- real low-level stuff!",
  "Ayush writes hardware-aware, optimized code. He loves bridging system architecture and UX.",
  "Ayush conducted intensive Android dev sessions for aspiring developers at GDG IIITK.",
  "Ayush's original portfolio was built with Ruby on Rails, featuring crystal-tile UI and scroll animations!",
  "Ayush studies at IIIT Kalyani, Kolkata -- pursuing a B.Tech in Computer Science (2025-2029).",
  "Ayush graduated from Carmel School and then Mothers' International Academy before joining IIIT Kalyani.",
  "Ayush is #OpenToWork! Reach out to him via GitHub, LinkedIn, or email.",
  "Ayush knows HTML, CSS, JavaScript, Ruby, Rails, Java, Android, C, Linux, XML, and more!",
  "Ayush loves building full-stack solutions and bridging complex systems with seamless experiences.",
];

// NPC definitions
export interface NPC {
  id: string;
  x: number;
  y: number;
  messages: string[];
  color: string;
  name: string;
}

export const npcs: NPC[] = [
  {
    id: "guide",
    x: 9,
    y: 9,
    messages: [
      "Welcome to AYUSH TOWN! Walk up to a building and press SPACE or ENTER to explore!",
      "Each building holds a different part of Ayush's portfolio. Go check them all out!",
      "Pro tip: there are 7 buildings in this town. Try to visit every single one!",
    ],
    name: "PROF. OAK",
    color: "#e83b3b",
  },
  {
    id: "coder",
    x: 16,
    y: 9,
    messages: [
      "Ayush loves Ruby on Rails and Native Android. Check out the POKE MART for his projects!",
      "Course-Craft and Signetic are Ayush's featured projects. Both made it far in competitions!",
      "Ayush once built a whole portfolio site with scroll animations using only Rails. Wild!",
    ],
    name: "BUG CATCHER",
    color: "#3ddc84",
  },
  {
    id: "student",
    x: 5,
    y: 9,
    messages: [
      "Ayush is a B.Tech CS student at IIIT Kalyani! Visit the TRAINER SCHOOL for more!",
      "He scored 93.4% in his ICSE boards. That's some serious grinding!",
      "Ayush is exploring Neural Networks and NLP these days. The future is AI!",
    ],
    name: "LASS",
    color: "#5b6ee1",
  },
  {
    id: "hiker",
    x: 24,
    y: 9,
    messages: [
      "The SKILLS DOJO up north has all of Ayush's tech skills on display!",
      "Ruby, Java, C, Android... Ayush is a true full-stack polyglot!",
      "I heard Ayush even knows Operating Systems internals. Low-level wizardry!",
    ],
    name: "HIKER",
    color: "#a0815c",
  },
  {
    id: "swimmer",
    x: 9,
    y: 18,
    messages: [
      "The POKEMON CENTER down south is where you can find Ayush's contact info!",
      "Reach out to Ayush on GitHub, LinkedIn, or via email. He's #OpenToWork!",
      "Ayush responds fast. Don't be shy, send that message!",
    ],
    name: "SWIMMER",
    color: "#3b7dd8",
  },
  {
    id: "ranger",
    x: 20,
    y: 18,
    messages: [
      "The POKE LIBRARY has all of Ayush's important links and social profiles.",
      "Ayush led the IronLegions team. They're a force to be reckoned with!",
      "Did you know Ayush conducted Android dev workshops at GDG IIITK?",
    ],
    name: "RANGER",
    color: "#cc6600",
  },
  {
    id: "rival",
    x: 15,
    y: 17,
    messages: [
      "Hmph! Ayush made it to ImagineCup semi-finals. I could do that too... probably.",
      "IronLegions got Top 10 in InnovateX. That's actually impressive, I guess.",
      "Fine, I admit it. Ayush's full-stack skills are pretty solid.",
    ],
    name: "RIVAL",
    color: "#3f3f74",
  },
];
