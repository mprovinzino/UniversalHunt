# CityWalk Hunt Spec: Lagoon Loop

## Why Start Here

This should be the first fully structured hunt in the project because it is:

- playable without park admission
- easier to test repeatedly
- a natural onboarding hunt
- a strong proof-of-concept for clue chains and team splits

It is also the best first hunt to validate:

- clue readability
- route pacing
- branch logic
- team-vs-team play
- proof-photo flow

## Hunt Identity

- `hunt_id`: `citywalk-lagoon-loop`
- `hunt_type`: `main_hunt`
- `zone`: `citywalk`
- `difficulty`: `medium`
- `play_style`: `branching`
- `team_friendly`: `yes`
- `estimated_time`: `35 to 50 minutes`
- `recommended_team_size`: `1 to 4`
- `ideal_use_case`: arrival day, non-park day, evening challenge, onboarding hunt

## Hunt Fantasy

Players are not just "walking CityWalk." They are decoding the public heart of the Universal resort.

This hunt should feel like:

- orientation through discovery
- a guided mystery of how the resort connects
- a chase between landmarks, water, venue icons, and arrival energy

The central fantasy:

Find the three "signals" that define the resort core:

1. Arrival
2. Energy
3. Connection

Each branch reveals one of those signals.
Those three answers then unlock the finale.

## Design Goals

- Make CityWalk feel intentional, not like leftover content outside the parks.
- Support flexible play order after the opening step.
- Let two teams split and race branches.
- End on a location that feels satisfying and photogenic.
- Keep every step rooted in something highly visible and testable.

## Route Shape

### Act 1: Orientation

One opening clue that gets every player to the same starting point.

### Act 2: Branch Split

Players unlock three branches:

- Branch A: Arrival
- Branch B: Energy
- Branch C: Connection

These can be completed in any order.

### Act 3: Reunion

The three branch answers combine into a final clue.

### Act 4: Finale

Players solve the last clue and finish with a strong waterfront or resort-core photo moment.

## Recommended Play Modes

### Solo

- complete all branches in any order
- use route freedom as the main strategy layer

### Pair

- do branches together
- one player decodes while the other scouts

### Team-vs-Team

- split branches
- each teammate or pair handles a different branch
- regroup for final answer

## Hunt Step Overview

## Step 0: Briefing

Purpose:

- explain the hunt
- tell players this is a branchable route
- set the tone

Player-facing setup copy:

> CityWalk holds the public heart of the resort. To complete this hunt, you must uncover three signals: Arrival, Energy, and Connection. Some can be solved in different order. If you have a team, split up wisely.

System notes:

- shown before the first clue
- explicitly tells users that parallel play is allowed

## Step 1: Opening Clue

- `step_id`: `cw-loop-01`
- `sequence_type`: `linear`
- `solve_type`: `riddle`
- `proof_type`: `location`

Clue draft:

> Before the gates, before the rides, before the deeper secrets of the resort,
> find the giant symbol that tells every arriving explorer where the adventure begins.

Intended solve:

- the Universal globe / arrival icon area

Target anchor:

- iconic Universal arrival globe approach on the public side

Why this works:

- highly recognizable
- ticket-free
- easy to explain
- good starting photo

Completion requirement:

- be at the correct location
- optional proof photo

Reward:

- unlocks the three branches

## Branch Structure

After Step 1, the hunt opens into three branches.
These can be done in any order.

Each branch returns:

- one keyword
- one confirmation token

All three keywords are needed for the reunion clue.

## Branch A: Arrival

Theme:

- entry, gateway, first impression

### Step A1

- `step_id`: `cw-loop-a1`
- `branch_group`: `arrival`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Seek the place where first-time visitors slow down, point upward, and grin.
> It promises heat, smoke, and spectacle before a single bite is ever served.

Intended solve:

- Bigfire

Target anchor:

- Bigfire signage or strong exterior landmark

Answer task:

- identify the venue name

Keyword reward:

- `SPARK`

### Step A2

- `step_id`: `cw-loop-a2`
- `branch_group`: `arrival`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture the place where the promise of fire becomes part of the skyline.

Intended solve:

- take a proof photo at the Bigfire landmark area

Branch A completion token:

- `SPARK`

