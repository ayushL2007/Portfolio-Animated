"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Fish {
  name: string;
  rarity: string;
  color: string;
  size: number;
  difficulty: number; // speed of the catch bar
  fact: string;
}

const FISH_POOL: Fish[] = [
  { name: "Magikarp", rarity: "Common", color: "#e83b3b", size: 12, difficulty: 1.5, fact: "Ayush once debugged a 500-line Rails app at 2am." },
  { name: "Goldeen", rarity: "Common", color: "#f89720", size: 14, difficulty: 1.8, fact: "Ayush scored 93.4% in his ICSE boards." },
  { name: "Poliwag", rarity: "Uncommon", color: "#5b6ee1", size: 16, difficulty: 2.2, fact: "Ayush is the App Dev Lead at GDG IIITK." },
  { name: "Staryu", rarity: "Uncommon", color: "#f7de1e", size: 18, difficulty: 2.5, fact: "Ayush's team reached ImagineCup semi-finals!" },
  { name: "Dratini", rarity: "Rare", color: "#3b7dd8", size: 22, difficulty: 3.0, fact: "Ayush is exploring Neural Networks and Transformers." },
  { name: "Gyarados", rarity: "Epic", color: "#3ddc84", size: 30, difficulty: 3.8, fact: "Ayush builds full-stack apps bridging system architecture and UX!" },
  { name: "Lapras", rarity: "Legendary", color: "#9b59b6", size: 36, difficulty: 4.5, fact: "Ayush knows OS internals, computer org, AND high-level frameworks." },
];

function pickFish(): Fish {
  const roll = Math.random();
  if (roll < 0.35) return FISH_POOL[Math.floor(Math.random() * 2)];
  if (roll < 0.65) return FISH_POOL[2 + Math.floor(Math.random() * 2)];
  if (roll < 0.85) return FISH_POOL[4];
  if (roll < 0.95) return FISH_POOL[5];
  return FISH_POOL[6];
}

type Phase = "casting" | "waiting" | "bite" | "reeling" | "caught" | "escaped";

interface FishingGameProps {
  onClose: () => void;
}

