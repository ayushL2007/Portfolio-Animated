"use client";

import { useState, useCallback, useRef } from "react";
import GameCanvas, { type GameLocation } from "@/components/game-canvas";
import TitleScreen from "@/components/title-screen";
import DialogBox from "@/components/dialog-box";
import SectionModal from "@/components/section-modal";
import DPadOverlay from "@/components/dpad-overlay";
import GameHUD from "@/components/game-hud";
import FishingGame from "@/components/fishing-game";
import ArcadeGames from "@/components/arcade-games";
import { type Building, type NPC, ayushFacts, buildings as allBuildings } from "@/lib/game-data";
import { type BuildingInterior } from "@/lib/interior-data";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [dialog, setDialog] = useState<{ text: string; speaker?: string; autoCloseMs?: number } | null>(null);
  const [nearBuilding, setNearBuilding] = useState<Building | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GameLocation>({ type: "overworld" });
  // Section modal shown after receptionist dialog finishes
  const [sectionModal, setSectionModal] = useState<Building | null>(null);
  const [showFishing, setShowFishing] = useState(false);
  const [showArcade, setShowArcade] = useState(false);
  const [nearPond, setNearPond] = useState(false);
  const npcFactIndexRef = useRef<Record<string, number>>({});
  const dialogQueueRef = useRef<{ text: string; speaker?: string }[]>([]);

  const isPaused = !!dialog || !!sectionModal || showFishing || showArcade;

  const handleStart = useCallback(() => {
    setStarted(true);
    setDialog({
      text: "Welcome to AYUSH TOWN! Explore the buildings to learn about Ayush. Walk up to a building and press SPACE to enter!",
      speaker: "PROF. OAK",
    });
  }, []);

  const handleBuildingEnter = useCallback((building: Building) => {
    setDialog({
      text: `Entering ${building.signText}...`,
      speaker: undefined,
      autoCloseMs: 800,
    });
    dialogQueueRef.current = [];
    setTimeout(() => {
      const enterFn = (window as unknown as Record<string, unknown>).__gameEnterBuilding as ((id: string) => void) | undefined;
      if (enterFn) enterFn(building.id);
    }, 50);
  }, []);

  const handleBuildingExit = useCallback(() => {
    setCurrentLocation({ type: "overworld" });
    dialogQueueRef.current = [];
    setSectionModal(null);
    setDialog({
      text: "You left the building. Keep exploring AYUSH TOWN!",
      speaker: undefined,
      autoCloseMs: 800,
    });
  }, []);

  const handleLocationChange = useCallback((loc: GameLocation) => {
    setCurrentLocation(loc);
  }, []);

  const handleReceptionistTalk = useCallback((interior: BuildingInterior) => {
    if (interior.buildingId === "arcade") {
      setShowArcade(true);
      return;
    }
    // Skip dialog entirely -- open the section modal directly
    const building = allBuildings.find((b) => b.id === interior.buildingId);
    if (building) {
      setSectionModal(building);
    }
  }, []);

  const handleNPCTalk = useCallback((npc: NPC) => {
    const randomMsg = npc.messages[Math.floor(Math.random() * npc.messages.length)];
    const useFact = Math.random() < 0.3;
    let message = randomMsg;
    if (useFact) {
      if (!npcFactIndexRef.current[npc.id]) {
        npcFactIndexRef.current[npc.id] = 0;
      }
      const idx = npcFactIndexRef.current[npc.id];
      const offset = npc.id.charCodeAt(0) * 3;
      const factIdx = (idx + offset) % ayushFacts.length;
      message = ayushFacts[factIdx];
      npcFactIndexRef.current[npc.id] = idx + 1;
    }
    setDialog({ text: message, speaker: npc.name });
  }, []);

  const handleNPCLeave = useCallback(() => {}, []);

  const handleFishingStart = useCallback(() => {
    setShowFishing(true);
  }, []);

  const handleNearPond = useCallback((near: boolean) => {
    setNearPond(near);
  }, []);

  const handleNearBuilding = useCallback((building: Building | null) => {
    setNearBuilding(building);
  }, []);

  // Dismiss dialog -- advances queue if any remain
  const handleDismissDialog = useCallback(() => {
    const queue = dialogQueueRef.current;
    if (queue.length > 0) {
      const next = queue.shift()!;
      setDialog(next);
    } else {
      setDialog(null);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSectionModal(null);
  }, []);

  const handleAction = useCallback(() => {
    if (showFishing || showArcade) return;
    if (sectionModal) {
      setSectionModal(null);
      return;
    }
    if (dialog) {
      handleDismissDialog();
      return;
    }
    const event = new KeyboardEvent("keydown", {
      key: " ",
      code: "Space",
      bubbles: true,
    });
    window.dispatchEvent(event);
  }, [dialog, sectionModal, showFishing, showArcade, handleDismissDialog]);

  if (!started) {
    return <TitleScreen onStart={handleStart} />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      <GameCanvas
        onBuildingEnter={handleBuildingEnter}
        onBuildingExit={handleBuildingExit}
        onNPCTalk={handleNPCTalk}
        onReceptionistTalk={handleReceptionistTalk}
        onNPCLeave={handleNPCLeave}
        onNearBuilding={handleNearBuilding}
        onLocationChange={handleLocationChange}
        onFishingStart={handleFishingStart}
        onNearPond={handleNearPond}
        isPaused={isPaused}
        currentLocation={currentLocation}
      />

      <GameHUD location={currentLocation} />

      {dialog && (
        <DialogBox
          text={dialog.text}
          speaker={dialog.speaker}
          onDismiss={handleDismissDialog}
          autoCloseMs={dialog.autoCloseMs}
        />
      )}

      {sectionModal && (
        <SectionModal
          building={sectionModal}
          onClose={handleCloseModal}
        />
      )}

      {showFishing && (
        <FishingGame onClose={() => setShowFishing(false)} />
      )}

      {showArcade && (
        <ArcadeGames onClose={() => setShowArcade(false)} />
      )}

      {nearPond && !dialog && !sectionModal && !showFishing && !showArcade && currentLocation.type === "overworld" && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="pixel-border bg-card/90 px-4 py-2">
            <p className="font-mono text-xs text-primary animate-pulse pixel-text">PRESS SPACE TO FISH</p>
          </div>
        </div>
      )}

      <DPadOverlay onAction={handleAction} disabled={isPaused} />
    </main>
  );
}
