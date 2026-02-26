import { Building, NPC } from "./game-data";

const TILE = 32;

// Draw a pixel-art grass tile
export function drawGrass(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#4a7c59";
  ctx.fillRect(px, py, TILE, TILE);

  const seed = (x * 7 + y * 13) % 5;
  ctx.fillStyle = "#5a9c6a";
  if (seed === 0) {
    ctx.fillRect(px + 4, py + 6, 2, 4);
    ctx.fillRect(px + 20, py + 18, 2, 4);
    ctx.fillRect(px + 12, py + 24, 2, 3);
  } else if (seed === 1) {
    ctx.fillRect(px + 8, py + 10, 2, 3);
    ctx.fillRect(px + 24, py + 8, 2, 4);
  } else if (seed === 2) {
    ctx.fillRect(px + 16, py + 4, 2, 4);
    ctx.fillRect(px + 6, py + 22, 2, 3);
    ctx.fillRect(px + 26, py + 26, 2, 3);
  } else if (seed === 3) {
    ctx.fillRect(px + 2, py + 14, 2, 4);
    ctx.fillRect(px + 18, py + 2, 2, 3);
  } else {
    ctx.fillRect(px + 10, py + 16, 2, 3);
    ctx.fillRect(px + 28, py + 12, 2, 4);
    ctx.fillRect(px + 14, py + 28, 2, 2);
  }

  if ((x * 3 + y * 11) % 17 === 0) {
    ctx.fillStyle = "#e8c170";
    ctx.fillRect(px + 14, py + 14, 4, 4);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 12, py + 14, 2, 2);
    ctx.fillRect(px + 18, py + 14, 2, 2);
    ctx.fillRect(px + 14, py + 12, 2, 2);
    ctx.fillRect(px + 14, py + 18, 2, 2);
  }

  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(px, py, TILE, 1);
  ctx.fillRect(px, py, 1, TILE);
}

// Draw a flower patch tile
export function drawFlowerPatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Base grass
  ctx.fillStyle = "#4a7c59";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "#5a9c6a";
  ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);

  // Flowers
  const colors = ["#e83b3b", "#e8c170", "#5b6ee1", "#f4f4f4", "#f89720"];
  const seed = x * 3 + y * 7;
  for (let i = 0; i < 4; i++) {
    const fx = px + 4 + ((seed + i * 7) % 20);
    const fy = py + 4 + (((seed + i * 11) % 20));
    ctx.fillStyle = colors[(seed + i) % colors.length];
    ctx.fillRect(fx, fy, 4, 4);
    ctx.fillStyle = "#e8c170";
    ctx.fillRect(fx + 1, fy + 1, 2, 2);
  }
}

// Draw a path tile
export function drawPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px, py, TILE, TILE);

  ctx.fillStyle = "#b89a5c";
  const seed = (x * 11 + y * 7) % 4;
  if (seed === 0) {
    ctx.fillRect(px + 4, py + 8, 3, 2);
    ctx.fillRect(px + 20, py + 22, 4, 2);
  } else if (seed === 1) {
    ctx.fillRect(px + 12, py + 4, 2, 3);
    ctx.fillRect(px + 24, py + 16, 3, 2);
  } else if (seed === 2) {
    ctx.fillRect(px + 8, py + 20, 3, 2);
  } else {
    ctx.fillRect(px + 16, py + 12, 4, 2);
  }

  ctx.fillStyle = "#a88c4c";
  ctx.fillRect(px, py, TILE, 1);
  ctx.fillRect(px, py, 1, TILE);
}