export default function FishingGame({ onClose }: FishingGameProps) {
  const [phase, setPhase] = useState<Phase>("casting");
  const [fish, setFish] = useState<Fish | null>(null);
  const [barPos, setBarPos] = useState(50);
  const [targetPos, setTargetPos] = useState(40);
  const [catchProgress, setCatchProgress] = useState(0);
  const [caughtFish, setCaughtFish] = useState<Fish[]>([]);
  const barDir = useRef(1);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);

  // Casting phase auto-advances
  useEffect(() => {
    if (phase === "casting") {
      const t = setTimeout(() => setPhase("waiting"), 1200);
      return () => clearTimeout(t);
    }
    if (phase === "waiting") {
      const delay = 1500 + Math.random() * 3000;
      const t = setTimeout(() => {
        setFish(pickFish());
        setPhase("bite");
      }, delay);
      return () => clearTimeout(t);
    }
    if (phase === "bite") {
      const t = setTimeout(() => {
        if (phase === "bite") setPhase("escaped");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Reeling animation loop
  useEffect(() => {
    if (phase !== "reeling" || !fish) return;
    let running = true;
    const speed = fish.difficulty;

    function tick() {
      if (!running) return;
      frameRef.current++;

      // Move target zone
      setTargetPos((prev) => {
        let next = prev + (Math.sin(frameRef.current * 0.04 * speed) * 1.2);
        next = Math.max(10, Math.min(90, next));
        return next;
      });

      // Move bar
      setBarPos((prev) => {
        let next = prev + barDir.current * speed * 0.8;
        if (next >= 95 || next <= 5) barDir.current *= -1;
        return Math.max(5, Math.min(95, next));
      });

      // Check overlap
      setBarPos((currentBar) => {
        setTargetPos((currentTarget) => {
          const overlap = Math.abs(currentBar - currentTarget) < 15;
          setCatchProgress((prev) => {
            const next = overlap ? prev + 1.2 : prev - 0.6;
            if (next >= 100) {
              setPhase("caught");
              if (fish) setCaughtFish((arr) => [...arr, fish]);
              return 100;
            }
            if (next <= 0) {
              setPhase("escaped");
              return 0;
            }
            return next;
          });
          return currentTarget;
        });
        return currentBar;
      });

      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [phase, fish]);

  // Bite phase -- press space to start reeling
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phase === "bite") {
          setCatchProgress(30);
          setBarPos(50);
          setPhase("reeling");
        } else if (phase === "reeling") {
          barDir.current *= -1;
        } else if (phase === "caught" || phase === "escaped") {
          // Reset for another cast
          setFish(null);
          setCatchProgress(0);
          setBarPos(50);
          setTargetPos(40);
          barDir.current = 1;
          frameRef.current = 0;
          setPhase("casting");
        }
      }
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, onClose]);

  const rarityColor: Record<string, string> = {
    Common: "#9badb7",
    Uncommon: "#3ddc84",
    Rare: "#3b7dd8",
    Epic: "#9b59b6",
    Legendary: "#f7de1e",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md pixel-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b-2 border-border">
          <p className="font-mono text-sm text-primary pixel-text">FISHING POND</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs font-mono">[ESC]</button>
        </div>

        {/* Game area */}
        <div className="p-4 flex flex-col gap-4 min-h-[280px]">
          {/* Water scene */}
          <div className="relative h-24 bg-[#2a5a8a] overflow-hidden border-2 border-border" style={{ imageRendering: "pixelated" }}>
            {/* Waves */}
            <div className="absolute inset-0">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute h-2 bg-[#3a7aba] opacity-50"
                  style={{
                    top: `${20 + i * 22}%`,
                    left: `${(i * 20) - 10}%`,
                    width: "120%",
                    animation: `wave ${2 + i * 0.3}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>

            {/* Bobber */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: "50%",
                top: phase === "waiting" ? "40%" : phase === "bite" ? "55%" : "35%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="w-3 h-3 rounded-full bg-[#e83b3b]" />
              <div className="w-px h-6 bg-[#e8c170] mx-auto" />
            </div>

            {/* Fish silhouette on bite */}
            {phase === "bite" && fish && (
              <div
                className="absolute text-[#f7de1e] font-mono text-2xl animate-pulse"
                style={{ left: "60%", top: "50%" }}
              >
                {"!"}
              </div>
            )}
          </div>

          {/* Status text */}
          <div className="text-center">
            {phase === "casting" && (
              <p className="font-mono text-sm text-muted-foreground animate-pulse">Casting line...</p>
            )}
            {phase === "waiting" && (
              <p className="font-mono text-sm text-muted-foreground">Waiting for a bite...</p>
            )}
            {phase === "bite" && (
              <p className="font-mono text-sm text-accent animate-pulse">A BITE! Press SPACE now!</p>
            )}
            {phase === "reeling" && fish && (
              <div className="flex flex-col gap-3">
                <p className="font-mono text-sm text-primary">Reeling in {fish.name}! Press SPACE to change direction!</p>

                {/* Catch bar */}
                <div className="relative h-6 bg-muted border-2 border-border">
                  {/* Target zone */}
                  <div
                    className="absolute h-full bg-[#3ddc84]/30 transition-all duration-100"
                    style={{ left: `${targetPos - 12}%`, width: "24%" }}
                  />
                  {/* Player bar */}
                  <div
                    className="absolute h-full w-3 bg-[#e83b3b] transition-all duration-50"
                    style={{ left: `${barPos}%`, transform: "translateX(-50%)" }}
                  />
                </div>

                {/* Progress */}
                <div className="relative h-3 bg-muted border-2 border-border">
                  <div
                    className="h-full bg-[#3ddc84] transition-all duration-100"
                    style={{ width: `${catchProgress}%` }}
                  />
                </div>
              </div>
            )}
            {phase === "caught" && fish && (
              <div className="flex flex-col gap-3 items-center">
                <p className="font-mono text-lg text-accent">You caught {fish.name}!</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4" style={{ backgroundColor: fish.color }} />
                  <span className="font-mono text-xs" style={{ color: rarityColor[fish.rarity] }}>{fish.rarity}</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed px-2">{fish.fact}</p>
                <p className="font-mono text-xs text-primary animate-pulse mt-1">Press SPACE to fish again</p>
              </div>
            )}
            {phase === "escaped" && (
              <div className="flex flex-col gap-2 items-center">
                <p className="font-mono text-sm text-[#e83b3b]">
                  {fish ? `${fish.name} got away!` : "The fish got away!"}
                </p>
                <p className="font-mono text-xs text-primary animate-pulse">Press SPACE to try again</p>
              </div>
            )}
          </div>

          {/* Caught fish display */}
          {caughtFish.length > 0 && (
            <div className="border-t-2 border-border pt-3">
              <p className="font-mono text-xs text-muted-foreground mb-2">Caught: {caughtFish.length}</p>
              <div className="flex flex-wrap gap-1">
                {caughtFish.map((f, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 border border-border"
                    style={{ backgroundColor: f.color }}
                    title={`${f.name} (${f.rarity})`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
