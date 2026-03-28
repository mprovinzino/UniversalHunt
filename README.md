# Universal Hunt

A location-based scavenger hunt game inspired by Pokemon Go and park exploration, currently focused on Universal Orlando's Universal Studios Florida and Islands of Adventure.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Mapbox GL JS
- Local `localStorage` progress persistence

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Add your public Mapbox token to `.env`:

```bash
VITE_MAPBOX_TOKEN=your_token_here
```

4. Start the app:

```bash
npm run dev
```

## Project Structure

```text
src/
  components/      Reusable UI pieces
  content/         Game content split into smaller authoring files
  context/         App-wide providers
  data/            Static support data like parks and levels
  hooks/           Shared hooks for content and player progress
  pages/           Route screens
  themes/          Park and land theming
  types/           Core domain types
```

## Content Authoring

Scavenger hunt content now lives under `src/content/` instead of one large JSON file.

- `src/content/challenges/` holds challenge definitions by park
- `src/content/hunts/` holds hunt definitions by park or resort scope
- `src/content/index.ts` merges and validates everything at build time

### Supported content fields

Challenges support future-ready authoring fields like:

- `status`: `active`, `draft`, or `retired`
- `featured`: whether to prioritize this in the UI later
- `verification`: hints for photo, location, timer, or cast interaction validation
- `availability`: notes for operational, weather, or schedule-sensitive content

Hunts support:

- `status`
- `featured`
- `unlockChallengeIds`

### Draft workflow

If you want to prepare content without showing it in the app yet, set:

```json
"status": "draft"
```

Draft content stays in the repository but is filtered out of the live app.

## Quality Checks

Run these before publishing changes:

```bash
npm run lint
npm run build
```

## Git Setup

This project is intended to be tracked in Git with:

- `.env` ignored so secrets stay local
- `dist/` and `node_modules/` ignored
- source content and app code committed

If you want to connect it to GitHub after local setup:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

## Browser And Mobile-Friendly Setup

This repo includes `.devcontainer/devcontainer.json` so GitHub Codespaces can boot with:

- Node preinstalled
- dependencies installed automatically
- the Vite dev server started on port `5173`
- a forwarded preview port

That makes browser-based editing much more realistic on an iPad, tablet, or even a phone in a pinch.

## Mobile Editing Reality Check

Yes, mobile editing is possible, but there are different levels:

- Best for quick content edits:
  Edit the JSON files in `src/content/` through GitHub's web editor or mobile-friendly repo tools.
- Good for light code changes:
  Use a cloud dev environment tied to GitHub so you can edit TypeScript from a browser on a phone or tablet.
- Worst for full local development:
  Running the whole React + Mapbox workflow directly on a phone is possible in niche setups, but it is usually frustrating.

The easiest future-proof path is:

1. Keep game data in small content files.
2. Store the project in GitHub.
3. Use mobile for content edits and desktop for heavier UI or map work.

## Best Next Expansions

- Add richer completion verification for GPS, photos, and timed objectives
- Add a synced backend for player accounts and progress
- Add more park content, including unlockable and seasonal hunts
- Add an admin-friendly authoring workflow for non-code content updates
