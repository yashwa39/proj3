import { create } from "zustand";

export type ChallengeDifficulty = "Easy" | "Medium" | "Hard";

export interface Challenge {
  difficulty: ChallengeDifficulty;
  pointsLabel: string;
  label: string;
  savesLabel: string; // e.g. "2.3 kg CO₂"
  done: boolean;
}

interface ChallengesState {
  refreshing: boolean;
  items: Challenge[];
  totalSavedKg: () => number;
  complete: (index: number) => void;
  refresh: () => Promise<void>;
}

const POOL: Challenge[] = [
  {
    difficulty: "Easy",
    pointsLabel: "+45 pts",
    label: "Use digital notes for one week",
    savesLabel: "2.3 kg CO₂",
    done: false,
  },
  {
    difficulty: "Medium",
    pointsLabel: "+120 pts",
    label: "Skip one food delivery this week",
    savesLabel: "5.1 kg CO₂",
    done: false,
  },
  {
    difficulty: "Hard",
    pointsLabel: "+280 pts",
    label: "Work remotely one extra day",
    savesLabel: "12.0 kg CO₂",
    done: false,
  },
  {
    difficulty: "Easy",
    pointsLabel: "+30 pts",
    label: "Dry clothes naturally for 1 week",
    savesLabel: "1.8 kg CO₂",
    done: false,
  },
  {
    difficulty: "Medium",
    pointsLabel: "+90 pts",
    label: "Cut AC by 1 hour daily for a week",
    savesLabel: "4.2 kg CO₂",
    done: false,
  },
];

function parseKg(label: string) {
  const match = label.match(/[\d.]+/);
  const num = match ? Number.parseFloat(match[0]) : 0;
  return Number.isFinite(num) ? num : 0;
}

export const useChallengesStore = create<ChallengesState>((set, get) => ({
  refreshing: false,
  items: POOL.slice(0, 3).map((c) => ({ ...c })),

  totalSavedKg: () => {
    const total = get().items.reduce((sum, c) => {
      if (!c.done) return sum;
      return sum + parseKg(c.savesLabel);
    }, 0);
    return Number.parseFloat(total.toFixed(1));
  },

  complete: (index) => {
    set((state) => {
      const item = state.items[index];
      if (!item || item.done) return state;
      const items = state.items.slice();
      items[index] = { ...item, done: true };
      return { ...state, items };
    });
  },

  refresh: async () => {
    set({ refreshing: true });
    await new Promise((r) => setTimeout(r, 600));
    set((state) => {
      const existingLabels = new Set(state.items.map((i) => i.label));
      const available = POOL.filter((p) => !existingLabels.has(p.label));
      if (available.length === 0) return { ...state, refreshing: false };
      const replacement = available[Math.floor(Math.random() * available.length)];
      const items = state.items.slice();
      items[0] = { ...replacement, done: false };
      return { ...state, items, refreshing: false };
    });
  },
}));
