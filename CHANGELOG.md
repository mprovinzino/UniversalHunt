# Changelog — Universal Hunt

## 2026-03-01 — Session 1: Project Foundation

### Added
- Created React + TypeScript + Vite project
- Installed and configured Tailwind CSS v4 via Vite plugin
- Installed React Router v7 for page navigation
- Set up folder structure: `components/`, `pages/`, `data/`, `hooks/`, `themes/`, `types/`
- **Theme system** with 5 park land color palettes:
  - Wizarding World (purple/gold)
  - Jurassic Park (green/amber)
  - Marvel Super Hero Island (red/blue)
  - Springfield (yellow/blue)
  - Default Universal Orlando (blue/purple)
- **TypeScript types** for Challenge, Park, Land, Difficulty, ThemeKey, etc.
- **challenges.json** with 5 sample challenges across multiple parks and themes
- **useChallenges hook** to load challenge data
- **Bottom tab navigation** with 4 tabs: Home, Map, Challenges, Profile
- **Home page** with welcome hero, stat cards, difficulty breakdown, and CTA button
- **Challenges page** listing all challenges with themed badges
- **Map page** placeholder
- **Profile page** placeholder
- Mobile-first responsive layout with safe-area support for notched phones
