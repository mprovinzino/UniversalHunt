# Universal Hunt Master Specs

Compiled review packet for the current flagship hunt planning set.

- Generated: March 26, 2026
- Included specs: CityWalk, Islands of Adventure, Universal Studios, Resort-Wide Championship

## Included Documents

1. CityWalk Hunt Spec: Lagoon Loop
2. Islands Of Adventure Hunt Spec: Lost Legends Of The Islands
3. Universal Studios Hunt Spec: Studio Secrets
4. Resort-Wide Hunt Spec: Universal Core Convergence

---

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


---

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


---

# Universal Studios Hunt Spec: Studio Secrets

## Why This Completes The Core Set

This should be the first full Universal Studios hunt spec because it completes the three-zone foundation:

- one public-access CityWalk hunt
- one flagship Islands hunt
- one flagship Studios hunt

It is also the right Studios concept to build first because this park is strongest when players are asked to look twice.

The fun here is not just reaching places.
It is realizing that the park keeps hiding its identity in plain sight:

- streets that are really sets
- facades that imply stories
- ordinary-looking places that secretly lead somewhere else

## Hunt Identity

- `hunt_id`: `usf-studio-secrets`
- `hunt_type`: `main_hunt`
- `zone`: `universal-studios`
- `difficulty`: `medium-hard`
- `play_style`: `branching`
- `team_friendly`: `yes`
- `estimated_time`: `50 to 75 minutes`
- `recommended_team_size`: `1 to 4`
- `ideal_use_case`: full park session, clue-focused play, players who enjoy details and hidden transitions

## Hunt Fantasy

Universal Studios should feel like a place built from layers.

Players are not told the park's secret directly.
They discover it through three forms of studio magic:

1. Spotlight
2. Story
3. Portal

Each branch reveals one of those ideas in a different district.
When the three ideas are reunited, the player understands the larger truth:

this park is not one place pretending to be real,
it is many stories built side by side on purpose.

This hunt should feel like:

- decoding a movie park
- noticing what other guests walk past
- moving through districts that each hide a different trick

## Design Goals

- Make Universal Studios feel observant and clue-driven, not just route-driven.
- Use districts that reward reading signs, facades, and transitions.
- Support non-linear branch completion after a shared opening step.
- Let teams split into three directions without confusion.
- End somewhere that feels cinematic and wide enough for a satisfying finale photo.

## District Coverage

Primary districts to use:

- Hollywood / Production Central
- New York
- London / Diagon transition zone

Optional supporting transitions:

- central waterfront or lagoon-facing paths
- major crossroads where the park's "set" feeling is most visible

Version one should stay coherent instead of trying to force every land into one route.

This hunt is stronger if it feels authored than exhaustive.

## Route Shape

### Act 1: Shared Opening

All players begin at the same orientation point and unlock the hunt fiction.

### Act 2: Three Branches

Players can complete these in any order:

- Branch A: Spotlight
- Branch B: Story
- Branch C: Portal

### Act 3: Reunion

The branch answers combine into the final clue.

### Act 4: Finale

Players finish at a scenic point that feels like the park revealing its larger identity.

## Recommended Play Modes

### Solo

- complete branches in the most efficient walking order
- use clue interpretation as the main challenge layer

### Pair

- solve together or split briefly by district and reconnect

### Team-vs-Team

- assign one branch per player or pair
- communicate answer tokens
- regroup for the reunion and race to the finale

## Hunt Step Overview

## Step 0: Briefing

Purpose:

- frame the park as a place of hidden craft
- explain that branches can be solved in different order
- encourage careful observation

Player-facing setup copy:

> A studio never reveals all of its tricks at once. In this park, the Spotlight, the Story, and the Portal each hide part of the truth. Find all three, and the park will tell you what it has been showing you all along. If you have a team, split up wisely. Some secrets are easier to uncover from different directions.

## Step 1: Opening Clue

- `step_id`: `usf-secrets-01`
- `sequence_type`: `linear`
- `solve_type`: `riddle`
- `proof_type`: `location`

Clue draft:

> Begin where the park first feels less like one street and more like many possibilities.
> You are not deep in any story yet, but from here, several of them are already trying to pull you in.

Intended solve:

- a clear, shared orientation point near the central arrival-to-district transition inside Universal Studios

Target anchor:

- a highly visible central point where players can reasonably choose Hollywood, New York, or London next

