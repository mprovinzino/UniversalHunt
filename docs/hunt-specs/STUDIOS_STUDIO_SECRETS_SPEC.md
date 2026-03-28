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
