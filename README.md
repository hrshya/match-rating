# Match Ratings App

This project takes raw football match data and turns it into a simple player rating. The goal is not to build a perfect football model. It is to make a quick, understandable ranking from match events and show how a player has performed over a set of matches.

## What the app is doing

The flow is simple:

1. Upload a CSV file with match and player stats.
2. Save the player and match records.
3. Save each player’s appearance in a match as a separate row.
4. Add up the stats across all appearances.
5. Give each player a rough rating and a rank within their age group.

It is a practical tool for looking at performance, not a final football analytics system.

## Schema and why it is shaped this way

The data model is split into a few clear layers.

### Player
A `Player` is just the person. This is the main identity in the app.

Why this exists:
- each player can appear in many matches
- each player can have many appearances
- we want to keep their name and basic identity separate from their match-by-match stats

### Match
A `Match` stores the game itself.

Why this exists:
- a match has many players in it
- a match has details like competition, date, and age group
- this lets us connect player-level performance back to the actual fixture

### Appearance
This is the most important table.

An `Appearance` records one player in one match. It is the bridge between `Player` and `Match`.

Why it is shaped this way:
- one player can appear in many matches
- one match can include many players
- the stats like goals, passes, tackles, and minutes are specific to that player in that game

The important part is that there is a unique rule on `(playerId, matchId)`, so a player cannot be counted twice in the same match.

### PlayerRatingSummary
This is a cached summary table for each player.

Why it exists:
- the app calculates a rating from all appearances
- this is a bit of work to compute every time
- storing a summary makes the app faster to read later

It keeps the key stats in one place, such as:
- total matches
- total minutes
- goals and assists
- pass accuracy
- duel win rate
- recoveries
- interceptions
- possession lost
- composite score
- percentile rank

## How the rating is calculated

The rating is not a giant model or some fancy ML formula. It is a simple weighted score based on the stats that are available.

### Step 1: collect all appearances
The app pulls every player and their appearances, including the match information for each game.

### Step 2: add up the raw stats
For each player, it totals things like:
- goals
- assists
- passes attempted and completed
- progressive passes
- shots on target
- duels won and lost
- tackles
- interceptions
- recoveries
- possession lost
- yellow and red cards

### Step 3: normalise by minutes played
To compare players fairly, the code converts totals into a per-90-minute style score.

The formula is roughly:

- `p90 = 90 / totalMinutes`

So if a player played 45 minutes, their numbers are scaled as if they played a full 90-minute match. This makes short appearances and full matches more comparable.

### Step 4: build score categories
The final score is made of a few parts:

- attack score
  - goals matter a lot
  - assists matter too
  - shots on target give a small boost

- creation score
  - progressive passes count
  - passing volume and pass accuracy matter

- defense score
  - tackles, interceptions, recoveries, and duels won help a player’s rating

- penalty score
  - possession lost and cards drag the score down

The rating is basically:

- attack + creation + defense - penalty

This makes sense for a quick system because it rewards good decisions and output while penalising mistakes and poor discipline.

### Step 5: assign a percentile
Once every player has a score, the app groups them by age group and sorts them.

Then it gives each player a percentile based on their place in that group.

This is useful for relative comparison, but it is also a simple ranking rather than a deeply rigorous statistical method.

## What I noticed about the data

A few things stand out from the structure and the way the app works.

### 1. The data is event-based, not player-season based
The app stores one row per player per match, which is the right way to do it for this type of analysis. It is flexible and easy to aggregate.

This structure is much better than trying to store one giant row per player with a big pile of totals, because match-level detail is preserved.

### 2. The schema expects clean match-level facts
The `Appearance` table holds a lot of event stats, but it assumes the upload process is reasonably clean. If the CSV has missing values or inconsistent names, the app can still run, but the quality drops.

### 3. Player identity is a weak point
Right now, the app matches players by name. That is simple, but it is risky.

If two players share the same name, or one player is spelled slightly differently across files, the app can merge or split them incorrectly.

A stronger version would use a player ID that comes from the source data or a more reliable matching rule.

### 4. Percentiles are simple and somewhat rough
The code ranks players inside their age groups and assigns a score based on where they sit. That is useful, but it is not the same as a true statistical percentile across a full population.

It is more like a basic league table within a group.

### 5. Minutes are important
The rating logic is built around per-90 normalisation. That is a good idea because a player who plays 15 minutes should not be judged the same as a player who plays 90, even if the raw totals are similar.

### 6. The app is designed to be practical, not perfect
A lot of the code is intentionally simple:
- small number of metrics
- easy weighting
- straightforward aggregation
- no complex player-value model

That is a strength for a prototype or early-stage app, but it also means it will miss some of the nuance of real football performance.

## What I would do differently with a week

If I had a week to improve this, I would focus on the parts that make the model more trustworthy and usable.

### 1. Clean up the data before scoring
I would add validation on upload.

Examples:
- check for missing required columns
- flag duplicate players or matches
- standardise player names
- check that minutes are realistic
- make sure values are numeric

This would make the whole ranking much more reliable.

### 2. Add pagination
The player list is likely to get crowded quickly once more matches and more players are uploaded. A simple list view is fine at first, but long tables become harder to browse and slower to load.

I would add pagination or a proper table with sorting and filters so users can move through players more easily. That would make it much easier to compare a midfielder against another midfielder, or scan a lower-ranked group without scrolling through everything at once.

This is not a glamorous change, but it is a very practical one: better browsing makes the app feel more usable, especially as the dataset grows.

### 3. Make the rating more defensible
Right now the formula is understandable, but it is still a rough heuristic.

I would:
- weigh roles differently
- adjust scoring by position
- treat defending and attacking stats differently depending on role
- maybe use a more transparent model with a few more tuning checks

### 4. Make the appraisal more explainable
The app should show why a rating went up or down.

For example:
- “Good passing and ball recovery, but too many losses of possession”
- “High output in limited minutes”
- “Strong defensive contributions but low attacking output”

That makes the system more useful than a number alone.

### 5. Improve the percentile logic
The app should be clearer about what the percentile means. Right now it is a ranking method within an age group, which is fine for a simple app, but I would aim for a cleaner and more standard interpretation.

## Final takeaway

This project is a good example of a simple but useful sports analytics app. The structure is sensible: players, matches, appearances, and summary stats all make sense for the problem.

The rating system is easy to understand and explain, which is a big plus. The main weak spots are data quality, player matching, and the fact that the ranking is still a rough heuristic rather than a fully robust football model.

If this were built for real use, I would spend the first week fixing data quality and identity issues before touching the model itself. That is where most of the value would come from.