## Branch B: Energy

Theme:

- visual noise, food energy, high-traffic venue identity

### Step B1

- `step_id`: `cw-loop-b1`
- `branch_group`: `energy`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Find the place where surf and turf collide in one name.
> It sounds like two worlds that should never share a menu.

Intended solve:

- The Cowfish

Target anchor:

- venue sign or exterior branding

Answer task:

- identify the mashup name

Keyword reward:

- `MIX`

### Step B2

- `step_id`: `cw-loop-b2`
- `branch_group`: `energy`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `photo`

Clue draft:

> Frame the sign that feels playful enough to only exist in CityWalk.

Intended solve:

- take a proof photo at Cowfish branding or entrance

Branch B completion token:

- `MIX`

## Branch C: Connection

Theme:

- walkway, water, shared resort center, paths linking destinations

### Step C1

- `step_id`: `cw-loop-c1`
- `branch_group`: `connection`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `location`

Clue draft:

> Go where water, walkways, and the resort skyline share the same frame.
> It is not a ride and not a gate, but it may be the truest center of all three worlds.

Intended solve:

- central lagoon / waterfront connection point

Target anchor:

- strong waterfront viewpoint where CityWalk and resort-core circulation are obvious

Keyword reward:

- `LINK`

### Step C2

- `step_id`: `cw-loop-c2`
- `branch_group`: `connection`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture the angle that proves the resort is one connected world, not three separate stops.

Intended solve:

- take a waterfront proof photo

Branch C completion token:

- `LINK`

## Reunion Step

- `step_id`: `cw-loop-04`
- `sequence_type`: `reunion`
- `solve_type`: `word-combo`
- `proof_type`: `answer`

Inputs:

- `SPARK`
- `MIX`
- `LINK`

Player-facing reunion prompt:

> You found the three signals of CityWalk.
> One begins the night.
> One defines its energy.
> One ties the whole resort together.
> Bring those ideas to the place where people pause, look outward, and realize the adventure extends beyond the gates.

Interpretation:

- players should infer they need to return to the lagoon-side or broader CityWalk resort-core viewpoint

## Finale Step

- `step_id`: `cw-loop-05`
- `sequence_type`: `finale`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Finish the loop with a photo that could only happen here:
> public-access energy, open water, and the feeling that two full theme parks are waiting just beyond the lights.

Target anchor:

- final lagoon or CityWalk-wide vista

Completion reward:

- hunt complete
- bonus points
- unlock toward larger resort hunt

## Team Play Rules

### Suggested Team Split

For 2 to 4 players:

- one person takes Arrival
- one person takes Energy
- one person takes Connection
- regroup for reunion/finale

### Team Tension

This hunt becomes more fun when:

- teams race to finish branches first
- teams communicate answer tokens
- reunion requires coordination

### Anti-friction Rule

No branch should be so far away or so crowded that it becomes a bottleneck.

## Proof And Verification Recommendations

Opening step:

- location only is enough

Branch steps:

- alternate between answer-based and photo-based proof

Finale:

- always include a photo

This hunt should showcase the app’s strengths:

- location gating
- proof capture
- branching
- team flexibility

## Field Testing Checklist For This Hunt

Test the following on-site:

- Is the opening clue too obvious or too vague?
- Is Bigfire the right "Arrival" branch anchor, or is there a better gateway landmark?
- Is Cowfish readable enough at different times of day?
- Is the lagoon connection clue too broad?
- Can the three branches be done comfortably in any order?
- Does the reunion feel earned?
- Is the finale visually satisfying enough for a proof photo?

## Content Risks

- venue branding may change
- restaurant visibility changes by lighting and crowds
- certain angles may be blocked during events
- waterfront clues may be too broad unless tightly anchored

## Implementation Notes

This spec implies future content model fields like:

- `branch_group`
- `sequence_type`
- `keyword_reward`
- `branch_unlocks`
- `reunion_requirements`
- `finale_after`
- `team_split_recommended`

## Why This Becomes The Template

This hunt gives us the right format for all future zone hunts:

- a clear fantasy
- a route shape
- branch logic
- a reunion
- a final proof moment

After this one, we should use the same structure for:

- one Islands main hunt
- one Studios main hunt
- the resort-wide epic
