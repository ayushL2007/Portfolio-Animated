import { portfolioData } from "./game-data";

// Interior tile types
export const FLOOR = 0;
export const WALL = 1;
export const DESK = 2;
export const EXIT_MAT = 3;
export const SHELF = 4;
export const PLANT = 5;
export const RUG = 6;

export const INTERIOR_WIDTH = 10;
export const INTERIOR_HEIGHT = 8;

export interface Receptionist {
  x: number;
  y: number;
  name: string;
  color: string;
  dialogLines: string[];
}

export interface BuildingInterior {
  buildingId: string;
  map: number[][];
  receptionist: Receptionist;
  floorColor: string;
  wallColor: string;
}

function makeInteriorMap(extras?: { shelves?: [number, number][]; plants?: [number, number][]; rugs?: [number, number][] }): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      if (y === 0 || y === 1) {
        map[y][x] = WALL;
      } else {
        map[y][x] = FLOOR;
      }
    }
  }
  // Left and right walls
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    map[y][0] = WALL;
    map[y][INTERIOR_WIDTH - 1] = WALL;
  }
  // Bottom wall with exit
  for (let x = 0; x < INTERIOR_WIDTH; x++) {
    map[INTERIOR_HEIGHT - 1][x] = WALL;
  }
  // Exit mat at bottom center
  map[INTERIOR_HEIGHT - 1][4] = EXIT_MAT;
  map[INTERIOR_HEIGHT - 1][5] = EXIT_MAT;

  // Desk in front of receptionist
  map[3][4] = DESK;
  map[3][5] = DESK;

  // Extras
  if (extras?.shelves) {
    for (const [sx, sy] of extras.shelves) {
      if (sy < INTERIOR_HEIGHT && sx < INTERIOR_WIDTH) map[sy][sx] = SHELF;
    }
  }
  if (extras?.plants) {
    for (const [px, py] of extras.plants) {
      if (py < INTERIOR_HEIGHT && px < INTERIOR_WIDTH) map[py][px] = PLANT;
    }
  }
  if (extras?.rugs) {
    for (const [rx, ry] of extras.rugs) {
      if (ry < INTERIOR_HEIGHT && rx < INTERIOR_WIDTH) map[ry][rx] = RUG;
    }
  }
  return map;
}

const { about, projects, experience, education, skills, contact } = portfolioData;

