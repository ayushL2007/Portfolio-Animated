"use client";

import { useEffect, useState } from "react";

interface DialogBoxProps {
  text: string;
  speaker?: string;
  onDismiss: () => void;
  /** If set, the dialog auto-closes after this many ms once fully typed */
  autoCloseMs?: number;
}

export default function DialogBox({ text, speaker, onDismiss, autoCloseMs }: DialogBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  // Auto-close after timeout when text finishes typing
  useEffect(() => {
    if (!isComplete || !autoCloseMs) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isComplete, autoCloseMs, onDismiss]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        if (isComplete) {
          onDismiss();
        } else {
          // Skip typewriter, show full text immediately
          setDisplayedText(text);
          setIsComplete(true);
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isComplete, text, onDismiss]);

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-[640px] z-40 animate-fade-in">
      <div className="pixel-border bg-card p-4 md:p-5">
        {speaker && (
          <div className="inline-block bg-primary text-primary-foreground px-3 py-1 text-xs font-sans mb-2">
            {speaker}
          </div>
        )}
        <p className="text-foreground text-lg md:text-xl leading-relaxed font-mono tracking-wide">
          {displayedText}
          {isComplete && <span className="cursor-blink" />}
        </p>
        {isComplete && (
          <p className="text-muted-foreground text-xs mt-3 text-right font-sans">
            {"PRESS SPACE TO CONTINUE"}
          </p>
        )}
      </div>
    </div>
  );
}