// Draw a pixel-art building
export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  building: Building,
  camX: number,
  camY: number,
  isNearby: boolean
) {
  const bx = building.x * TILE - camX;
  const by = building.y * TILE - camY;
  const bw = building.width * TILE;
  const bh = building.height * TILE;

  // Building shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(bx + 6, by + 6, bw, bh);

  // Main building body
  ctx.fillStyle = building.color;
  ctx.fillRect(bx, by, bw, bh);

  // Building border
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);

  // Roof
  const roofHeight = TILE * 1.5;
  ctx.fillStyle = building.roofColor;
  ctx.fillRect(bx - 4, by - roofHeight, bw + 8, roofHeight);
  ctx.fillStyle = shadeColor(building.roofColor, -20);
  ctx.fillRect(bx - 4, by - roofHeight, bw + 8, 4);
  ctx.fillRect(bx - 4, by - 4, bw + 8, 4);

  // Windows
  ctx.fillStyle = isNearby ? "#ffffaa" : "#87ceeb";
  const windowSize = 10;
  const windowY = by + TILE * 0.8;
  ctx.fillRect(bx + TILE * 0.6, windowY, windowSize, windowSize);
  ctx.fillRect(bx + bw - TILE * 0.6 - windowSize, windowY, windowSize, windowSize);
  // Extra center window for wider buildings
  if (building.width >= 6) {
    ctx.fillRect(bx + bw / 2 - windowSize / 2, windowY, windowSize, windowSize);
  }
  // Window frames
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(bx + TILE * 0.6 + windowSize / 2 - 1, windowY, 2, windowSize);
  ctx.fillRect(bx + TILE * 0.6, windowY + windowSize / 2 - 1, windowSize, 2);
  ctx.fillRect(bx + bw - TILE * 0.6 - windowSize + windowSize / 2 - 1, windowY, 2, windowSize);
  ctx.fillRect(bx + bw - TILE * 0.6 - windowSize, windowY + windowSize / 2 - 1, windowSize, 2);

  // Door
  const doorW = TILE * 0.8;
  const doorH = TILE * 1.2;
  const doorX = bx + bw / 2 - doorW / 2;
  const doorY = by + bh - doorH;
  ctx.fillStyle = building.doorColor;
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(doorX + doorW - 8, doorY + doorH / 2, 4, 4);
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  // Sign
  const signW = Math.max(100, building.signText.length * 7 + 20);
  ctx.fillStyle = "#e8c170";
  ctx.fillRect(bx + bw / 2 - signW / 2 - 2, by - roofHeight - 26, signW + 4, 24);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(bx + bw / 2 - signW / 2, by - roofHeight - 24, signW, 20);

  ctx.fillStyle = "#e8c170";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText(building.signText, bx + bw / 2, by - roofHeight - 10);

  // Glow when nearby
  if (isNearby) {
    ctx.strokeStyle = "#e8c170";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(bx - 4, by - roofHeight - 28, bw + 8, bh + roofHeight + 32);
    ctx.setLineDash([]);

    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("[ SPACE / ENTER ]", bx + bw / 2, by + bh + 18);
  }
}

// Draw the player character with proper directional walk animation
// direction: 0=down, 1=up, 2=left, 3=right
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  direction: number,
  frame: number,
  isMoving: boolean
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Walk cycle: 4 frames (0 = stand, 1 = step left, 2 = stand, 3 = step right)
  const walkFrame = isMoving ? frame % 4 : 0;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 31, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (direction === 0) {
    // === FACING DOWN (front view) ===
    drawPlayerDown(ctx, px, py, walkFrame, isMoving);
  } else if (direction === 1) {
    // === FACING UP (back view) ===
    drawPlayerUp(ctx, px, py, walkFrame, isMoving);
  } else if (direction === 2) {
    // === FACING LEFT ===
    drawPlayerLeft(ctx, px, py, walkFrame, isMoving);
  } else {
    // === FACING RIGHT ===
    drawPlayerRight(ctx, px, py, walkFrame, isMoving);
  }
}

function drawPlayerDown(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean) {
  const legSwing = isMoving ? (walkFrame === 1 ? 3 : walkFrame === 3 ? -3 : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? -2 : walkFrame === 3 ? 2 : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -1 : 0) : 0;

  // Hat
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 5, py - 2 + bounce, 22, 5);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 5, py + 2 + bounce, 22, 2);

  // Hair
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 7, py + 1 + bounce, 18, 4);
  ctx.fillRect(px + 6, py + 2 + bounce, 2, 4);
  ctx.fillRect(px + 24, py + 2 + bounce, 2, 4);

  // Head (skin)
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 8, py + 3 + bounce, 16, 12);

  // Eyes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 11, py + 8 + bounce, 3, 3);
  ctx.fillRect(px + 18, py + 8 + bounce, 3, 3);
  // Eye highlight
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 12, py + 8 + bounce, 1, 1);
  ctx.fillRect(px + 19, py + 8 + bounce, 1, 1);

  // Mouth
  ctx.fillStyle = "#c4956a";
  ctx.fillRect(px + 14, py + 12 + bounce, 4, 1);

  // Body (red shirt)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 8, py + 15 + bounce, 16, 8);
  // Shirt detail
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 15, py + 15 + bounce, 2, 8);

  // Arms
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 4, py + 16 + bounce + armSwing, 4, 6);
  ctx.fillRect(px + 24, py + 16 + bounce - armSwing, 4, 6);
  // Hands
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 4, py + 22 + bounce + armSwing, 4, 2);
  ctx.fillRect(px + 24, py + 22 + bounce - armSwing, 4, 2);

  // Legs (dark pants)
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 9, py + 23 + bounce, 6, 6 + legSwing);
  ctx.fillRect(px + 17, py + 23 + bounce, 6, 6 - legSwing);

  // Shoes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 8, py + 28 + bounce + Math.max(0, legSwing), 7, 3);
  ctx.fillRect(px + 17, py + 28 + bounce + Math.max(0, -legSwing), 7, 3);
}

