# Universal Studios Import Schema

## Purpose

This document turns the Word-based `Universal Studios Florida Hunt Library` into an app-ready authoring format.

The goal is not to replace the narrative docs.
It is to create a structured source layer we can import into:

- a spreadsheet
- Airtable or Notion
- a custom CMS
- this app's future hunt compiler

## Why We Need A Separate Authoring Layer

The current app content model is still optimized for flat challenges and simple hunt groupings.

That works for:

- standalone challenges
- short sampler hunts

It does not yet fully capture:

- route-level metadata
- step order
- expert versus starter status
- operational dependencies like queues, shows, audio, or purchase requirements

It also does not yet fully match current Universal Studios land naming.
The current app `Land` type is missing some real park areas now represented in this authoring layer, including:

- `minion-land`
- `dreamworks-land`
- `world-expo`

The new authoring layer fills that gap without forcing us to rewrite the live app model immediately.

## Recommended Source Files

For Universal Studios authoring, use three CSVs:

1. `routes.csv`
2. `clues.csv`
3. `route_steps.csv`

These files live here:

- [routes.csv](/Users/mikep/Downloads/UORLANDO_SCAV_HUNT/universal-hunt/authoring/universal-studios/routes.csv)
- [clues.csv](/Users/mikep/Downloads/UORLANDO_SCAV_HUNT/universal-hunt/authoring/universal-studios/clues.csv)
- [route_steps.csv](/Users/mikep/Downloads/UORLANDO_SCAV_HUNT/universal-hunt/authoring/universal-studios/route_steps.csv)

## File Roles

### `routes.csv`

One row per mini-hunt or route.

Use it to define:

- route identity
- audience
- difficulty
- route type
- build priority
- start and finale clues

### `clues.csv`

One row per reusable clue.

Use it to define:

- player-facing clue text
- canonical answer
- proof requirement
- difficulty
- operational flags
- whether the clue is safe for mainline use

### `route_steps.csv`

Bridge table that connects clues to routes in order.

Use it to define:

- which clues belong to which route
- route order
- whether a step is optional
- whether it is the opener, middle, finale, or bonus beat

## Status Model

Use these normalized clue statuses:

- `ready-core`
  Stable enough for a first public route.
- `ready-expert`
  Strong clue, but better for expert mode, queue play, or advanced teams.
- `bonus`
  Good optional content, not for the mainline route.
- `variable`
  Depends on performer response, show timing, live ops, ride outcome, or conditions.
- `retired`
  Keep for reference only, not for the evergreen library.

## Core Columns

### `routes.csv`

- `route_id`
- `title`
- `park`
- `primary_land`
- `route_type`
- `audience`
- `difficulty`
- `play_style`
- `estimated_time`
- `build_priority`
- `start_clue_id`
- `final_clue_id`
- `summary`

### `clues.csv`

- `clue_id`
- `park`
- `land`
- `anchor_name`
- `status`
- `difficulty`
- `clue_type`
- `player_clue`
- `canonical_answer`
- `proof_type`
- `accepted_aliases`
- `mainline_default`
- `requires_queue`
- `requires_show`
- `requires_character`
- `requires_ride`
- `requires_purchase`
- `requires_audio`
- `requires_video`
- `ops_notes`

### `route_steps.csv`

- `route_id`
- `clue_id`
- `step_order`
- `step_role`
- `is_optional`

## Mapping To The Current App

This authoring layer should eventually compile into the current app content model like this:

- `routes.csv` -> future `Hunt` records
- `clues.csv` -> future authored `Challenge` records or route-step records
- `route_steps.csv` -> future hunt sequencing / branch metadata

Near-term mapping:

- `title` can map from `anchor_name` or a curated challenge title
- `description` can be derived from `player_clue` plus route summary
- `verification` can map from `proof_type` and the `requires_*` flags
- `availability` can map from ops notes plus queue/show flags

Before direct import into the live app, we should expand the app-side `Land` type to cover the current Universal Studios layout more accurately.

## Phase 1 Seed Scope

This first pass seeds the strongest first-build routes:

- Minion Mischief
- Secrets of Diagon Alley
- DreamWorks Neighborhood Quest
- Hollywood Screen Test

It also defines all Universal Studios route records up front so the rest of the library can be filled in without changing the schema.

## Recommended Next Conversion Order

1. Finish importing New York, Springfield, San Francisco, and World Expo clues into `clues.csv`.
2. Add route-level tags like `family_friendly`, `expert_mode`, and `weather_sensitive`.
3. Add stable coordinates and search radii for each clue anchor.
4. Build a compiler step that converts these CSVs into app content JSON.
5. Turn `Secrets of Diagon Alley` into the first full route implemented in the app.

## Notes

This is intentionally a bridge format.

It is simple enough to edit in a spreadsheet, but structured enough to support:

- future app imports
- ops review
- playtest cleanup
- clue promotion or demotion between core, expert, and bonus tiers
