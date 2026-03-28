# Islands Of Adventure Hunt Spec: Lost Legends Of The Islands

## Why This Is The Next Hunt

This should be the first full in-park hunt spec after CityWalk because it proves the format inside a ticketed park while still supporting:

- strong visual anchors
- multiple themed islands
- branching order
- team-vs-team play
- a more adventurous fantasy than the CityWalk onboarding hunt

It should feel like players are uncovering forgotten stories hidden across the islands, not just checking off landmarks.

## Hunt Identity

- `hunt_id`: `ioa-lost-legends`
- `hunt_type`: `main_hunt`
- `zone`: `islands-of-adventure`
- `difficulty`: `medium-hard`
- `play_style`: `branching`
- `team_friendly`: `yes`
- `estimated_time`: `45 to 70 minutes`
- `recommended_team_size`: `1 to 4`
- `ideal_use_case`: dedicated park session, head-to-head team challenge, mythology/adventure route

## Hunt Fantasy

Every island holds a fragment of a larger story.

The player is not told that story directly.
They uncover it by finding three kinds of legendary evidence:

1. Creatures
2. Champions
3. Ruins

Each branch of the hunt reveals one of those ideas in a different part of the park.
When players reunite the three ideas, they solve the final legend clue.

This hunt should feel like:

- a mythic expedition
- a discovery game
- a route across very different lands that still feels connected

## Design Goals

- Make Islands feel like multiple worlds that hide one connected legend.
- Use lands with strong identity so clues feel memorable.
- Support non-linear branch completion after a shared opening step.
- Reward teams that split up intelligently.
- End with a finale that feels scenic and triumphant.

## Route Shape

### Act 1: Shared Opening

All players begin at the same anchor point and unlock the hunt fiction.

### Act 2: Three Branches

Players can complete these in any order:

- Branch A: Creatures
- Branch B: Champions
- Branch C: Ruins

### Act 3: Reunion

The three branch answers combine to reveal the final destination.

### Act 4: Finale

Players finish at a landmark that feels like a true "legend revealed" moment.

## Recommended Play Modes

### Solo

- complete branches in the order that makes the most walking sense
- rely on clue inference and route efficiency

### Pair

- solve together or split one branch while the other scouts

### Team-vs-Team

- each teammate or pair takes one branch cluster
- regroup for the final clue
- compare branch completion time and total hunt time

## Land Coverage

Primary lands to use:

- Marvel Super Hero Island
- Jurassic Park
- Lost Continent

Optional supporting transitions:

- central lagoon/waterfront paths
- discovery viewpoints between islands

This hunt should avoid trying to cover every island on version one.
It is stronger if it feels coherent than if it feels exhaustive.

## Hunt Step Overview

## Step 0: Briefing

Purpose:

- establish legend tone
- explain that branches may be solved in different order
- frame the player as an explorer

Player-facing setup copy:

> The islands do not share one story openly, but traces of one remain. Find proof of the Creature, the Champion, and the Ruin. If you travel with a team, split up wisely. Legends are easier to uncover when more than one explorer is searching.

## Step 1: Opening Clue

- `step_id`: `ioa-legend-01`
- `sequence_type`: `linear`
- `solve_type`: `riddle`
- `proof_type`: `location`

Clue draft:

> Begin where explorers must choose a direction, where no island legend has fully begun, but all of them are already calling.

Intended solve:

- a clear central orientation point near the shared arrival / lagoon-facing crossover area

Target anchor:

- a highly visible central park orientation point before players commit to one major island branch

Why this works:

- easy shared meetup point
- good place to introduce branching
- reduces branch confusion

Completion reward:

- unlock Branch A, Branch B, and Branch C

## Branch A: Creatures

Theme:

- the park’s legendary beasts
- living or implied threats
- instinct, teeth, pursuit

Primary land:

- Jurassic Park

### Step A1

- `step_id`: `ioa-legend-a1`
- `branch_group`: `creatures`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Find the place where a hunter from another age still draws a crowd.
> Here, the danger is famous enough that people willingly step closer just to prove they saw it.

Intended solve:

- Raptor Encounter / major raptor-facing landmark

Target anchor:

- a Jurassic creature encounter space or equivalent high-confidence raptor landmark

Answer task:

- identify the predator or encounter being referenced

Keyword reward:

- `FANG`

### Step A2

- `step_id`: `ioa-legend-a2`
- `branch_group`: `creatures`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture proof that the island still belongs to its oldest hunters.

Intended solve:

- photo proof at the creature anchor

Branch A completion token:

- `FANG`

## Branch B: Champions

Theme:

- heroes
- defenders
- action and identity

Primary land:

- Marvel Super Hero Island

### Step B1

- `step_id`: `ioa-legend-b1`
- `branch_group`: `champions`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Seek the champion whose city never really stops moving.
> Near his world, headlines, danger, and heroics all seem to share the same street.

Intended solve:

- Spider-Man / Daily Bugle-adjacent landmark

Target anchor:

- Daily Bugle or strong Spider-Man exterior anchor

Answer task:

- identify the hero or headline source

Keyword reward:

- `MASK`

### Step B2

- `step_id`: `ioa-legend-b2`
- `branch_group`: `champions`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Take a photo where heroism feels public, loud, and impossible to ignore.

Intended solve:

- photo proof at the Marvel hero anchor

Branch B completion token:

- `MASK`

## Branch C: Ruins

Theme:

- forgotten worlds
- ancient architecture
- mystery and decay

Primary land:

- Lost Continent

### Step C1

- `step_id`: `ioa-legend-c1`
- `branch_group`: `ruins`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Find the place where the island remembers something older than coasters, older than heroes, older even than the beasts.
> Here, stone and myth seem to outlast the noise around them.

Intended solve:

- a strong Lost Continent visual anchor

Target anchor:

- iconic ruin-like architecture, fountain, arch, or mythic stonework in Lost Continent

Answer task:

- identify a specific named or visibly distinctive ruin-like landmark

Keyword reward:

- `STONE`

### Step C2

- `step_id`: `ioa-legend-c2`
- `branch_group`: `ruins`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture the evidence that some islands were ancient before they were attractions.

Intended solve:

- photo proof at the ruin anchor

Branch C completion token:

- `STONE`

## Reunion Step

- `step_id`: `ioa-legend-04`
- `sequence_type`: `reunion`
- `solve_type`: `word-combo`
- `proof_type`: `answer`

Inputs:

- `FANG`
- `MASK`
- `STONE`

Player-facing reunion prompt:

> You found the three traces of the islands:
> the creature,
> the champion,
> and the ruin.
> Now go to the place where all of them feel possible at once: not one island’s story, but the park’s larger legend.

Interpretation:

- players should infer a scenic or central transitional point where the identities of multiple islands feel connected

## Finale Step

- `step_id`: `ioa-legend-05`
- `sequence_type`: `finale`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Finish where the islands stop feeling separate and start feeling like one impossible world stitched together by adventure.

Target anchor:

- a scenic central vista, bridge, lagoon edge, or view that suggests the larger park identity

Completion reward:

- hunt complete
- bonus points
- contributes toward resort-wide epic unlock

## Team Play Rules

### Recommended Split

For 2 to 4 players:

- one branch to Jurassic
- one branch to Marvel
- one branch to Lost Continent

### Why This Works

- lands are visually distinct
- teams can move in different directions
- reunion naturally creates tension and payoff

### Desired Team Feeling

Players should feel:

- smart for splitting efficiently
- excited to compare discoveries
- rewarded for coordinating answers

## Proof And Verification Recommendations

Opening step:

- location only

Branch steps:

- one answer + one photo each branch

Finale:

- required photo

Why:

- avoids too much repetitive photo friction
- still gives enough physical proof for the hunt to feel real

## Difficulty Tuning Notes

To keep this medium-hard instead of frustrating:

- each branch clue should narrow to one highly plausible anchor
- the ruin branch needs extra care so it does not feel too vague
- the reunion clue should feel interpretive, not random

## Field Testing Checklist

Test the following in-park:

- Is the opening anchor clear enough?
- Is the Jurassic branch too easy compared with the others?
- Is the Lost Continent branch too broad or too dead depending on traffic and visibility?
- Does the Marvel branch become too crowded for reliable photo proof?
- Can the branches truly be done in any order without breaking the pacing?
- Does the finale feel earned or generic?

## Content Risks

- entertainment schedules may change traffic patterns
- some landmarks may be visually blocked during high-crowd periods
- Lost Continent clueing may require especially precise anchors
- branch walking time should be tested so one branch is not much slower than the others

## Implementation Notes

This hunt should reuse the same future content fields as the CityWalk hunt:

- `branch_group`
- `sequence_type`
- `keyword_reward`
- `reunion_requirements`
- `team_split_recommended`

Additional helpful metadata for this hunt:

- `land_anchor`
- `walk_time_estimate`
- `visual_reliability`

## What This Teaches Us For Future Hunts

If this spec works, it becomes the right template for:

- larger park-scale Islands finale hunts
- Universal Studios branching hunts
- the resort-wide championship hunt

Most importantly, it proves that:

- branching is fun inside the parks
- teams can split without breaking the hunt
- clues can be thematic without becoming unreadable
