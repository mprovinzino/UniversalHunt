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
