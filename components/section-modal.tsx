"use client";

import { useEffect } from "react";
import { portfolioData, type Building } from "@/lib/game-data";
import { X, Github, Mail, Linkedin, ExternalLink } from "lucide-react";

interface SectionModalProps {
  building: Building;
  onClose: () => void;
}

export default function SectionModal({ building, onClose }: SectionModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto pixel-border bg-card animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-card flex items-center justify-between p-4 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: building.color }}
            />
            <h2 className="font-sans text-sm md:text-base text-primary pixel-text">
              {building.signText}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">{renderSection(building.section)}</div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-border text-center">
          <p className="text-muted-foreground text-xs font-sans">
            {"PRESS ESC TO CLOSE"}
          </p>
        </div>
      </div>
    </div>
  );
}

function renderSection(section: string) {
  switch (section) {
    case "about":
      return <AboutSection />;
    case "projects":
      return <ProjectsSection />;
    case "skills":
      return <SkillsSection />;
    case "experience":
      return <ExperienceSection />;
    case "education":
      return <EducationSection />;
    case "links":
      return <LinksSection />;
    case "contact":
      return <ContactSection />;
    default:
      return null;
  }
}

function AboutSection() {
  const { about, skills, name, title, tagline } = portfolioData;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-primary text-2xl font-mono mb-1">{name}</h3>
        <p className="text-accent font-sans text-xs mb-2">{tagline}</p>
        <p className="text-muted-foreground font-sans text-xs">{title}</p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-foreground text-base font-mono leading-relaxed">
          {about.bio}
        </p>
        <p className="text-muted-foreground text-sm font-mono leading-relaxed">
          {about.detail}
        </p>
      </div>
      <div>
        <h4 className="text-primary font-sans text-xs mb-3">{"SKILLS & TOOLS"}</h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="px-3 py-1 text-sm font-mono border-2 border-border text-foreground"
              style={{ borderColor: skill.color }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const { projects } = portfolioData;
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-primary text-2xl font-mono">{"Projects"}</h3>
      {projects.map((project) => (
        <div
          key={project.name}
          className="border-2 border-border p-4 flex flex-col gap-2"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-foreground text-lg font-mono">
              {project.name}
              {project.featured && (
                <span className="ml-2 text-accent text-xs font-sans align-middle">
                  {"FEATURED"}
                </span>
              )}
            </h4>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors shrink-0"
              aria-label={`View ${project.name} on GitHub`}
            >
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="text-muted-foreground text-sm font-mono leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs font-sans px-2 py-0.5 bg-muted text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceSection() {
  const { experience } = portfolioData;
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-primary text-2xl font-mono">{"Experience"}</h3>
      {experience.map((exp, i) => (
        <div key={i} className="border-l-4 border-primary pl-4 flex flex-col gap-1">
          <h4 className="text-foreground text-lg font-mono">{exp.role}</h4>
          <p className="text-accent text-sm font-sans">{exp.org}</p>
          <p className="text-muted-foreground text-xs font-sans">{exp.period}</p>
          <p className="text-muted-foreground text-sm font-mono leading-relaxed mt-1">
            {exp.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function EducationSection() {
  const { education } = portfolioData;
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-primary text-2xl font-mono">{"Education"}</h3>
      {education.map((edu, i) => (
        <div key={i} className="border-2 border-border p-4 flex flex-col gap-2">
          <h4 className="text-foreground text-lg font-mono">{edu.degree}</h4>
          <p className="text-primary text-sm font-sans">{edu.school}</p>
          <p className="text-muted-foreground text-xs font-sans">{edu.period}</p>
          <ul className="mt-1 flex flex-col gap-1">
            {edu.details.map((d, j) => (
              <li
                key={j}
                className="text-muted-foreground text-sm font-mono leading-relaxed flex items-start gap-2"
              >
                <span className="text-primary shrink-0">{">"}</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SkillsSection() {
  const { skills } = portfolioData;
  const categories = [
    { label: "FRONT-END", items: ["HTML", "CSS", "JavaScript", "XML"] },
    { label: "BACK-END", items: ["Ruby", "Rails", "Java", "C"] },
    { label: "MOBILE", items: ["Android", "Java", "XML"] },
    { label: "SYSTEMS", items: ["Linux/OS", "C"] },
  ];
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-primary text-2xl font-mono">{"Skills & Tools"}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className="px-3 py-2 text-base font-mono border-2 text-foreground"
            style={{ borderColor: skill.color, backgroundColor: skill.color + "18" }}
          >
            {skill.name}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4 mt-2">
        {categories.map((cat) => (
          <div key={cat.label} className="border-2 border-border p-3">
            <h4 className="text-primary font-sans text-xs mb-2">{cat.label}</h4>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => {
                const skill = skills.find((s) => s.name === item);
                return (
                  <span
                    key={item}
                    className="text-sm font-mono px-2 py-1 bg-muted text-muted-foreground"
                    style={skill ? { color: skill.color } : {}}
                  >
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-sm font-mono leading-relaxed">
        {"Full Stack Development with deep knowledge of Operating Systems and Computer Organization."}
      </p>
    </div>
  );
}

function LinksSection() {
  const { contact, name } = portfolioData;
  const links = [
    {
      label: "GitHub Profile",
      url: contact.github,
      desc: "Check out all repositories and open source contributions",
      icon: "code",
    },
    {
      label: "LinkedIn",
      url: contact.linkedin,
      desc: "Professional profile and network",
      icon: "briefcase",
    },
    {
      label: "Portfolio (Rails)",
      url: "https://github.com/ayushL2007/Portfolio",
      desc: "The original Ruby on Rails portfolio with crystal-tile UI",
      icon: "globe",
    },
    {
      label: "Email",
      url: `mailto:${contact.email}`,
      desc: contact.email,
      icon: "mail",
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-primary text-2xl font-mono">{"Links & Resources"}</h3>
      <p className="text-muted-foreground text-sm font-mono leading-relaxed">
        {"All of "}{name}{"'s important links in one place:"}
      </p>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-1 border-2 border-border p-4 hover:border-primary transition-colors group"
        >
          <p className="text-foreground text-lg font-mono group-hover:text-primary transition-colors">
            {link.label}
          </p>
          <p className="text-muted-foreground text-sm font-sans">
            {link.desc}
          </p>
        </a>
      ))}
    </div>
  );
}

function ContactSection() {
  const { contact, name } = portfolioData;
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-primary text-2xl font-mono">{"Contact"}</h3>
      <p className="text-muted-foreground text-sm font-mono leading-relaxed">
        {"Want to connect with "}{name}{"? Reach out through any of these channels:"}
      </p>
      <div className="flex flex-col gap-3">
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border-2 border-border p-3 hover:border-primary transition-colors group"
        >
          <Github size={20} className="text-primary" />
          <div>
            <p className="text-foreground text-sm font-mono group-hover:text-primary transition-colors">
              {"GitHub"}
            </p>
            <p className="text-muted-foreground text-xs font-sans">
              {"ayushL2007"}
            </p>
          </div>
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 border-2 border-border p-3 hover:border-primary transition-colors group"
        >
          <Mail size={20} className="text-primary" />
          <div>
            <p className="text-foreground text-sm font-mono group-hover:text-primary transition-colors">
              {"Email"}
            </p>
            <p className="text-muted-foreground text-xs font-sans">
              {contact.email}
            </p>
          </div>
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border-2 border-border p-3 hover:border-primary transition-colors group"
        >
          <Linkedin size={20} className="text-primary" />
          <div>
            <p className="text-foreground text-sm font-mono group-hover:text-primary transition-colors">
              {"LinkedIn"}
            </p>
            <p className="text-muted-foreground text-xs font-sans">
              {"ayush-lahiri"}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