function drawPlayerUp(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean) {
  const legSwing = isMoving ? (walkFrame === 1 ? 3 : walkFrame === 3 ? -3 : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? -2 : walkFrame === 3 ? 2 : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -1 : 0) : 0;

  // Hat (back)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 5, py - 2 + bounce, 22, 5);
  // Hat back strap
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 12, py + 2 + bounce, 8, 2);

  // Hair (back of head - more visible)
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 7, py + 1 + bounce, 18, 14);

  // Ears
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 6, py + 7 + bounce, 2, 4);
  ctx.fillRect(px + 24, py + 7 + bounce, 2, 4);

  // Body (red shirt back)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 8, py + 15 + bounce, 16, 8);
  // Backpack strap detail
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 10, py + 15 + bounce, 2, 8);
  ctx.fillRect(px + 20, py + 15 + bounce, 2, 8);

  // Arms
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 4, py + 16 + bounce + armSwing, 4, 6);
  ctx.fillRect(px + 24, py + 16 + bounce - armSwing, 4, 6);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 4, py + 22 + bounce + armSwing, 4, 2);
  ctx.fillRect(px + 24, py + 22 + bounce - armSwing, 4, 2);

  // Legs
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 9, py + 23 + bounce, 6, 6 + legSwing);
  ctx.fillRect(px + 17, py + 23 + bounce, 6, 6 - legSwing);

  // Shoes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 8, py + 28 + bounce + Math.max(0, legSwing), 7, 3);
  ctx.fillRect(px + 17, py + 28 + bounce + Math.max(0, -legSwing), 7, 3);
}

function drawPlayerLeft(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean) {
  const legSwing = isMoving ? (walkFrame === 1 ? 3 : walkFrame === 3 ? -3 : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? 3 : walkFrame === 3 ? -3 : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -1 : 0) : 0;

  // Hat (side view - brim sticks out left)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 2, py - 2 + bounce, 20, 5);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 2, py + 2 + bounce, 10, 2);

  // Hair
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 8, py + 1 + bounce, 14, 5);
  ctx.fillRect(px + 7, py + 3 + bounce, 2, 6);

  // Head
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 9, py + 3 + bounce, 13, 12);

  // Eye (one visible, looking left)
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 10, py + 8 + bounce, 3, 3);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 10, py + 8 + bounce, 1, 1);

  // Nose
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 8, py + 10 + bounce, 2, 2);

  // Body
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 10, py + 15 + bounce, 12, 8);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 10, py + 15 + bounce, 3, 8);

  // Front arm (swings)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 7, py + 16 + bounce - armSwing, 4, 6);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 7, py + 22 + bounce - armSwing, 4, 2);

  // Back arm (hidden mostly, opposite swing)
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 21, py + 16 + bounce + armSwing, 3, 5);

  // Legs (side view, one in front of other)
  ctx.fillStyle = "#3f3f74";
  // Front leg
  ctx.fillRect(px + 10 - legSwing, py + 23 + bounce, 5, 6);
  // Back leg
  ctx.fillStyle = "#2d2d5c";
  ctx.fillRect(px + 17 + legSwing, py + 23 + bounce, 5, 6);

  // Shoes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 8 - legSwing, py + 28 + bounce, 7, 3);
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(px + 16 + legSwing, py + 28 + bounce, 6, 3);
}

