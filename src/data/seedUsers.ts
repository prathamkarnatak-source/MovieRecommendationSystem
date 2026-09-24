import { SeedUser } from '../types';

export const SEED_USERS: SeedUser[] = [
  {
    id: 'u1',
    name: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    bio: 'Sci-Fi obsessive, cyberpunk aficionado & Christopher Nolan fan.',
    ratings: {
      m1: 5, // Inception
      m2: 5, // Interstellar
      m3: 5, // The Dark Knight
      m5: 5, // Matrix
      m7: 5, // Blade Runner 2049
      m9: 5, // Dune 2
      m15: 5, // Arrival
      m19: 4, // Oppenheimer
      m24: 4, // Alien
      m25: 5, // The Prestige
      m30: 4, // Mad Max
      m36: 5, // Ex Machina
      m4: 3,  // Pulp Fiction
      m18: 2, // La La Land
      m26: 2, // Coco
    },
  },
  {
    id: 'u2',
    name: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bio: 'Crime, noir, detective thrillers and gritty psychological dramas.',
    ratings: {
      m3: 5, // The Dark Knight
      m4: 5, // Pulp Fiction
      m13: 5, // Fight Club
      m14: 5, // Shawshank
      m16: 5, // Se7en
      m22: 4, // Get Out
      m23: 5, // Silence of the Lambs
      m27: 4, // Knives Out
      m28: 5, // Shutter Island
      m29: 5, // GoodFellas
      m1: 4,  // Inception
      m6: 2,  // Spirited Away
      m18: 2, // La La Land
      m26: 1, // Coco
    },
  },
  {
    id: 'u3',
    name: 'Chloe Lin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'Animation director & visual art lover. Studio Ghibli devotee.',
    ratings: {
      m6: 5, // Spirited Away
      m12: 5, // Into the Spider-Verse
      m20: 5, // Princess Mononoke
      m26: 5, // Coco
      m35: 5, // Across the Spider-Verse
      m11: 5, // Grand Budapest
      m17: 5, // Everything Everywhere
      m18: 4, // La La Land
      m2: 4,  // Interstellar
      m31: 4, // Her
      m23: 1, // Silence of the Lambs
      m16: 2, // Se7en
      m24: 1, // Alien
    },
  },
  {
    id: 'u4',
    name: 'Julian Sterling',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bio: 'High-octane action, post-apocalyptic spectacles & visceral cinema.',
    ratings: {
      m1: 5, // Inception
      m3: 5, // The Dark Knight
      m5: 5, // Matrix
      m9: 5, // Dune 2
      m21: 5, // Gladiator
      m30: 5, // Mad Max: Fury Road
      m32: 5, // Inglourious Basterds
      m12: 4, // Spider-Verse
      m24: 4, // Alien
      m4: 4,  // Pulp Fiction
      m18: 1, // La La Land
      m31: 2, // Her
      m34: 2, // Truman Show
    },
  },
  {
    id: 'u5',
    name: 'Amara Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    bio: 'Philosophical indie dramas, emotional existential journeys and romance.',
    ratings: {
      m8: 5, // Parasite
      m10: 5, // Whiplash
      m14: 5, // Shawshank
      m15: 5, // Arrival
      m18: 5, // La La Land
      m31: 5, // Her
      m34: 5, // Truman Show
      m17: 4, // Everything Everywhere
      m11: 4, // Grand Budapest
      m25: 4, // Prestige
      m21: 2, // Gladiator
      m30: 2, // Mad Max
      m24: 1, // Alien
    },
  },
  {
    id: 'u6',
    name: 'David Moreau',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    bio: 'Horror, chilling psychological tension, and mystery twists.',
    ratings: {
      m7: 4, // Blade Runner 2049
      m16: 5, // Se7en
      m22: 5, // Get Out
      m23: 5, // Silence of the Lambs
      m24: 5, // Alien
      m28: 5, // Shutter Island
      m33: 5, // A Quiet Place
      m36: 4, // Ex Machina
      m8: 4,  // Parasite
      m13: 4, // Fight Club
      m26: 1, // Coco
      m18: 1, // La La Land
      m11: 2, // Grand Budapest
    },
  },
  {
    id: 'u7',
    name: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    bio: 'Mainstream blockbuster fan, loves Nolan, super-heroes & epics.',
    ratings: {
      m1: 5, // Inception
      m2: 5, // Interstellar
      m3: 5, // The Dark Knight
      m9: 5, // Dune 2
      m12: 5, // Spider-Verse
      m19: 5, // Oppenheimer
      m21: 4, // Gladiator
      m25: 4, // The Prestige
      m27: 4, // Knives Out
      m35: 5, // Across Spider-Verse
      m16: 3, // Se7en
      m24: 2, // Alien
      m29: 3, // GoodFellas
    },
  },
  {
    id: 'u8',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    bio: 'Auteur cinema & complex philosophical storylines.',
    ratings: {
      m2: 4, // Interstellar
      m6: 5, // Spirited Away
      m7: 5, // Blade Runner 2049
      m8: 5, // Parasite
      m10: 5, // Whiplash
      m15: 5, // Arrival
      m17: 5, // Everything Everywhere
      m20: 5, // Princess Mononoke
      m31: 5, // Her
      m36: 5, // Ex Machina
      m21: 2, // Gladiator
      m30: 3, // Mad Max
    },
  }
];

