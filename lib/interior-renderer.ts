import {
  FLOOR,
  WALL,
  DESK,
  EXIT_MAT,
  SHELF,
  PLANT,
  RUG,
  INTERIOR_WIDTH,
  INTERIOR_HEIGHT,
  type BuildingInterior,
  type Receptionist,
} from "./interior-data";

const TILE = 32;

export function drawInteriorFloor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  floorColor: string
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = floorColor;
  ctx.fillRect(px, py, TILE, TILE);

  // Checkerboard pattern
  if ((x + y) % 2 === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(px, py, TILE, TILE);
  } else {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(px, py, TILE, TILE);
  }

  // Grid lines
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(px, py, TILE, 1);
  ctx.fillRect(px, py, 1, TILE);
}

export function drawInteriorWall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  wallColor: string
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = wallColor;
  ctx.fillRect(px, py, TILE, TILE);

  // Brick pattern
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  const brickH = 8;
  for (let by = 0; by < TILE; by += brickH) {
    ctx.fillRect(px, py + by, TILE, 1);
    const offset = (Math.floor(by / brickH) % 2) * 16;
    ctx.fillRect(px + offset, py + by, 1, brickH);
    ctx.fillRect(px + offset + 16, py + by, 1, brickH);
  }

  // Shadow at bottom of wall
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(px, py + TILE - 3, TILE, 3);
}

export function drawDesk(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Desk surface
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(px + 1, py + 4, TILE - 2, TILE - 6);

  // Desk top highlight
  ctx.fillStyle = "#a06c3a";
  ctx.fillRect(px + 2, py + 5, TILE - 4, 4);

  // Desk legs
  ctx.fillStyle = "#6b3a1b";
  ctx.fillRect(px + 2, py + TILE - 4, 4, 4);
  ctx.fillRect(px + TILE - 6, py + TILE - 4, 4, 4);

  // Items on desk (papers/computer)
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 6, py + 6, 8, 6);
  ctx.fillStyle = "#3a3f5c";
  ctx.fillRect(px + 7, py + 7, 6, 4);

  // Pencil
  ctx.fillStyle = "#f7de1e";
  ctx.fillRect(px + 18, py + 8, 6, 2);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 17, py + 8, 2, 2);
}

export function drawExitMat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  frame: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Mat base
  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px, py, TILE, TILE);

  // Mat pattern
  ctx.fillStyle = "#a88c4c";
  ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);

  // Arrow pointing down (exit)
  const pulse = Math.sin(frame * 0.08) > 0;
  ctx.fillStyle = pulse ? "#e8c170" : "#e83b3b";
  // Arrow body
  ctx.fillRect(px + 13, py + 6, 6, 12);
  // Arrow head
  ctx.fillRect(px + 9, py + 16, 14, 3);
  ctx.fillRect(px + 11, py + 19, 10, 3);
  ctx.fillRect(px + 13, py + 22, 6, 3);

  // "EXIT" text
  ctx.fillStyle = "#1a1c2c";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText("EXIT", px + TILE / 2, py + TILE - 2);
}

export function drawShelf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Shelf background (darker wall)
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px, py, TILE, TILE);

  // Shelf planks
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(px + 1, py + 8, TILE - 2, 3);
  ctx.fillRect(px + 1, py + 20, TILE - 2, 3);

  // Books/items on shelves
  const seed = x * 7 + y * 3;
  const colors = ["#e83b3b", "#5b6ee1", "#3ddc84", "#f7de1e", "#9b59b6"];
  // Top shelf items
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = colors[(seed + i) % colors.length];
    ctx.fillRect(px + 3 + i * 7, py + 2, 5, 6);
  }
  // Bottom shelf items
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = colors[(seed + i + 2) % colors.length];
    ctx.fillRect(px + 4 + i * 8, py + 12, 6, 8);
  }
}

export function drawPlant(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  floorColor: string
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Floor underneath
  ctx.fillStyle = floorColor;
  ctx.fillRect(px, py, TILE, TILE);
  if ((x + y) % 2 === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(px, py, TILE, TILE);
  }

  // Pot
  ctx.fillStyle = "#b05a2a";
  ctx.fillRect(px + 8, py + 20, 16, 10);
  ctx.fillStyle = "#8b4a1a";
  ctx.fillRect(px + 6, py + 18, 20, 4);

  // Soil
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(px + 9, py + 18, 14, 3);

  // Plant leaves
  ctx.fillStyle = "#3a8c50";
  ctx.fillRect(px + 12, py + 6, 8, 12);
  ctx.fillRect(px + 8, py + 8, 16, 8);
  ctx.fillStyle = "#4aad62";
  ctx.fillRect(px + 10, py + 4, 6, 8);
  ctx.fillRect(px + 14, py + 6, 6, 8);
  ctx.fillStyle = "#5bc474";
  ctx.fillRect(px + 12, py + 6, 4, 4);
}

