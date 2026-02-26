"use client";

import { useState, useCallback } from "react";
import GameCanvas from "@/components/game-canvas";
import TitleScreen from "@/components/title-screen";
import DialogBox from "@/components/dialog-box";
import SectionModal from "@/components/section-modal";
import DPadOverlay from "@/components/dpad-overlay";
import GameHUD from "@/components/game-hud";
import { type Building, type NPC } from "@/lib/game-data";
import { getNearbyBuilding, getNearbyNPC } from "@/lib/world-map";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [dialog, setDialog] = useState<{ text: string; speaker?: string } | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);
  const [nearBuilding, setNearBuilding] = useState<Building | null>(null);

  const isPaused = !!dialog || !!activeBuilding;

  const handleStart = useCallback(() => {
    setStarted(true);
    setDialog({
      text: "Welcome to AYUSH TOWN! Explore the buildings to learn about Ayush. Walk up to a building and press SPACE or ENTER!",
      speaker: "PROF. OAK",
    });
  }, []);

  const handleBuildingEnter = useCallback((building: Building) => {
    setActiveBuilding(building);
  }, []);

  const handleNPCTalk = useCallback((npc: NPC) => {
    setDialog({ text: npc.message, speaker: "TOWNSPERSON" });
  }, []);

  const handleNPCLeave = useCallback(() => {
    // No-op (dialog stays until dismissed)
  }, []);

  const handleNearBuilding = useCallback((building: Building | null) => {
    setNearBuilding(building);
  }, []);

  const handleDismissDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveBuilding(null);
  }, []);

  const handleAction = useCallback(() => {
    if (dialog) {
      setDialog(null);
      return;
    }
    if (activeBuilding) {
      setActiveBuilding(null);
      return;
    }
    // Simulate space press for interacting
    const event = new KeyboardEvent("keydown", {
      key: " ",
      code: "Space",
      bubbles: true,
    });
    window.dispatchEvent(event);
  }, [dialog, activeBuilding]);

  if (!started) {
    return <TitleScreen onStart={handleStart} />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      <GameCanvas
        onBuildingEnter={handleBuildingEnter}
        onNPCTalk={handleNPCTalk}
        onNPCLeave={handleNPCLeave}
        onNearBuilding={handleNearBuilding}
        isPaused={isPaused}
      />

      <GameHUD />

      {dialog && (
        <DialogBox
          text={dialog.text}
          speaker={dialog.speaker}
          onDismiss={handleDismissDialog}
        />
      )}

      {activeBuilding && (
        <SectionModal building={activeBuilding} onClose={handleCloseModal} />
      )}

      <DPadOverlay onAction={handleAction} disabled={isPaused} />
    </main>
  );
}