Why this works:

- easy meetup location
- naturally introduces branch choice
- fits the "many stories begin here" theme

Completion reward:

- unlock Branch A, Branch B, and Branch C

## Branch A: Spotlight

Theme:

- performance
- marquees
- old-school studio glamour
- visible showmanship

Primary district:

- Hollywood / Production Central

### Step A1

- `step_id`: `usf-secrets-a1`
- `branch_group`: `spotlight`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Seek the place where the park behaves like opening night.
> A marquee promises action before anyone takes a seat, and the building itself feels like an announcement.

Intended solve:

- a strong Hollywood or Production Central show-building marquee anchor

Target anchor:

- a reliable exterior marquee or theatre-style facade that communicates spectacle at a glance

Answer task:

- identify the show or venue name displayed there

Keyword reward:

- `SPOTLIGHT`

### Step A2

- `step_id`: `usf-secrets-a2`
- `branch_group`: `spotlight`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture proof that this district still loves a dramatic entrance.

Intended solve:

- take a proof photo at the marquee or performance facade

Branch A completion token:

- `SPOTLIGHT`

## Branch B: Story

Theme:

- city facades
- headlines
- storefront narrative
- the feeling that every block is pretending to be lived in

Primary district:

- New York

### Step B1

- `step_id`: `usf-secrets-b1`
- `branch_group`: `story`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Find the street that looks busiest even when no one on it is actually going home.
> Here, windows, signs, and headlines do the work of telling you what kind of city this is supposed to be.

Intended solve:

- the New York district or a high-confidence facade cluster within it

Target anchor:

- a recognizable New York-style block with readable signage and strong "city set" identity

Answer task:

- identify the named venue, sign, or headline anchor that confirms the player found the intended block

Keyword reward:

- `SCRIPT`

### Step B2

- `step_id`: `usf-secrets-b2`
- `branch_group`: `story`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Frame the street so it looks real enough to fool someone who forgets they are in a theme park.

Intended solve:

- take a proof photo showing the most convincing city-block facade angle

Branch B completion token:

- `SCRIPT`

## Branch C: Portal

Theme:

- hidden transitions
- secret entry
- the feeling that one world can vanish behind another

Primary district:

- London / Diagon transition zone

### Step C1

- `step_id`: `usf-secrets-c1`
- `branch_group`: `portal`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Some entrances want to be found. This one is better when it is almost overlooked.
> Go to the ordinary-looking place where the park proves that a plain street can hide a second world.

Intended solve:

- the London facade district and hidden gateway logic that leads toward Diagon Alley

Target anchor:

- a reliable London-side landmark that signals the concealed transition into the wizarding area

Answer task:

- identify the visible landmark, vehicle, or named gateway element that confirms the correct solve

Keyword reward:

- `PORTAL`

### Step C2

- `step_id`: `usf-secrets-c2`
- `branch_group`: `portal`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture the evidence that the most powerful transition in the park begins by pretending to be ordinary.

Intended solve:

- take a proof photo at the London-to-hidden-world anchor

Branch C completion token:

- `PORTAL`

## Reunion Step

- `step_id`: `usf-secrets-04`
- `sequence_type`: `reunion`
- `solve_type`: `word-combo`
- `proof_type`: `answer`

Inputs:

- `SPOTLIGHT`
- `SCRIPT`
- `PORTAL`

Player-facing reunion prompt:

> You found the park's three studio tricks:
> the Spotlight that sells the moment,
> the Script that builds the street,
> and the Portal that hides the next world.
> Now go to the place where those tricks stop feeling separate and start feeling like one grand production.

Interpretation:

- players should infer a scenic central point where multiple districts and park identities feel connected

## Finale Step

- `step_id`: `usf-secrets-05`
- `sequence_type`: `finale`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Finish where the park looks least like a single neighborhood and most like a studio built from many scenes.
> Your final photo should prove that this place was designed to shift stories without ever breaking the illusion.

Target anchor:

- a wide, cinematic vista near the central park spine, waterfront, or district crossover area

Completion reward:

- hunt complete
- bonus points
- contributes toward a future resort-wide hunt unlock

## Team Play Rules

### Recommended Split

For 2 to 4 players:

- one branch to Hollywood / Production Central
- one branch to New York
- one branch to London

### Why This Works

- each branch has a different visual identity
- teams can divide efficiently without overlapping too much
- the reunion creates a satisfying regroup moment

