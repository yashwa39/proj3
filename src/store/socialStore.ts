import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface SocialPost {
  user: string;
  initial: string;
  tag: "Transport" | "Energy" | "Diet" | "Shopping" | "Other";
  text: string;
  savesKgPerMonth: number;
  adoptedCount: number;
  adopted: boolean;
}

interface SocialState {
  baselineKg: number;
  posts: SocialPost[];

  getCommunityTotalKg: () => number;
  adopt: (index: number) => void;
  addPost: (post: Omit<SocialPost, "adoptedCount" | "adopted">) => void;
}

const initialPosts: SocialPost[] = [
  {
    user: "@priya_delhi",
    initial: "P",
    tag: "Transport",
    text: "Switched to drying clothes naturally instead of the dryer. Saving more than expected!",
    savesKgPerMonth: 4.2,
    adoptedCount: 312,
    adopted: false,
  },
  {
    user: "@rahul_blr",
    initial: "R",
    tag: "Energy",
    text: "Turned off devices at the power strip every night. Zero standby waste now.",
    savesKgPerMonth: 1.8,
    adoptedCount: 891,
    adopted: false,
  },
  {
    user: "@meera_mum",
    initial: "M",
    tag: "Diet",
    text: "One meat-free day per week for the whole family. Kids actually love the dals more now.",
    savesKgPerMonth: 7.6,
    adoptedCount: 1204,
    adopted: false,
  },
];

export const useSocialStore = create<SocialState>()(
  subscribeWithSelector((set, get) => ({
    baselineKg: 42180.5,
    posts: initialPosts,

    getCommunityTotalKg: () => {
      const adopted = get().posts.reduce((sum, p) => {
        if (!p.adopted) return sum;
        return sum + (Number.isFinite(p.savesKgPerMonth) ? p.savesKgPerMonth : 0);
      }, 0);
      return get().baselineKg + adopted;
    },

    adopt: (index) => {
      set((state) => {
        const post = state.posts[index];
        if (!post || post.adopted) return state;
        const posts = state.posts.slice();
        posts[index] = {
          ...post,
          adopted: true,
          adoptedCount: post.adoptedCount + 1,
        };
        return { ...state, posts };
      });
    },

    addPost: (post) => {
      set((state) => ({
        ...state,
        posts: [
          {
            ...post,
            adopted: false,
            adoptedCount: 0,
          },
          ...state.posts,
        ],
      }));
    },
  })),
);