// Preset demo user profiles that the user can immediately switch to
export interface PresetProfile {
  id: string;
  name: string;
  tagline: string;
  genreAffinities: Record<string, number>;
  initialRatings: Record<string, number>;
}

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'preset-scifi',
    name: 'Sci-Fi Fanatic',
    tagline: 'Loves mind-bending concepts, space epics & AI',
    genreAffinities: { 'Sci-Fi': 5, 'Mystery': 4, 'Action': 3, 'Drama': 3 },
    initialRatings: {
      m1: 5, // Inception
      m2: 5, // Interstellar
      m5: 5, // The Matrix
      m7: 5, // Blade Runner 2049
      m15: 5, // Arrival
    },
  },
  {
    id: 'preset-noir',
    name: 'Crime & Mystery Buff',
    tagline: 'Drawn to plot twists, moral dilemmas & detectives',
    genreAffinities: { 'Crime': 5, 'Thriller': 5, 'Mystery': 5, 'Drama': 4 },
    initialRatings: {
      m4: 5, // Pulp Fiction
      m16: 5, // Se7en
      m23: 5, // Silence of the Lambs
      m28: 5, // Shutter Island
      m29: 4, // GoodFellas
    },
  },
  {
    id: 'preset-anim',
    name: 'Animation Enthusiast',
    tagline: 'Passionate about Miyazaki, Spider-Verse & heartfelt storytelling',
    genreAffinities: { 'Animation': 5, 'Fantasy': 5, 'Adventure': 4, 'Comedy': 3 },
    initialRatings: {
      m6: 5, // Spirited Away
      m12: 5, // Spider-Verse
      m20: 5, // Princess Mononoke
      m26: 5, // Coco
    },
  },
  {
    id: 'preset-drama',
    name: 'Drama & Character Seeker',
    tagline: 'Deep human emotions, musical artistry & romance',
    genreAffinities: { 'Drama': 5, 'Romance': 4, 'Comedy': 3 },
    initialRatings: {
      m8: 5, // Parasite
      m10: 5, // Whiplash
      m14: 5, // Shawshank Redemption
      m18: 5, // La La Land
      m31: 4, // Her
    },
  },
  {
    id: 'preset-cold',
    name: 'Cold Start (New User)',
    tagline: 'No movie ratings yet — purely driven by selected genre tags',
    genreAffinities: { 'Sci-Fi': 4, 'Action': 4 },
    initialRatings: {},
  },
];