### Desired Team Feeling

Players should feel:

- rewarded for noticing details
- smart for choosing an efficient branch split
- excited to compare which district hid the best clue

## Proof And Verification Recommendations

Opening step:

- location only

Branch steps:

- one answer plus one photo per branch

Finale:

- required photo

Why:

- keeps the hunt physical without turning every step into a camera chore
- makes the district differences visible in saved proof

## Difficulty Tuning Notes

To keep this medium-hard instead of frustrating:

- each district clue should narrow to one strongly plausible anchor
- the New York branch should avoid seasonal or temporary signage
- the Portal branch should feel clever, not so vague that it becomes guesswork
- the reunion should feel interpretive but still fair once players have the three keywords

## Field Testing Checklist

Test the following in-park:

- Is the opening anchor clear enough on a busy day?
- Which Hollywood or Production Central marquee is most reliable for the Spotlight branch?
- Which New York facade cluster reads best at different crowd levels and times of day?
- Is the London branch magical without being too opaque?
- Can the three branches truly be completed in any order?
- Does the finale feel cinematic enough to justify the larger story payoff?

## Content Risks

- seasonal decor can change readability in New York and Hollywood
- parade flow or crowd patterns may affect photos in central areas
- the strongest portal-style anchors may be crowded at peak times
- one branch may become significantly slower if the chosen district is congested

## Implementation Notes

This hunt should use the same future content fields as the other flagship specs:

- `branch_group`
- `sequence_type`
- `keyword_reward`
- `reunion_requirements`
- `team_split_recommended`

Additional helpful metadata for this hunt:

- `district_anchor`
- `answer_aliases`
- `crowd_reliability`
- `best_time_window`

## What This Teaches Us For Future Hunts

If this spec works, we will have the full resort foundation:

- one CityWalk flagship hunt
- one Islands flagship hunt
- one Studios flagship hunt

That gives us the right ingredients for the next major design step:

- the resort-wide championship hunt

Most importantly, this hunt proves that:

- Universal Studios can support branching just as well as Islands
- facade-reading and transition-solving are strong gameplay, not just filler
- the app can support hunts where observation matters more than raw walking distance


---

# Resort-Wide Hunt Spec: Universal Core Convergence

## Why This Is The Championship Hunt

This should be the first true resort-wide flagship because it turns the whole project into something bigger than separate park routes.

It is the hunt that answers the question:

What happens when CityWalk, Islands of Adventure, and Universal Studios stop feeling like separate maps and start feeling like one connected game board?

This hunt should feel like:

- the hardest premium route in version one
- a team challenge worth planning around
- a culminating adventure that pays off the ideas introduced in the zone hunts

It is not just "more stops."
It is the moment where the app proves it can support a real championship-style scavenger experience.

## Hunt Identity

- `hunt_id`: `resort-core-convergence`
- `hunt_type`: `resort_epic`
- `zone`: `resort-wide`
- `difficulty`: `hard`
- `play_style`: `branching`
- `team_friendly`: `yes`
- `estimated_time`: `2.5 to 4 hours`
- `recommended_team_size`: `2 to 6`
- `ideal_use_case`: full challenge day, head-to-head team play, experienced players, park-to-park adventure

## Access And Play Requirements

Recommended assumptions for version one:

- players have access to Universal Studios Florida
- players have access to Islands of Adventure
- players can freely move through CityWalk and the resort core

This hunt should be framed as:

- a premium all-in challenge
- best played with admission to both parks
- possible solo, but strongest with a team

## Hunt Fantasy

The resort has three public truths:

1. It announces itself.
2. It dares you into adventure.
3. It hides worlds behind worlds.

Players uncover those truths across the full resort by collecting proof from three different branch chapters:

- Branch A: Signal
- Branch B: Legend
- Branch C: Illusion

When all three are solved, the player earns the right to the final convergence clue.

This hunt should feel like:

- an all-day expedition
- a championship route across the resort core
- a reveal that the whole destination is one designed adventure, not separate experiences taped together

## Design Goals

- Make the full resort feel intentional and interconnected.
- Reward teams that divide labor intelligently.
- Keep the branch logic readable even at larger scale.
- Use the strongest identity of each zone instead of covering everything.
- Finish at a reunion point that feels worthy of a championship photo.

## Zone Coverage

