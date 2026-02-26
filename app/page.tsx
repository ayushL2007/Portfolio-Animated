"use client";

import { useState, useCallback, useRef } from "react";
import GameCanvas, { type GameLocation } from "@/components/game-canvas";
import TitleScreen from "@/components/title-screen";
import DialogBox from "@/components/dialog-box";
import DPadOverlay from "@/components/dpad-overlay";
import GameHUD from "@/components/game-hud";
import { type Building, type NPC, ayushFacts } from "@/lib/game-data";
import { type BuildingInterior } from "@/lib/interior-data";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [dialog, setDialog] = useState<{ text: string; speaker?: string } | null>(null);
  const [nearBuilding, setNearBuilding] = useState<Building | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GameLocation>({ type: "overworld" });
  const npcFactIndexRef = useRef<Record<string, number>>({});
  // Dialog queue for receptionist multi-line conversations
  const dialogQueueRef = useRef<{ text: string; speaker?: string }[]>([]);

  const isPaused = !!dialog;

  const handleStart = useCallback(() => {
    setStarted(true);
    setDialog({
      text: "Welcome to AYUSH TOWN! Explore the buildings to learn about Ayush. Walk up to a building and press SPACE to enter!",
      speaker: "PROF. OAK",
    });
  }, []);

  // Player pressed SPACE near a building door -- trigger enter
  const handleBuildingEnter = useCallback((building: Building) => {
    setDialog({
      text: `Entering ${building.signText}...`,
      speaker: undefined,
    });
    // After dialog dismiss, actually teleport inside (handled via queue)
    dialogQueueRef.current = [{
      text: "Talk to the receptionist for info! Walk to the EXIT mat to leave.",
      speaker: undefined,
    }];
    // Trigger the canvas to teleport the player inside
    setTimeout(() => {
      const enterFn = (window as unknown as Record<string, unknown>).__gameEnterBuilding as ((id: string) => void) | undefined;
      if (enterFn) enterFn(building.id);
    }, 50);
  }, []);

  const handleBuildingExit = useCallback(() => {
    setCurrentLocation({ type: "overworld" });
    dialogQueueRef.current = [];
    setDialog({
      text: "You left the building. Keep exploring AYUSH TOWN!",
      speaker: undefined,
    });
  }, []);

  const handleLocationChange = useCallback((loc: GameLocation) => {
    setCurrentLocation(loc);
  }, []);

  // Receptionist conversation -- queues all lines
  const handleReceptionistTalk = useCallback((interior: BuildingInterior) => {
    const lines = interior.receptionist.dialogLines;
    if (lines.length === 0) return;

    // Show first line immediately, queue the rest
    setDialog({ text: lines[0], speaker: interior.receptionist.name });
    dialogQueueRef.current = lines.slice(1).map((text) => ({
      text,
      speaker: interior.receptionist.name,
    }));
  }, []);

  // Overworld NPC talk
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

  const handleNearBuilding = useCallback((building: Building | null) => {
    setNearBuilding(building);
  }, []);

  // Dismiss dialog -- advances queue if there are more lines
  const handleDismissDialog = useCallback(() => {
    const queue = dialogQueueRef.current;
    if (queue.length > 0) {
      const next = queue.shift()!;
      setDialog(next);
    } else {
      setDialog(null);
    }
  }, []);

  const handleAction = useCallback(() => {
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
  }, [dialog, handleDismissDialog]);

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
        isPaused={isPaused}
        currentLocation={currentLocation}
      />

      <GameHUD location={currentLocation} />

      {dialog && (
        <DialogBox
          text={dialog.text}
          speaker={dialog.speaker}
          onDismiss={handleDismissDialog}
        />
      )}

      <DPadOverlay onAction={handleAction} disabled={isPaused} />
    </main>
  );
}