function drawPlayerRight(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean) {
  const legSwing = isMoving ? (walkFrame === 1 ? 3 : walkFrame === 3 ? -3 : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? 3 : walkFrame === 3 ? -3 : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -1 : 0) : 0;

  // Hat (side view - brim sticks out right)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 10, py - 2 + bounce, 20, 5);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 20, py + 2 + bounce, 10, 2);

  // Hair
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 10, py + 1 + bounce, 14, 5);
  ctx.fillRect(px + 23, py + 3 + bounce, 2, 6);

  // Head
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 10, py + 3 + bounce, 13, 12);

  // Eye (one visible, looking right)
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 19, py + 8 + bounce, 3, 3);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 21, py + 8 + bounce, 1, 1);

  // Nose
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 22, py + 10 + bounce, 2, 2);

  // Body
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 10, py + 15 + bounce, 12, 8);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 19, py + 15 + bounce, 3, 8);

  // Front arm (swings)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 21, py + 16 + bounce - armSwing, 4, 6);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 21, py + 22 + bounce - armSwing, 4, 2);

  // Back arm
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 8, py + 16 + bounce + armSwing, 3, 5);

  // Legs
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 17 + legSwing, py + 23 + bounce, 5, 6);
  ctx.fillStyle = "#2d2d5c";
  ctx.fillRect(px + 10 - legSwing, py + 23 + bounce, 5, 6);

  // Shoes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 17 + legSwing, py + 28 + bounce, 7, 3);
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(px + 10 - legSwing, py + 28 + bounce, 6, 3);
}

// Draw an NPC
export function drawNPC(
  ctx: CanvasRenderingContext2D,
  npc: NPC,
  camX: number,
  camY: number,
  frame: number,
  isNearby: boolean
) {
  const px = npc.x * TILE - camX;
  const py = npc.y * TILE - camY;
  const s = TILE;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(px + s / 2, py + s - 2, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const bob = Math.sin(frame * 0.05) * 1.5;

  // Body
  ctx.fillStyle = npc.color;
  ctx.fillRect(px + 10, py + 12 + bob, 12, 10);

  // Head
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 10, py + 2 + bob, 12, 11);

  // Hair
  ctx.fillStyle = npc.color;
  ctx.fillRect(px + 9, py + bob, 14, 5);

  // Eyes (blink occasionally)
  const blinkCycle = frame % 180;
  if (blinkCycle < 175) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 12, py + 7 + bob, 2, 2);
    ctx.fillRect(px + 18, py + 7 + bob, 2, 2);
    // Eye highlight
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 12, py + 7 + bob, 1, 1);
    ctx.fillRect(px + 18, py + 7 + bob, 1, 1);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 12, py + 8 + bob, 2, 1);
    ctx.fillRect(px + 18, py + 8 + bob, 2, 1);
  }

  // Legs
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 12, py + 22 + bob, 4, 6);
  ctx.fillRect(px + 17, py + 22 + bob, 4, 6);

  // Shoes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 11, py + 28 + bob, 5, 2);
  ctx.fillRect(px + 17, py + 28 + bob, 5, 2);

  // Name tag above NPC
  if (isNearby) {
    // Name background
    const nameWidth = npc.name.length * 6 + 12;
    ctx.fillStyle = "rgba(26,28,44,0.85)";
    ctx.fillRect(px + s / 2 - nameWidth / 2, py - 22, nameWidth, 14);
    ctx.fillStyle = npc.color;
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(npc.name, px + s / 2, py - 12);

    // Exclamation mark
    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 18px monospace";
    ctx.fillText("!", px + s / 2, py - 26);
  }
}

// Draw a tree
export function drawTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Trunk
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(px + 12, py + 16, 8, 16);
  // Trunk highlight
  ctx.fillStyle = "#a06c3a";
  ctx.fillRect(px + 14, py + 16, 3, 16);

  // Canopy layers
  ctx.fillStyle = "#2d6b3e";
  ctx.fillRect(px - 2, py - 4, 36, 22);
  ctx.fillStyle = "#3a8c50";
  ctx.fillRect(px + 2, py - 8, 28, 18);
  ctx.fillStyle = "#4aad62";
  ctx.fillRect(px + 6, py - 10, 20, 12);

  // Highlight
  ctx.fillStyle = "#5bc474";
  ctx.fillRect(px + 8, py - 8, 8, 4);
}

// Draw a fence segment
export function drawFence(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#a0815c";
  ctx.fillRect(px + 2, py + 4, 6, 24);
  ctx.fillRect(px + 24, py + 4, 6, 24);

  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px, py + 8, TILE, 4);
  ctx.fillRect(px, py + 18, TILE, 4);
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