export const buildingInteriors: Record<string, BuildingInterior> = {
  about: {
    buildingId: "about",
    map: makeInteriorMap({
      shelves: [[1, 1], [2, 1], [7, 1], [8, 1]],
      plants: [[1, 5], [8, 5]],
      rugs: [[4, 5], [5, 5], [4, 6], [5, 6]],
    }),
    receptionist: {
      x: 5,
      y: 2,
      name: "PROF. OAK",
      color: "#5b6ee1",
      dialogLines: [
        `Welcome to my lab! Let me tell you about ${portfolioData.name}.`,
        about.bio,
        about.detail,
        `${portfolioData.name} is a ${portfolioData.title}. ${portfolioData.tagline}!`,
        "That's everything! Come back anytime. Walk to the door mat to leave.",
      ],
    },
    floorColor: "#4a4a6a",
    wallColor: "#5b6ee1",
  },
  projects: {
    buildingId: "projects",
    map: makeInteriorMap({
      shelves: [[1, 1], [2, 1], [3, 1], [6, 1], [7, 1], [8, 1]],
      plants: [[1, 6], [8, 6]],
    }),
    receptionist: {
      x: 5,
      y: 2,
      name: "SHOP CLERK",
      color: "#e83b3b",
      dialogLines: [
        "Welcome to POKE MART! Here we showcase Ayush's best projects.",
        `Project 1: ${projects[0].name} -- ${projects[0].description} Tech: ${projects[0].tech.join(", ")}.`,
        `Project 2: ${projects[1].name} -- ${projects[1].description} Tech: ${projects[1].tech.join(", ")}.`,
        `Project 3: ${projects[2].name} -- ${projects[2].description} Tech: ${projects[2].tech.join(", ")}.`,
        `Project 4: ${projects[3].name} -- ${projects[3].description} Tech: ${projects[3].tech.join(", ")}.`,
        "Those are all the projects! Walk to the door mat to leave.",
      ],
    },
    floorColor: "#5a3a3a",
    wallColor: "#e83b3b",
  },
  skills: {
    buildingId: "skills",
    map: makeInteriorMap({
      shelves: [[1, 1], [2, 1], [7, 1], [8, 1]],
      plants: [[1, 3], [8, 3]],
      rugs: [[3, 5], [4, 5], [5, 5], [6, 5]],
    }),
    receptionist: {
      x: 5,
      y: 2,
      name: "SENSEI",
      color: "#f7de1e",
      dialogLines: [
        "Welcome to the SKILLS DOJO! Let me show you Ayush's arsenal.",
        `Front-end: ${skills.filter(s => ["HTML", "CSS", "JavaScript", "XML"].includes(s.name)).map(s => s.name).join(", ")}.`,
        `Back-end: ${skills.filter(s => ["Ruby", "Rails", "Java", "C"].includes(s.name)).map(s => s.name).join(", ")}.`,
        `Mobile: Android with Java and XML. Systems: Linux/OS and C.`,
        "Ayush is a true full-stack polyglot with deep OS and hardware knowledge!",
        "That covers all the skills. Walk to the door mat to leave.",
      ],
    },
    floorColor: "#5a5a3a",
    wallColor: "#b8a010",
  },
  experience: {
    buildingId: "experience",
    map: makeInteriorMap({
      shelves: [[1, 1], [8, 1]],
      plants: [[1, 6], [8, 6]],
      rugs: [[3, 4], [4, 4], [5, 4], [6, 4]],
    }),
    receptionist: {
      x: 5,
      y: 2,
      name: "GYM LEADER",
      color: "#3ddc84",
      dialogLines: [
        "Welcome, challenger! This gym displays Ayush's battle-tested experience.",
        `Role: ${experience[0].role} at ${experience[0].org} (${experience[0].period}). ${experience[0].description}`,
        `Role: ${experience[1].role} at ${experience[1].org} (${experience[1].period}). ${experience[1].description}`,
        `Role: ${experience[2].role} at ${experience[2].org} (${experience[2].period}). ${experience[2].description}`,
        "Impressive record, right? Walk to the door mat to leave.",
      ],
    },
    floorColor: "#2a4a3a",
    wallColor: "#1a6b3c",
  },
  education: {
    buildingId: "education",
    map: makeInteriorMap({
      shelves: [[1, 1], [2, 1], [3, 1], [6, 1], [7, 1], [8, 1]],
      plants: [[1, 4], [8, 4]],
    }),
    receptionist: {
      x: 5,
      y: 2,
      name: "TEACHER",
      color: "#f89720",
      dialogLines: [
        "Welcome to TRAINER SCHOOL! Let me walk you through Ayush's education.",
        `${education[0].degree} at ${education[0].school} (${education[0].period}). ${education[0].details.join(". ")}.`,
        `${education[1].degree} at ${education[1].school} (${education[1].period}). ${education[1].details.join(". ")}.`,
        `${education[2].degree} at ${education[2].school} (${education[2].period}). ${education[2].details.join(". ")}.`,
        "A solid academic journey! Walk to the door mat to leave.",
      ],
    },
    floorColor: "#4a3a2a",
    wallColor: "#a05a00",
  },
  links: {
    buildingId: "links",
    map: makeInteriorMap({
      shelves: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1]],
      plants: [[1, 6], [8, 6]],
      rugs: [[3, 5], [4, 5], [5, 5], [6, 5]],
    }),
    receptionist: {
      x: 5,
      y: 2,
      name: "LIBRARIAN",
      color: "#5bc4e8",
      dialogLines: [
        "Welcome to the POKE LIBRARY! Here are all of Ayush's important links.",
        `GitHub: ${contact.github} -- Check out all repos and contributions.`,
        `LinkedIn: ${contact.linkedin} -- Professional profile and network.`,
        `Email: ${contact.email} -- Drop a message anytime!`,
        `Portfolio (Rails): github.com/ayushL2007/Portfolio -- The original crystal-tile UI site.`,
        "That's everything! Walk to the door mat to leave.",
      ],
    },
    floorColor: "#2a4a5a",
    wallColor: "#2a7a99",
  },
  contact: {
    buildingId: "contact",
    map: makeInteriorMap({
      plants: [[1, 3], [8, 3], [1, 6], [8, 6]],
      rugs: [[3, 4], [4, 4], [5, 4], [6, 4], [3, 5], [4, 5], [5, 5], [6, 5]],
    }),
    receptionist: {
      x: 5,
      y: 2,
      name: "NURSE JOY",
      color: "#9b59b6",
      dialogLines: [
        `Welcome to the POKEMON CENTER! I can help you get in touch with ${portfolioData.name}.`,
        `GitHub: ${contact.github}`,
        `Email: ${contact.email}`,
        `LinkedIn: ${contact.linkedin}`,
        `${portfolioData.name} is ${portfolioData.tagline} -- don't hesitate to reach out!`,
        "Hope to see you again! Walk to the door mat to leave.",
      ],
    },
    floorColor: "#4a3a5a",
    wallColor: "#5e2d79",
  },
};

// Check if interior tile is walkable
export function isInteriorWalkable(map: number[][], x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= INTERIOR_WIDTH || y >= INTERIOR_HEIGHT) return false;
  const tile = map[y][x];
  return tile === FLOOR || tile === EXIT_MAT || tile === RUG;
}

// Check if player is near the receptionist
export function isNearReceptionist(px: number, py: number, r: Receptionist): boolean {
  const dist = Math.abs(px - r.x) + Math.abs(py - r.y);
  return dist <= 2;
}

// Check if player is on exit mat
export function isOnExitMat(map: number[][], x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= INTERIOR_WIDTH || y >= INTERIOR_HEIGHT) return false;
  return map[y][x] === EXIT_MAT;
}
