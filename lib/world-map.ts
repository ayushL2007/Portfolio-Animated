import { buildings } from "./game-data";

// Tile types
export const GRASS = 0;
export const PATH = 1;
export const BUILDING = 2;
export const TREE = 3;
export const FENCE = 4;
export const WATER = 5;
export const FLOWER_PATCH = 6;

export const MAP_WIDTH = 32;
export const MAP_HEIGHT = 28;

// Generate the world map
export function generateMap(): number[][] {
  const map: number[][] = [];

  // Fill with grass
  for (let y = 0; y < MAP_HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      map[y][x] = GRASS;
    }
  }

  // Place buildings on the map
  for (const b of buildings) {
    for (let dy = 0; dy < b.height; dy++) {
      for (let dx = 0; dx < b.width; dx++) {
        if (b.y + dy < MAP_HEIGHT && b.x + dx < MAP_WIDTH) {
          map[b.y + dy][b.x + dx] = BUILDING;
        }
      }
    }
  }

  // === MAIN ROADS ===
  // Horizontal main road (wide, two-lane)
  for (let x = 1; x < MAP_WIDTH - 1; x++) {
    if (map[9][x] === GRASS) map[9][x] = PATH;
    if (map[10][x] === GRASS) map[10][x] = PATH;
  }

  // Secondary horizontal road (south area)
  for (let x = 5; x < MAP_WIDTH - 3; x++) {
    if (map[18][x] === GRASS) map[18][x] = PATH;
    if (map[19][x] === GRASS) map[19][x] = PATH;
  }

  // === VERTICAL PATHS ===
  // Left column path (connects about + experience)
  for (let y = 3; y < 19; y++) {
    if (map[y][5] === GRASS) map[y][5] = PATH;
    if (map[y][6] === GRASS) map[y][6] = PATH;
  }

  // Center-left column path (connects projects + education)
  for (let y = 2; y < 19; y++) {
    if (map[y][14] === GRASS) map[y][14] = PATH;
    if (map[y][15] === GRASS) map[y][15] = PATH;
  }

  // Right column path (connects skills + links)
  for (let y = 3; y < 19; y++) {
    if (map[y][24] === GRASS) map[y][24] = PATH;
    if (map[y][25] === GRASS) map[y][25] = PATH;
  }

  // Path to contact building (south center)
  for (let y = 19; y < 24; y++) {
    if (map[y][14] === GRASS) map[y][14] = PATH;
    if (map[y][15] === GRASS) map[y][15] = PATH;
  }

  // === WATER FEATURES ===
  // Pond on the east side
  const pondCenterX = 29;
  const pondCenterY = 5;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const wy = pondCenterY + dy;
      const wx = pondCenterX + dx;
      if (wy >= 0 && wy < MAP_HEIGHT && wx >= 0 && wx < MAP_WIDTH && map[wy][wx] === GRASS) {
        map[wy][wx] = WATER;
      }
    }
  }
  // Extra water tiles for natural shape
  if (map[5][28] === GRASS) map[5][28] = WATER;
  if (map[4][30] === GRASS) map[4][30] = WATER;
  if (map[5][30] === GRASS) map[5][30] = WATER;
  if (map[6][30] === GRASS) map[6][30] = WATER;

  // Small stream bottom-left
  for (let x = 0; x < 4; x++) {
    if (map[25][x] === GRASS) map[25][x] = WATER;
    if (map[26][x] === GRASS) map[26][x] = WATER;
  }

  // === FLOWER PATCHES ===
  const flowerPositions = [
    [10, 4], [11, 5], [19, 3], [20, 4],
    [10, 14], [11, 13], [19, 14], [20, 15],
    [8, 22], [9, 23], [21, 22], [22, 23],
  ];
  for (const [fx, fy] of flowerPositions) {
    if (fy < MAP_HEIGHT && fx < MAP_WIDTH && map[fy][fx] === GRASS) {
      map[fy][fx] = FLOWER_PATCH;
    }
  }

  // === TREES ===
  const treePositions = [
    // Top border
    [0, 0], [1, 0], [2, 0], [8, 0], [9, 0], [10, 0], [19, 0], [20, 0],
    [26, 0], [27, 0], [28, 0], [31, 0],
    [0, 1], [1, 1], [10, 1], [20, 1], [27, 1], [31, 1],
    // Left border
    [0, 2], [0, 3], [0, 5], [0, 6], [0, 7], [0, 10], [0, 12], [0, 14], [0, 16], [0, 18], [0, 20], [0, 22],
    [1, 5], [1, 10], [1, 14], [1, 18], [1, 22],
    // Right border
    [31, 2], [31, 4], [31, 8], [31, 10], [31, 12], [31, 14], [31, 16], [31, 18], [31, 20], [31, 22],
    [30, 10], [30, 14], [30, 18], [30, 22],
    // Bottom border
    [0, 27], [1, 27], [2, 27], [3, 27], [4, 27], [5, 27], [6, 27], [7, 27],
    [20, 27], [21, 27], [22, 27], [23, 27], [24, 27], [25, 27], [26, 27], [27, 27], [28, 27], [29, 27], [30, 27], [31, 27],
    // Interior decorative trees
    [2, 9], [28, 9], [2, 18], [28, 18],
    [9, 1], [21, 1],
    [2, 21], [3, 22], [28, 21], [29, 22],
    [8, 25], [9, 25], [10, 25], [20, 25], [21, 25], [22, 25],
    // Park area bottom-center
    [13, 26], [14, 26], [15, 26], [16, 26], [17, 26],
    // Scattered interior
    [10, 11], [20, 7], [27, 14], [3, 20],
    [29, 16], [30, 16],
  ];

  for (const [tx, ty] of treePositions) {
    if (ty < MAP_HEIGHT && tx < MAP_WIDTH && map[ty][tx] === GRASS) {
      map[ty][tx] = TREE;
    }
  }

  // === FENCES ===
  const fencePositions = [
    // Along main road decorations
    [1, 8], [2, 8], [3, 8], [27, 8], [28, 8], [29, 8],
    [1, 11], [2, 11], [27, 11], [28, 11], [29, 11],
    // Near pond
    [27, 3], [28, 3], [27, 7], [28, 7],
    // South area
    [5, 17], [6, 17], [24, 17], [25, 17],
  ];

  for (const [fx, fy] of fencePositions) {
    if (fy < MAP_HEIGHT && fx < MAP_WIDTH && map[fy][fx] === GRASS) {
      map[fy][fx] = FENCE;
    }
  }

  return map;
}

// Check if a tile is walkable
export function isWalkable(map: number[][], x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
  const tile = map[y][x];
  return tile === GRASS || tile === PATH || tile === FLOWER_PATCH;
}

// Check if player is near a building door
export function getNearbyBuilding(
  px: number,
  py: number
): (typeof buildings)[number] | null {
  for (const b of buildings) {
    const doorX = b.x + Math.floor(b.width / 2);
    const doorY = b.y + b.height;
    const dist = Math.abs(px - doorX) + Math.abs(py - doorY);
    if (dist <= 2) return b;
  }
  return null;
}

// Get nearby NPC
import { npcs } from "./game-data";

export function getNearbyNPC(
  px: number,
  py: number
): (typeof npcs)[number] | null {
  for (const npc of npcs) {
    const dist = Math.abs(px - npc.x) + Math.abs(py - npc.y);
    if (dist <= 1.5) return npc;
  }
  return null;
}
