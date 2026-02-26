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

  // Base grass
  ctx.fillStyle = "#4a7c59";
  ctx.fillRect(px, py, TILE, TILE);

  // Grass blades (deterministic from position)
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

  // Flower accent (rare)
  if ((x * 3 + y * 11) % 17 === 0) {
    ctx.fillStyle = "#e8c170";
    ctx.fillRect(px + 14, py + 14, 4, 4);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 12, py + 14, 2, 2);
    ctx.fillRect(px + 18, py + 14, 2, 2);
    ctx.fillRect(px + 14, py + 12, 2, 2);
    ctx.fillRect(px + 14, py + 18, 2, 2);
  }

  // Grid line (subtle)
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(px, py, TILE, 1);
  ctx.fillRect(px, py, 1, TILE);
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

  // Dirt texture
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

  // Edge stones
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

  // Building border (pixel style)
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);

  // Roof (triangular pixel roof)
  const roofHeight = TILE * 1.5;
  ctx.fillStyle = building.roofColor;
  // Flat roof with overhang
  ctx.fillRect(bx - 4, by - roofHeight, bw + 8, roofHeight);
  // Roof ridge
  ctx.fillStyle = shadeColor(building.roofColor, -20);
  ctx.fillRect(bx - 4, by - roofHeight, bw + 8, 4);
  ctx.fillRect(bx - 4, by - 4, bw + 8, 4);

  // Windows (pixel squares)
  ctx.fillStyle = isNearby ? "#ffffaa" : "#87ceeb";
  const windowSize = 10;
  const windowY = by + TILE * 0.8;
  // Left window
  ctx.fillRect(bx + TILE * 0.6, windowY, windowSize, windowSize);
  // Right window
  ctx.fillRect(bx + bw - TILE * 0.6 - windowSize, windowY, windowSize, windowSize);
  // Window frame
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(bx + TILE * 0.6 + windowSize / 2 - 1, windowY, 2, windowSize);
  ctx.fillRect(bx + TILE * 0.6, windowY + windowSize / 2 - 1, windowSize, 2);
  ctx.fillRect(
    bx + bw - TILE * 0.6 - windowSize + windowSize / 2 - 1,
    windowY,
    2,
    windowSize
  );
  ctx.fillRect(
    bx + bw - TILE * 0.6 - windowSize,
    windowY + windowSize / 2 - 1,
    windowSize,
    2
  );

  // Door
  const doorW = TILE * 0.8;
  const doorH = TILE * 1.2;
  const doorX = bx + bw / 2 - doorW / 2;
  const doorY = by + bh - doorH;
  ctx.fillStyle = building.doorColor;
  ctx.fillRect(doorX, doorY, doorW, doorH);
  // Door knob
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(doorX + doorW - 8, doorY + doorH / 2, 4, 4);
  // Door frame
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  // Sign text above building
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(bx + bw / 2 - 50, by - roofHeight - 24, 100, 20);
  ctx.fillStyle = "#e8c170";
  ctx.fillRect(bx + bw / 2 - 52, by - roofHeight - 26, 104, 24);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(bx + bw / 2 - 50, by - roofHeight - 24, 100, 20);

  ctx.fillStyle = "#e8c170";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText(building.signText, bx + bw / 2, by - roofHeight - 10);

  // Glow effect when nearby
  if (isNearby) {
    ctx.strokeStyle = "#e8c170";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(bx - 4, by - roofHeight - 28, bw + 8, bh + roofHeight + 32);
    ctx.setLineDash([]);

    // "ENTER" prompt
    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("[ SPACE / ENTER ]", bx + bw / 2, by + bh + 18);
  }
}

// Draw the player character (pixel art trainer)
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  direction: number,
  frame: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;
  const s = TILE;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(px + s / 2, py + s - 2, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = "#e83b3b"; // Red shirt (like Red from Pokemon)
  ctx.fillRect(px + 8, py + 12, 16, 10);

  // Arms with walk cycle
  const armOffset = Math.sin(frame * 0.3) * 2;
  ctx.fillRect(px + 4, py + 14 + armOffset, 4, 6);
  ctx.fillRect(px + 24, py + 14 - armOffset, 4, 6);

  // Legs with walk cycle
  ctx.fillStyle = "#3f3f74"; // Dark pants
  const legOffset = Math.sin(frame * 0.3) * 3;
  ctx.fillRect(px + 10, py + 22, 5, 8 + legOffset);
  ctx.fillRect(px + 17, py + 22, 5, 8 - legOffset);

  // Shoes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 9, py + 28 + Math.max(0, legOffset), 6, 3);
  ctx.fillRect(px + 17, py + 28 + Math.max(0, -legOffset), 6, 3);

  // Head
  ctx.fillStyle = "#f4d7a7"; // Skin
  ctx.fillRect(px + 9, py + 2, 14, 12);

  // Hair (black, spiky)
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 8, py, 16, 6);
  ctx.fillRect(px + 7, py + 1, 2, 4);
  ctx.fillRect(px + 23, py + 1, 2, 4);

  // Hat (red cap like Pokemon trainer)
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 6, py - 2, 20, 5);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 6, py + 2, 20, 2);

  // Eyes based on direction
  ctx.fillStyle = "#1a1c2c";
  if (direction === 0) {
    // Down
    ctx.fillRect(px + 12, py + 7, 3, 3);
    ctx.fillRect(px + 18, py + 7, 3, 3);
  } else if (direction === 1) {
    // Up - show back of head
    ctx.fillStyle = "#2d3436";
    ctx.fillRect(px + 9, py + 4, 14, 8);
  } else if (direction === 2) {
    // Left
    ctx.fillRect(px + 10, py + 7, 3, 3);
    ctx.fillRect(px + 16, py + 7, 3, 3);
  } else {
    // Right
    ctx.fillRect(px + 14, py + 7, 3, 3);
    ctx.fillRect(px + 20, py + 7, 3, 3);
  }
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

  // Idle bob
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

  // Eyes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 12, py + 7 + bob, 2, 2);
  ctx.fillRect(px + 18, py + 7 + bob, 2, 2);

  // Legs
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 12, py + 22 + bob, 4, 6);
  ctx.fillRect(px + 17, py + 22 + bob, 4, 6);

  // Exclamation mark if nearby
  if (isNearby) {
    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("!", px + s / 2, py - 6);
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

  // Canopy (layered circles of green)
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

  // Posts
  ctx.fillStyle = "#a0815c";
  ctx.fillRect(px + 2, py + 4, 6, 24);
  ctx.fillRect(px + 24, py + 4, 6, 24);

  // Rails
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
