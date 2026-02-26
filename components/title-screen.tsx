"use client";

import { useEffect, useState } from "react";

interface TitleScreenProps {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onStart();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onStart]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background cursor-pointer"
      onClick={onStart}
    >
      {/* Decorative pixel border frame */}
      <div className="absolute inset-4 md:inset-12 border-4 border-primary/30" />
      <div className="absolute inset-6 md:inset-14 border-2 border-primary/15" />

      {/* Pixel art pokeball decoration */}
      <div className="mb-8 w-16 h-16 relative">
        {/* Top half - red */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-accent rounded-t-full" />
        {/* Bottom half - white */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-foreground rounded-b-full" />
        {/* Center line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-card -translate-y-1/2" />
        {/* Center button */}
        <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-foreground border-3 border-card rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <h1 className="font-sans text-lg md:text-2xl text-primary pixel-text text-center mb-3 leading-relaxed">
        {"AYUSH LAHIRI"}
      </h1>
      <h2 className="font-mono text-xl md:text-3xl text-foreground text-center mb-2">
        {"Pixel Portfolio"}
      </h2>
      <p className="font-mono text-sm text-muted-foreground text-center mb-12">
        {"A Pokemon-style Adventure"}
      </p>

      <p
        className="font-sans text-xs text-primary text-center transition-opacity"
        style={{ opacity: blink ? 1 : 0.3 }}
      >
        {"PRESS SPACE OR TAP TO START"}
      </p>

      <div className="absolute bottom-8 flex flex-col items-center gap-2">
        <p className="font-mono text-xs text-muted-foreground">
          {"Arrow Keys / WASD to move"}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {"SPACE / ENTER to interact"}
        </p>
      </div>
    </div>
  );
}