This hunt should intentionally use one high-confidence chapter from each zone:

- CityWalk / lagoon core
- Islands of Adventure
- Universal Studios Florida

Version one should not try to visit every land.
It should visit the best symbolic anchors in each zone.

## Route Shape

### Act 1: Shared Unlock

All players begin together in the public resort core.

### Act 2: Three Zone Branches

Players unlock three chapter branches:

- Branch A: Signal
- Branch B: Legend
- Branch C: Illusion

These can be completed in any order.
Teams may split.

### Act 3: Convergence

The three branch answers combine into one reunion clue.

### Act 4: Championship Finale

Players finish at a resort-core location that proves the whole destination belongs to one larger adventure.

## Recommended Play Modes

### Solo

- complete the branches in the least backtracking order
- treat the route as an endurance puzzle

### Pair

- stay together for opening and finale
- split only if both players are comfortable navigating independently

### Team-vs-Team

- assign one branch per player or pair
- race to collect all three tokens
- regroup for the convergence clue
- compare branch timing and total finish time

## Hunt Step Overview

## Step 0: Briefing

Purpose:

- establish championship tone
- explain that the whole resort is the board
- explicitly allow split-team play

Player-facing setup copy:

> This is not a single-park hunt. It is the resort's championship route. To finish it, you must recover three truths from three different worlds: the Signal, the Legend, and the Illusion. If you have a team, divide your path wisely. The resort is connected, but speed belongs to the explorers who use that fact best.

## Step 1: Opening Clue

- `step_id`: `resort-convergence-01`
- `sequence_type`: `linear`
- `solve_type`: `riddle`
- `proof_type`: `location`

Clue draft:

> Start where nearly every adventure on this property announces itself first. Before the tickets, before the islands, before the sets and stories, one giant symbol tells arriving guests they have reached the center of it all.

Intended solve:

- the Universal arrival icon area in CityWalk

Target anchor:

- the most iconic public arrival landmark in the resort core

Why this works:

- highly recognizable
- easy meetup point
- perfect championship starting line

Completion reward:

- unlock Branch A, Branch B, and Branch C

## Branch A: Signal

Theme:

- arrival
- connection
- the public-facing identity of the resort

Primary zone:

- CityWalk / lagoon core

### Step A1

- `step_id`: `resort-convergence-a1`
- `branch_group`: `signal`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Find the place where the resort stops being an entrance and starts feeling connected. Water, walkways, and skyline share the same frame here, and the whole property suddenly makes sense.

Intended solve:

- a strong lagoon or central connection viewpoint in the CityWalk core

Target anchor:

- a waterfront or bridge-adjacent location that visually explains how the resort links together

Answer task:

- identify the viewpoint, bridge, or visible landmark that confirms the player reached the intended connection point

Keyword reward:

- `SIGNAL`

### Step A2

- `step_id`: `resort-convergence-a2`
- `branch_group`: `signal`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture the angle that proves this is not just a walkway between destinations, but the pulse that ties them together.

Intended solve:

- take a proof photo at the lagoon / connection anchor

Branch A completion token:

- `SIGNAL`

## Branch B: Legend

Theme:

- myth
- creatures
- the impossible becoming real

Primary zone:

- Islands of Adventure

### Step B1

- `step_id`: `resort-convergence-b1`
- `branch_group`: `legend`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Cross into the park that treats worlds like islands and find the place where danger is old, famous, and bold enough to become a public spectacle.

Intended solve:

- a major Islands anchor with legendary or creature-driven identity

Target anchor:

- a highly legible in-park landmark that captures the park's adventurous, impossible-world energy

Answer task:

- identify the creature, hero, or landmark that confirms the solve

Keyword reward:

- `LEGEND`

### Step B2

- `step_id`: `resort-convergence-b2`
- `branch_group`: `legend`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Take a photo that proves adventure here is not a theme. It is a promise made visible.

Intended solve:

- take a proof photo at the selected Islands landmark

Branch B completion token:

- `LEGEND`

## Branch C: Illusion

Theme:

- facades
- hidden transitions
- streets that conceal a second story

Primary zone:

- Universal Studios Florida

### Step C1

- `step_id`: `resort-convergence-c1`
- `branch_group`: `illusion`
- `sequence_type`: `branch`
- `solve_type`: `observation`
- `proof_type`: `answer`

Clue draft:

> Enter the park that builds cities from stories. Find the place where an ordinary-looking street dares you to miss the secret hidden inside it.

Intended solve:

- a Studios anchor that represents hidden-world or set-magic logic

Target anchor:

- a reliable facade or transition point that captures the park's strongest illusion

Answer task:

- identify the landmark, district, or hidden-world cue that confirms the player found the intended illusion point

Keyword reward:

- `ILLUSION`

### Step C2

- `step_id`: `resort-convergence-c2`
- `branch_group`: `illusion`
- `sequence_type`: `branch`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Capture the proof that the park's best trick is making one world disappear behind another.

Intended solve:

- take a proof photo at the selected Studios illusion anchor

Branch C completion token:

- `ILLUSION`

## Convergence Step

- `step_id`: `resort-convergence-04`
- `sequence_type`: `reunion`
- `solve_type`: `word-combo`
- `proof_type`: `answer`

Inputs:

- `SIGNAL`
- `LEGEND`
- `ILLUSION`

Player-facing reunion prompt:

> You found the three truths of the Universal core:
> the Signal that calls explorers in,
> the Legend that dares them forward,
> and the Illusion that hides the next world in plain sight.
> Bring them together where the resort can be seen not as separate stops, but as one shared adventure.

Interpretation:

- players should infer a central lagoon or resort-core reunion point with strong visual connection to multiple zones

## Finale Step

- `step_id`: `resort-convergence-05`
- `sequence_type`: `finale`
- `solve_type`: `photo`
- `proof_type`: `photo`

Clue draft:

> Finish where the whole resort finally reads as one design. Your last photo should show water, movement, and the sense that beyond every path lies another gate, another story, another challenge waiting.

Target anchor:

- the strongest resort-core vista for a championship finish

Completion reward:

- hunt complete
- championship badge
- maximum bonus points
- unlocks future advanced challenge tiers

## Team Play Rules

### Recommended Split

For 3 to 6 players:

- one branch to CityWalk
- one branch to Islands
- one branch to Studios

For 2 players:

- one player takes CityWalk or the faster branch
- one player takes one park branch first
- regroup and finish the final remaining branch together if desired

### Why This Works

- each branch has a distinct identity
- branch travel has meaningful strategic weight
- the resort layout creates natural team competition

### Desired Team Feeling

Players should feel:

- like they are coordinating a real expedition
- rewarded for dividing the map intelligently
- excited when the reunion finally brings all progress back together

## Proof And Verification Recommendations

Opening step:

- location only

Branch steps:

- one answer plus one photo in each zone

Convergence:

- answer confirmation only

Finale:

- required photo

Why:

- makes each zone feel physically "claimed"
- avoids overloading the player with too many proof moments
- keeps the championship finish distinct

## Difficulty Tuning Notes

To keep this hard but fair:

- each branch must use one unmistakable symbolic anchor
- branch walking time should feel meaningfully different, but not wildly unbalanced
- reunion language should feel grand without becoming vague
- the finale should feel like a true earned return, not just "go back where you started"

## Field Testing Checklist

Test the following across a full day:

- Is the opening step strong enough to feel like a true starting line?
- Which CityWalk connection point best communicates the whole resort layout?
- Which single Islands anchor best represents the park in a championship hunt?
- Which Studios anchor best delivers the illusion theme without causing clue confusion?
- Do the branches still work if players complete them in unusual orders?
- Is the reunion point convenient enough after park hopping?
- Does the finale feel worthy of a 2.5 to 4 hour challenge?

## Content Risks

- park hopping introduces timing and energy fatigue
- branch balance may be uneven if one zone gets much more congested than the others
- reunion success depends on a very strong, visually readable final anchor
- weather can heavily affect the waterfront impact of the championship ending

## Implementation Notes

This hunt should use the same branching fields as the zone specs:

- `branch_group`
- `sequence_type`
- `keyword_reward`
- `reunion_requirements`
- `team_split_recommended`

Additional helpful metadata for this hunt:

- `zone_anchor`
- `park_hopper_recommended`
- `branch_time_estimate`
- `full_day_recommended`
- `championship_tier`

## Why This Matters

Once this spec feels right, the project has a complete top-level content ladder:

- accessible CityWalk flagship
- in-park Islands flagship
- in-park Studios flagship
- resort-wide championship hunt

That means the next build phase can stop inventing structure and start turning the structure into playable app data.


---

