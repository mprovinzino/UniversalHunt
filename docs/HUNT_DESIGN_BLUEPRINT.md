# Universal Hunt Design Blueprint

## Purpose

This document is the first structured design pass for the game layer of Universal Hunt.
It defines:

- the three primary resort play zones
- hunt types and difficulty tiers
- how clue chains should work
- where branching and team competition should live
- what we should build next in the app and content system

The current focus is the Universal Orlando resort core:

- Universal Islands of Adventure
- Universal Studios Florida
- CityWalk

These three zones should support both:

- self-contained play
- one larger cross-zone "resort epic" hunt

## Core Design Goals

- Make the app instantly understandable: this is a scavenger-hunt adventure game, not just a list of map pins.
- Support solo, duo, family, and team-vs-team play.
- Allow some hunts to be completed in flexible order so teams can split up.
- Use clue chains so players discover the next step from the last step.
- Keep CityWalk playable without park admission.
- Keep the resort-wide hunt feeling premium and larger in scale.

## Hunt Taxonomy

### 1. Small Challenges

Short, self-contained objectives.

Target use:

- casual players
- warm-up content
- filler objectives inside larger hunts
- fast proof-of-concept content for testing

Structure:

- 1 location
- 1 clue or micro-chain
- 5 to 15 minutes
- easy to medium

### 2. Main Hunts

Zone-based multi-step adventures.

Target use:

- the default play mode inside a single area
- a stronger story or theme
- something players can intentionally choose at the start of a session

Structure:

- 3 to 6 linked steps
- one theme or fantasy
- 20 to 60 minutes
- medium to hard

### 3. Zone Finale Hunts

The largest hunt inside one zone.

Target use:

- "signature" route for that location
- best content for players who want a bigger challenge
- best candidate for branching paths inside a single zone

Structure:

- 5 to 8 steps
- multiple lands or districts
- 45 to 90 minutes
- medium to hard

### 4. Resort Epic Hunt

A premium cross-zone adventure using Islands, Studios, and CityWalk together.

Structure:

- 8 to 12 steps
- multiple branch opportunities
- 2 to 4 hours
- hard

## Resort Structure

## Universal Islands of Adventure

Primary fantasy:

- mythic islands
- hidden details
- creature encounters
- comic-book and adventure energy

Content structure:

- main hunts
- small challenges
- one larger park-scale finale

Suggested main hunts:

1. Lost Legends of the Islands
   Theme: discovery, mythology, forgotten details
   Style: observation-heavy, clue-first
   Team mode: yes

2. Predators and Portals
   Theme: Jurassic + fantasy + transitional spaces
   Style: movement-based route with landmark reveals
   Team mode: yes

3. Heroes, Beasts, and Relics
   Theme: Marvel, Skull Island, Lost Continent
   Style: themed path with flexible branch order
   Team mode: strong

Suggested small challenges:

- hidden sign details
- unique props
- statue/photo checkpoints
- timing-based character or effect observations
- one-object find tasks

Suggested zone finale:

The Islands Championship Hunt

- multi-island route
- can split into branch clusters
- reunites for a final clue near a strong visual anchor

Branch candidates:

- Marvel branch
- Jurassic branch
- Seuss/central waterfront branch
- Lost Continent branch

## Universal Studios Florida

Primary fantasy:

- movie set exploration
- hidden windows and facades
- wizarding secrets
- comedy and classic Universal references

Content structure:

- main hunts
- small challenges
- one larger park-scale finale

Suggested main hunts:

1. Studio Secrets
   Theme: hidden details across Hollywood, New York, and Production Central
   Style: clue-to-landmark chain
   Team mode: yes

2. Diagon and the London Mystery
   Theme: wizarding clues and hidden story details
   Style: denser, more interpretive clue work
   Team mode: light branching

3. Springfield Side Quest
   Theme: visual comedy, food landmarks, character props
   Style: approachable and photo-friendly
   Team mode: casual

Suggested small challenges:

- storefront clues
- facade details
- hidden windows
- prop or signage recognition
- themed food or photo checkpoints

Suggested zone finale:

The Studio Master Route

- touches multiple districts
- mixes visual clue solving with photo proof
- ends on a strong "you've explored the whole park" moment

Branch candidates:

- Wizarding/London branch
- New York/Hollywood branch
- Springfield/central branch

## CityWalk

Primary fantasy:

- no-ticket exploration
- arrival-day energy
- neon, food, waterfront, and gateway moments

Content structure:

- accessible main hunts
- small challenges
- one larger public-access route

Suggested main hunts:

1. Arrival Ritual
   Theme: first look at the resort
   Style: iconic arrival landmarks and entry energy
   Team mode: casual

