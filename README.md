# 🎬 CineRec: Movie Recommendation System

**An interactive recommendation engine that shows its work.** Rate a few movies, pick your favorite genres, and get personalised suggestions from three different algorithms, each with a clear breakdown of *why* a movie was recommended.

Everything runs in the browser. There is no backend, no API key and no account to create.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **Three recommendation modes**, switchable live:
  - **Content-based:** matches movies to your taste profile using genres, keywords and directors
  - **Collaborative filtering:** finds users with similar taste and predicts what you'd rate a movie
  - **Hybrid:** blends both, with a slider to control the weighting from 0 to 100 %
- **Explain modal:** see exactly how each score was computed (matching genres and keywords, similar users and the ratings they gave, or the hybrid weight breakdown)
- **Rate movies** with 1–5 stars and see recommendations update instantly
- **Genre affinity selector** to solve the cold-start problem before you've rated anything
- **Preset taste profiles** (Sci-Fi Fanatic, Crime & Mystery Buff, Animation Enthusiast and more) for a quick demo
- **Sorting and filtering:** sort by match %, rating or newest release, and hide movies you've already rated
- **Searchable rating catalogue:** find movies by title, director or theme and filter by genre or rated/unrated
- **Saved automatically:** your ratings, genre picks and chosen algorithm persist in `localStorage`

---

## 🧠 How the Algorithms Work

### Content-based filtering
Each movie becomes a weighted feature vector: **genres (2.0)**, **director (1.5)** and **keywords (1.0)**. Your profile is built from your genre affinities plus your ratings, centred around a neutral 3 stars, so a 5-star rating pulls you towards similar movies and a 1-star rating pushes you away. Movies are ranked by **cosine similarity** to that profile.

### Collaborative filtering (user-based)
1. Compare your ratings with each seed user using **Pearson correlation**, with significance weighting so a match based on 2 shared movies counts for less than one based on 6.
2. Keep the **top-k most similar neighbours** (positive correlation only).
3. Predict your rating for each unseen movie as your mean rating plus the similarity-weighted deviation of your neighbours' ratings.

### Hybrid
`final score = (1 − w) × content score + w × collaborative score`, where `w` is set by the slider in the controls panel.

---

## 🚀 Getting Started

**Prerequisites:** Node.js 20 or newer

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |

No environment variables are needed.

---

## 🏗️ Project Structure

```
src/
├── App.tsx                    # State, filters, sorting, layout
├── types.ts                   # Shared TypeScript types
├── algorithms/
│   ├── contentBased.ts        # Feature vectors, user profile, cosine similarity
│   ├── collaborative.ts       # Pearson correlation, neighbours, rating prediction
│   └── recommender.ts         # Runs the chosen mode and blends hybrid scores
├── data/
│   ├── movies.ts              # Movie catalogue (36 titles)
│   └── seedUsers.ts           # 8 seed users and 5 preset taste profiles
└── components/                # Navbar, MovieCard, ExplainModal, AlgorithmControls, ...
```

---

## 🔧 Customising

- **Add movies:** append entries to `src/data/movies.ts`. Each needs `id`, `title`, `year`, `director`, `genres`, `keywords` and image URLs.
- **Add community users:** add ratings (movie id → 1–5) to `SEED_USERS` in `src/data/seedUsers.ts`. More users generally means better collaborative predictions.
- **Tune the algorithms:** feature weights live in `contentBased.ts`, and the neighbour count and significance threshold live in `collaborative.ts`.

---

## ⚠️ Notes

- The catalogue and the community ratings are a **small, hand-written sample dataset**, so the recommendations demonstrate how the algorithms work rather than reflecting real-world viewing habits.
- Poster and backdrop images are loaded from Unsplash and are decorative stock photos, not official movie artwork.

---

## 🧰 Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Lucide Icons
