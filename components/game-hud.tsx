"use client";

import { useState } from "react";
import { buildings, portfolioData } from "@/lib/game-data";
import { type GameLocation } from "@/components/game-canvas";
import { ExternalLink, Github, Mail, Linkedin } from "lucide-react";

interface GameHUDProps {
  location: GameLocation;
}

export default function GameHUD({ location }: GameHUDProps) {
  const [showConnect, setShowConnect] = useState(false);

  const locationLabel =
    location.type === "overworld"
      ? "AYUSH TOWN"
      : buildings.find((b) => b.id === location.buildingId)?.signText ?? "INSIDE";

  const { contact } = portfolioData;

  return (
    <div className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-start justify-between p-3 md:p-4">
        {/* Left side: Location label + Original site link */}
        <div className="flex flex-col gap-2">
          <div className="pointer-events-auto pixel-border bg-card/90 px-3 py-2">
            <p className="font-sans text-[10px] md:text-xs text-primary pixel-text">
              {locationLabel}
            </p>
          </div>
          <a
            href="https://ayush-uyj6.onrender.com/#home"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto pixel-border bg-card/90 px-3 py-2 flex items-center gap-2 hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <ExternalLink size={14} className="text-accent shrink-0" />
            <span className="font-mono text-[10px] md:text-xs text-foreground">
              {"Original Site"}
            </span>
          </a>
        </div>

        {/* Right side: Connect button + dropdown */}
        <div className="flex flex-col items-end gap-2 relative">
          <button
            onClick={() => setShowConnect((prev) => !prev)}
            className="pointer-events-auto pixel-border bg-card/90 px-3 py-2 flex items-center gap-2 hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px] md:text-xs text-primary">
              {"Connect"}
            </span>
            <span className="text-accent text-[10px]">{showConnect ? "x" : "+"}</span>
          </button>

          {showConnect && (
            <div className="pointer-events-auto pixel-border bg-card/95 flex flex-col animate-fade-in min-w-[180px]">
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border"
              >
                <Github size={16} className="text-primary shrink-0" />
                <div>
                  <p className="font-mono text-xs text-foreground">{"GitHub"}</p>
                  <p className="font-sans text-[9px] text-muted-foreground">{"ayushL2007"}</p>
                </div>
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border"
              >
                <Linkedin size={16} className="text-primary shrink-0" />
                <div>
                  <p className="font-mono text-xs text-foreground">{"LinkedIn"}</p>
                  <p className="font-sans text-[9px] text-muted-foreground">{"ayush-lahiri"}</p>
                </div>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors"
              >
                <Mail size={16} className="text-primary shrink-0" />
                <div>
                  <p className="font-mono text-xs text-foreground">{"Email"}</p>
                  <p className="font-sans text-[9px] text-muted-foreground">{contact.email}</p>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