export function drawRug(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  floorColor: string
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  // Floor underneath
  ctx.fillStyle = floorColor;
  ctx.fillRect(px, py, TILE, TILE);

  // Rug
  ctx.fillStyle = "#8b2020";
  ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
  ctx.fillStyle = "#a03030";
  ctx.fillRect(px + 3, py + 3, TILE - 6, TILE - 6);

  // Rug pattern
  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px + 5, py + 5, TILE - 10, TILE - 10);
  ctx.fillStyle = "#a03030";
  ctx.fillRect(px + 7, py + 7, TILE - 14, TILE - 14);
}

export function drawReceptionist(
  ctx: CanvasRenderingContext2D,
  r: Receptionist,
  camX: number,
  camY: number,
  frame: number,
  isNearby: boolean
) {
  const px = r.x * TILE - camX;
  const py = r.y * TILE - camY;
  const s = TILE;

  const bob = Math.sin(frame * 0.04) * 1;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(px + s / 2, py + s - 2, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = r.color;
  ctx.fillRect(px + 10, py + 12 + bob, 12, 10);

  // Head
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 10, py + 2 + bob, 12, 11);

  // Hair
  ctx.fillStyle = r.color;
  ctx.fillRect(px + 9, py + bob, 14, 5);
  // Hair sides
  ctx.fillRect(px + 8, py + 2 + bob, 3, 6);
  ctx.fillRect(px + 21, py + 2 + bob, 3, 6);

  // Eyes (blink)
  const blinkCycle = frame % 200;
  if (blinkCycle < 195) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 12, py + 7 + bob, 3, 3);
    ctx.fillRect(px + 18, py + 7 + bob, 3, 3);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 13, py + 7 + bob, 1, 1);
    ctx.fillRect(px + 19, py + 7 + bob, 1, 1);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 12, py + 8 + bob, 3, 1);
    ctx.fillRect(px + 18, py + 8 + bob, 3, 1);
  }

  // Smile
  ctx.fillStyle = "#c4956a";
  ctx.fillRect(px + 14, py + 10 + bob, 4, 1);
  ctx.fillRect(px + 13, py + 11 + bob, 1, 1);
  ctx.fillRect(px + 18, py + 11 + bob, 1, 1);

  // Arms resting on desk
  ctx.fillStyle = r.color;
  ctx.fillRect(px + 6, py + 14 + bob, 4, 6);
  ctx.fillRect(px + 22, py + 14 + bob, 4, 6);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 6, py + 20 + bob, 4, 2);
  ctx.fillRect(px + 22, py + 20 + bob, 4, 2);

  // Name tag + exclamation when nearby
  if (isNearby) {
    const nameWidth = r.name.length * 6 + 12;
    ctx.fillStyle = "rgba(26,28,44,0.9)";
    ctx.fillRect(px + s / 2 - nameWidth / 2, py - 20, nameWidth, 14);
    ctx.fillStyle = r.color;
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(r.name, px + s / 2, py - 10);

    // Exclamation
    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 18px monospace";
    ctx.fillText("!", px + s / 2, py - 24);

    // Interaction hint
    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 9px monospace";
    ctx.fillText("[ SPACE ]", px + s / 2, py + s + 14);
  }
}

// Draw the full interior scene
export function drawInterior(
  ctx: CanvasRenderingContext2D,
  interior: BuildingInterior,
  camX: number,
  camY: number,
  frame: number,
  playerX: number,
  playerY: number
) {
  const map = interior.map;
  const isNear = isNearReceptionistCheck(playerX, playerY, interior.receptionist);

  // Draw all tiles
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      const tile = map[y][x];
      switch (tile) {
        case FLOOR:
          drawInteriorFloor(ctx, x, y, camX, camY, interior.floorColor);
          break;
        case WALL:
          drawInteriorWall(ctx, x, y, camX, camY, interior.wallColor);
          break;
        case DESK:
          drawInteriorFloor(ctx, x, y, camX, camY, interior.floorColor);
          drawDesk(ctx, x, y, camX, camY);
          break;
        case EXIT_MAT:
          drawExitMat(ctx, x, y, camX, camY, frame);
          break;
        case SHELF:
          drawShelf(ctx, x, y, camX, camY);
          break;
        case PLANT:
          drawPlant(ctx, x, y, camX, camY, interior.floorColor);
          break;
        case RUG:
          drawRug(ctx, x, y, camX, camY, interior.floorColor);
          break;
      }
    }
  }

  // Draw receptionist
  drawReceptionist(ctx, interior.receptionist, camX, camY, frame, isNear);

  // Draw building name at top
  const totalW = INTERIOR_WIDTH * TILE;
  const centerX = totalW / 2 - camX;
  ctx.fillStyle = "rgba(26,28,44,0.8)";
  const labelW = 180;
  ctx.fillRect(centerX - labelW / 2, 6 - camY, labelW, 18);
  ctx.fillStyle = "#e8c170";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    interior.buildingId.toUpperCase(),
    centerX,
    18 - camY
  );
}

function isNearReceptionistCheck(px: number, py: number, r: Receptionist): boolean {
  const dist = Math.abs(px - r.x) + Math.abs(py - r.y);
  return dist <= 2;
}