2. Lagoon Loop
   Theme: waterfront, bridges, views, district connections
   Style: orientation and photo-centric
   Team mode: yes

3. Neon and Bites
   Theme: venue signage, food spots, nightlife details
   Style: visual recognition and optional food side objectives
   Team mode: strong for pairs

Suggested small challenges:

- globe shot
- venue icon hunt
- waterfront angle hunt
- signage recognition
- public art or architecture details

Suggested zone finale:

The CityWalk Free-Access Hunt

- fully playable without park ticket
- ideal for arrival evening or rest day
- should become the most accessible "starter" premium route

Branch candidates:

- entry plaza branch
- food venue branch
- lagoon branch

## Resort-Wide Hunt

Suggested name:

The Universal Core Convergence

Fantasy:

- one long-form scavenger adventure connecting all three resort zones
- feels like a championship route rather than just a checklist

Structure:

- Act 1: orientation and unlock
- Act 2: branch split
- Act 3: reunion and finale

Recommended flow:

1. Start in CityWalk with an arrival clue
2. Unlock branch options for Studios and Islands
3. Let teams split to solve branch clusters in different order
4. Require one proof or token from each branch
5. Reunite for a final clue at a shared resort-core location

This hunt should be:

- hard
- team-friendly
- replayable
- excellent for head-to-head competition

## Branching And Team Play Model

We should intentionally support two hunt styles:

### Linear Hunts

Every clue points to the next clue.

Best for:

- story-heavy hunts
- first-time player experiences
- stronger puzzle pacing

### Branching Hunts

One clue unlocks 2 to 4 possible next steps.

Best for:

- team competition
- larger park-scale hunts
- replayable routes

Branching rules:

- branches should be solvable in any order
- each branch should give a token, answer fragment, or confirmation phrase
- final clue should require all branches to be resolved

Team competition model:

- players can split up
- each group takes a branch cluster
- regroup at a reunion checkpoint
- compare timing or points

## Clue Chain Format

Each hunt step should have a consistent authoring format.

Recommended structure per step:

- `step_id`
- `zone`
- `branch_group`
- `sequence_type`
  Values: `linear`, `branch`, `reunion`, `finale`
- `clue_text`
- `solve_type`
  Values: `observation`, `riddle`, `photo`, `timed`, `interact`
- `target_anchor`
  The real-world object or landmark the clue resolves to
- `proof_type`
  Values: `photo`, `location`, `answer`, `combo`
- `next_step_logic`
  Describes where the next clue comes from

Example clue flow:

1. Read clue
2. Infer destination
3. Arrive at landmark
4. Identify the correct detail
5. Capture proof or answer
6. Unlock next clue or branch token

## Difficulty Model

### Easy

- strong landmark recognition
- short walking distance
- obvious clue-to-location connection
- best for quick wins and family play

### Medium

- light interpretation needed
- some cross-zone movement
- more than one possible landmark before confirmation

### Hard

- denser clue language
- wider area search
- branch dependencies
- less explicit landmarks

## Recommended Zone Hunt Set: First Wave

### Islands of Adventure

- Main Hunt: Lost Legends of the Islands
- Main Hunt: Predators and Portals
- Finale Hunt: Islands Championship Hunt
- Small Challenges: 8 to 12

### Universal Studios

- Main Hunt: Studio Secrets
- Main Hunt: Diagon and the London Mystery
- Finale Hunt: Studio Master Route
- Small Challenges: 8 to 12

### CityWalk

- Main Hunt: Arrival Ritual
- Main Hunt: Lagoon Loop
- Finale Hunt: CityWalk Free-Access Hunt
- Small Challenges: 6 to 10

### Resort-Wide

- Epic Hunt: Universal Core Convergence

## App And Data Changes We Should Build Next

1. Add hunt step graphs instead of only flat challenge lists.
2. Add `branch_group` and `sequence_type` to the content model.
3. Add "parallel branch" UI so players understand they can split up.
4. Add answer-fragment or token collection for reunion/finale steps.
5. Add team-mode scaffolding:
   - team name
   - branch assignments
   - timing
   - shared completion state
6. Add hunt planning metadata in admin:
   - zone
   - main hunt or small challenge
   - linear or branching
   - reunion point
   - team-friendly yes/no

## Field Testing Checklist For Hunt Design

When testing in the parks, capture:

- exact coordinate corrections
- clue ambiguity notes
- traffic or crowd problems
- line-of-sight issues
- photo proof difficulty
- whether a branch works solo and with teams
- whether the route is still fun if done out of order

## Recommended Next Deliverables

1. Turn this blueprint into a structured planning board in the app or admin tools.
2. Draft the first named hunt for each zone using the clue-step format.
3. Write one full branching hunt spec for resort-wide play.
4. Add content fields in the data model to support branching and reunion logic.
