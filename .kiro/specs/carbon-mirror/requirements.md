# Requirements Document

## Introduction

CarbonMirror is an AI-powered personal climate simulator mobile application that shifts the paradigm from passive carbon tracking to active future-consequence visualization. Instead of presenting raw emissions numbers (e.g., "320 kg CO₂"), CarbonMirror translates a user's lifestyle data into relatable future scenarios, personalized AI-driven recommendations, gamified challenges, and a living visual ecosystem — enabling users to understand, feel, and act on their environmental impact before it happens.

The app targets individuals (students, commuters, office workers, households) who want to reduce their carbon footprint but are disengaged by abstract numbers and generic advice. CarbonMirror addresses this by making the invisible visible: carbon becomes comparable to flights taken, trees burned, or smartphones charged.

---

## Glossary

- **App**: The CarbonMirror mobile application running on iOS and Android.
- **User**: An authenticated individual using the App.
- **Lifestyle Profile**: A structured set of User-provided data describing their daily habits, commute, diet, energy usage, and consumption patterns.
- **Emission Record**: A calculated data entry representing CO₂-equivalent emissions for a specific activity or time period.
- **Simulator**: The Future Simulator engine that projects emissions across three scenario paths over a configurable time horizon.
- **Scenario**: One of three projection paths — Current Path (no change), Better Path (moderate improvements), or Green Path (aggressive sustainability).
- **Timeline**: A user-adjustable time horizon selector spanning 1 year, 5 years, or 10 years.
- **Carbon Equivalent**: A human-readable translation of an Emission Record into a relatable analogy (e.g., km driven, smartphone charges, fan runtime hours).
- **AI Engine**: The backend AI subsystem responsible for lifestyle analysis, recommendation generation, challenge creation, and What-If simulations.
- **Lifestyle Detective**: The AI Engine component that analyzes the Lifestyle Profile to detect hidden emission sources and suggest personalized alternatives.
- **Challenge**: An AI-generated mission assigned to a User with a defined CO₂ savings target, difficulty level, and reward points.
- **Avatar**: A virtual ecosystem visualization that reflects the User's cumulative emission level — evolving from a thriving forest (low emissions) to a polluted landscape (high emissions).
- **What-If Query**: A natural-language or structured input from the User posing a hypothetical lifestyle change (e.g., "What if I buy an electric scooter?").
- **Carbon Swap**: A social feature allowing Users to share eco-hacks and track their collective emission reduction impact.
- **Emission Database**: An external or internal data source providing CO₂ emission factors per activity, transport mode, diet choice, or product category.
- **Carbon Score**: A normalized metric representing the User's overall emission level relative to a regional or global average.

---

## Requirements

### Requirement 1: User Onboarding and Lifestyle Profile Setup

**User Story:** As a new user, I want to set up my lifestyle profile during onboarding, so that the App can accurately calculate and simulate my personal carbon footprint.

#### Acceptance Criteria

1. WHEN a User opens the App for the first time, THE App SHALL present an onboarding flow that collects the User's commute distance, primary transport mode (selectable list), home energy source (selectable list), dietary pattern (selectable list), and weekly consumption habits (selectable list).
2. WHEN a User enters a commute distance value, THE App SHALL accept only numeric values in kilometers between 0 and 500 inclusive; IF the entered value falls outside this range, THE App SHALL reject it and display a field-level error message before allowing progression.
3. WHEN a User completes the onboarding flow, THE App SHALL persist the Lifestyle Profile to the database and assign the User a unique profile identifier; IF persistence fails, THE App SHALL display an error message and allow the User to retry without re-entering data.
4. IF a required Lifestyle Profile field is left empty during onboarding, THEN THE App SHALL display a field-level validation message indicating which field is missing and SHALL disable progression to the next step until the field is populated.
5. WHEN a User submits the Lifestyle Profile, THE App SHALL calculate an initial Carbon Score within 3 seconds and display it on the home dashboard; IF the calculation fails or times out, THE App SHALL display an error state with a retry option.
6. WHEN a User navigates to the profile settings screen, THE App SHALL display all Lifestyle Profile fields in an editable form.
7. WHEN a User saves an update to the Lifestyle Profile, THE App SHALL recalculate the Carbon Score and all Scenario projections that have not been manually archived or deleted within 5 seconds of the update being saved.
8. WHEN a User updates the Lifestyle Profile, THE App SHALL recalculate the Carbon Score and all active Scenario projections within 5 seconds of the update being saved.

---

### Requirement 2: Future Simulator — Three-Scenario Projection

**User Story:** As a user, I want to see three projected futures based on my current and improved lifestyle choices, so that I can understand the long-term consequences of my daily habits.

#### Acceptance Criteria

1. THE Simulator SHALL generate three Scenarios — Current Path, Better Path, and Green Path — based on the User's Lifestyle Profile.
2. WHEN the User selects a Timeline value (1 year, 5 years, or 10 years), THE Simulator SHALL recompute and display projected cumulative emissions in kg CO₂e, total money spent on energy and transport in the User's local currency, number of trees required to offset emissions as a whole number, and total energy consumed in kWh for each Scenario.
3. WHEN the User selects a Timeline value, THE Simulator SHALL complete recomputation and render all four metric values visibly for all three Scenarios within 2 seconds.
4. THE Simulator SHALL represent Current Path with a red indicator, Better Path with a yellow indicator, and Green Path with a green indicator on every Scenario card, chart, and summary row throughout all projection views.
5. WHEN the Simulator completes recomputation of the Better Path Scenario, THE Simulator SHALL produce a total projected emission value that is 20–40% lower than the Current Path projection for the same Timeline.
6. WHEN the Simulator completes recomputation of the Green Path Scenario, THE Simulator SHALL produce a total projected emission value that is 50–80% lower than the Current Path projection for the same Timeline.
7. IF a projected Scenario reduction relies on lifestyle changes that are not explicitly configured in the User's Lifestyle Profile, THEN THE Simulator SHALL display an inline disclaimer adjacent to the affected Scenario indicating that the projection assumes uncommitted changes.
8. WHILE the User is viewing the Simulator screen, THE App SHALL keep the Timeline slider interactive and update all Scenario values within 500 milliseconds of the slider position changing.

---

### Requirement 3: Carbon Time Machine — Relatable Equivalents

**User Story:** As a user, I want my carbon emissions translated into everyday analogies, so that I can intuitively understand the scale of my environmental impact.

#### Acceptance Criteria

1. WHEN an Emission Record is computed, THE App SHALL convert the CO₂ value into exactly three Carbon Equivalents selected in fixed priority order from: kilometers driven in a petrol car, smartphone full charges, hours a ceiling fan runs, flights between two reference cities, and number of trees required to absorb the emissions over one year; each equivalent SHALL be displayed as a numeric value with its unit label.
2. THE App SHALL source Carbon Equivalent conversion factors from the Emission Database and apply the same factor value for each equivalent type consistently across all views.
3. WHEN the User taps a Carbon Equivalent, THE App SHALL display a tooltip containing the numeric conversion factor and the name of the data source used.
4. WHEN an Emission Record is recalculated, THE App SHALL update the corresponding Carbon Equivalents before displaying them.
5. THE App SHALL ensure that for any Emission Record value greater than zero, converting to a Carbon Equivalent and back using the same conversion factor produces a result within 1% of the original value.

---

### Requirement 4: AI Lifestyle Detective — Hidden Emission Discovery

**User Story:** As a user, I want the AI to find hidden sources of carbon in my daily routine and suggest specific alternatives, so that I can make targeted changes that fit my actual lifestyle.

#### Acceptance Criteria

1. WHEN the User submits or updates a Lifestyle Profile, THE Lifestyle Detective SHALL analyze the profile and identify at least one emission source derivable from the profile data but not explicitly submitted by the User as carbon-producing, within 10 seconds.
2. THE Lifestyle Detective SHALL generate suggestions where each suggestion references at least one Lifestyle Profile attribute, specifies an alternative behavior, states the estimated monthly CO₂ savings rounded to one decimal place in kilograms, and states the estimated additional time cost rounded to the nearest minute in minutes per week.
3. WHEN the Lifestyle Detective identifies a public-transit alternative to a driving commute, THE App SHALL use the Maps API to calculate the actual transit route duration and display it alongside the suggestion.
4. WHEN the Lifestyle Detective identifies 5 or more suggestions, THE Lifestyle Detective SHALL rank them by CO₂ savings in descending order and present the top 5 suggestions on the suggestions screen.
5. WHEN the Lifestyle Detective identifies between 1 and 4 suggestions, THE App SHALL display all identified suggestions ranked by CO₂ savings in descending order on the suggestions screen.
6. IF the Lifestyle Detective cannot identify any emission reduction opportunity for a given Lifestyle Profile, THEN THE App SHALL display a message confirming the profile is already optimized and invite the User to revisit in 30 days; no suggestion list SHALL be shown.
7. WHEN a User marks a suggestion as acted on, THE App SHALL record the suggestion identifier, the User's profile identifier, and the UTC timestamp of the action so that the User can track which suggestions have been acted on over time.

---

### Requirement 5: AI Carbon Challenges

**User Story:** As a user, I want to receive AI-generated missions tailored to my lifestyle persona, so that I can gamify my sustainability journey and stay motivated.

#### Acceptance Criteria

1. WHEN a User completes onboarding, THE AI Engine SHALL classify the User into one of the following personas: Student, Hostel Resident, Office Worker, or Other, based on the Lifestyle Profile.
2. THE AI Engine SHALL generate a minimum of 3 active Challenges per User at any given time; each Challenge SHALL specify the mission description, estimated CO₂ savings in kilograms, difficulty level (Easy, Medium, or Hard), and reward points between 1 and 500 inclusive.
3. WHEN a User marks a Challenge as complete, THE App SHALL award the specified reward points to the User's account and log the CO₂ savings amount against the User's cumulative savings record.
4. WHEN a User provides evidence of completing a specific activity associated with a Challenge without marking it complete through the standard flow, THE App SHALL allow the CO₂ savings to be logged against the User's cumulative savings record independently.
5. WHEN a Challenge is marked complete or removed by the User and the active Challenge count falls below 3, THE AI Engine SHALL generate replacement Challenges within 24 hours.
6. THE AI Engine SHALL not generate a Challenge with the same Challenge identifier as one the User has completed within the last 90 days.
7. WHEN a User requests a new Challenge by tapping "Refresh Challenges", THE AI Engine SHALL replace one existing active Challenge with a new Challenge within 5 seconds, maintaining a minimum of 3 active Challenges.
8. THE App SHALL display the User's total reward points and cumulative CO₂ saved from completed Challenges on the profile screen.

---

### Requirement 6: Carbon Avatar — Evolving Ecosystem

**User Story:** As a user, I want a visual avatar that reflects my emission level and evolves as my habits change, so that I feel emotionally connected to my sustainability progress.

#### Acceptance Criteria

1. THE Avatar SHALL render one of three ecosystem states — Polluted Forest (Carbon Score above 70th percentile), Grassland (Carbon Score between 30th and 70th percentile), or Thriving Forest (Carbon Score below 30th percentile) — based on the User's current Carbon Score.
2. WHEN the User's Carbon Score changes by more than 5 points and the change results in a different ecosystem state, THE Avatar SHALL transition to the new ecosystem state using an animated visual transition lasting between 1 and 3 seconds.
3. WHEN the Avatar transitions to a different ecosystem state, THE Avatar SHALL display a contextual message of no more than 140 characters explaining the reason for the ecosystem change.
4. WHILE the User is on the Avatar screen, THE App SHALL display the User's current Carbon Score, the current ecosystem state label, and the CO₂ reduction in kg required to reach the next better ecosystem state; IF the User is already in the Thriving Forest state, THE App SHALL display a message indicating the best ecosystem state has been reached instead of a CO₂ reduction value. WHEN the User navigates away from the Avatar screen, THE App SHALL hide this Avatar-specific information from all other screens.
5. IF a Carbon Score change would cause the Avatar to regress by more than one ecosystem state within a rolling 7-day window, THEN THE Avatar SHALL regress by exactly one ecosystem state and defer any further regression until the next rolling 7-day window.
6. WHEN the User completes a Challenge, THE Avatar screen SHALL display a celebratory animation lasting between 2 and 4 seconds acknowledging the completed Challenge before reverting to the standard ecosystem view.

---

### Requirement 7: What-If Scanner — Hypothetical Impact Simulation

**User Story:** As a user, I want to ask hypothetical questions about lifestyle changes and instantly see their projected carbon and financial impact, so that I can make informed decisions before committing to a change.

#### Acceptance Criteria

1. THE App SHALL provide a What-If Scanner input interface where the User can enter a free-text What-If Query of up to 200 characters.
2. WHEN a What-If Query is submitted, THE AI Engine SHALL parse the query, identify the relevant lifestyle activity category, and return a simulation result within 5 seconds.
3. WHEN a simulation result is returned, THE App SHALL display the identified lifestyle activity category, the estimated monthly CO₂ reduction in kilograms, the estimated monthly cost savings or increase in the User's local currency, and the estimated break-even time in months when the simulated change requires an upfront cost greater than zero.
4. WHEN the AI Engine cannot map a What-If Query to a known lifestyle activity category, THE App SHALL display a message identifying which of the following is missing or unclear: activity type, quantity, or timeframe, and prompt the User to rephrase or provide the missing detail.
5. THE App SHALL maintain a history of the last 20 What-If Queries submitted by the User, accessible from the What-If Scanner screen.
6. THE App SHALL display the identified lifestyle activity category alongside each simulation result so the User can verify the AI's interpretation of their query.
7. WHEN the User taps "Apply this change", THE App SHALL update the Lifestyle Profile with the simulated change, trigger a full recalculation of the Simulator and Carbon Score, and display a confirmation message once the recalculation is complete.

---

### Requirement 8: Social Carbon Swap

**User Story:** As a user, I want to share my eco-hacks with others and see the collective impact of our community's lifestyle changes, so that I feel part of a broader movement rather than acting alone.

#### Acceptance Criteria

1. WHEN a User submits an eco-hack post, THE App SHALL validate that the description is between 1 and 300 characters, the activity category matches a recognized category in the Emission Database, and the estimated CO₂ savings is between 0.01 and 500 kg per month before publishing.
2. WHEN an eco-hack post passes validation and is published, THE App SHALL make it visible to all Users in the Social Carbon Swap feed within 30 seconds.
3. THE App SHALL display the community-wide cumulative CO₂ saved, calculated as the sum of CO₂ savings from User-confirmed adoptions only, on the Social Carbon Swap feed header, updated at least every 60 seconds.
4. WHEN a User taps "Adopt this hack", THE App SHALL immediately increment the hack's adoption count by 1 and display a confirmation prompt; WHEN the User confirms adoption, THE App SHALL add the eco-hack's CO₂ savings to the User's profile within 1 second.
5. IF a post has been flagged by 6 or more Users as inaccurate or inappropriate, THEN THE App SHALL exclude that post from the Social Carbon Swap feed.
6. IF a User attempts to publish an eco-hack post with an estimated CO₂ savings value greater than 500 kg per month, THEN THE App SHALL display a validation warning and require the User to confirm the value before publishing.
7. IF a User attempts to adopt an eco-hack they have already adopted, THEN THE App SHALL display a message indicating the hack has already been adopted and SHALL not increment the adoption count or add duplicate CO₂ savings to the User's profile.
8. IF a User submits an eco-hack post with an activity category that does not match a recognized category in the Emission Database, THEN THE App SHALL reject the submission and display a validation message listing the accepted categories.

---

### Requirement 9: Emission Calculation and Data Integrity

**User Story:** As a user, I want my emissions to be calculated accurately and transparently from trusted data sources, so that I can trust the numbers and act on them confidently.

#### Acceptance Criteria

1. THE App SHALL calculate all Emission Records using emission factors sourced from officially published, versioned, and publicly accessible databases (e.g., IPCC, EPA, DEFRA) and display the database name and version for each calculation.
2. WHEN an emission factor in the Emission Database is updated, THE App SHALL recalculate all Emission Records and Scenario projections that used the superseded factor version within 24 hours and send the User a notification identifying which data source was updated and which calculations were affected.
3. THE App SHALL store all Emission Records with an immutable UTC ISO 8601 timestamp, the emission factor version used, and the input values that produced the record.
4. IF the Emission Database is unavailable, THEN THE App SHALL use the last successfully cached emission factors and display a staleness notice informing the User that data may be up to 7 days old; WHEN the Emission Database becomes available again, THE App SHALL remove the staleness notice within 1 hour.
5. THE App SHALL present all CO₂ values in kilograms with one decimal place of precision on all user-facing screens.
6. THE App SHALL ensure that storing an Emission Record and then retrieving it produces an identical record with no data loss or precision change.

---

### Requirement 10: Notifications and Re-Engagement

**User Story:** As a user, I want timely and relevant notifications about my carbon progress and new challenges, so that I stay engaged with my sustainability goals without being overwhelmed.

#### Acceptance Criteria

1. WHEN 7 days have elapsed since the User's last weekly summary, THE App SHALL send the User a notification within 24 hours containing their total emissions for the past 7 days, their change relative to the previous 7-day period, and the number of active Challenges.
2. WHEN a new Challenge is generated for the User, THE App SHALL send a push notification within 1 hour of generation, regardless of the User's notification preference settings.
3. THE App SHALL allow the User to configure notification preferences including frequency (daily, weekly, or off) and notification types (progress updates, social feed activity) from the settings screen. Challenge notifications are not subject to User opt-out and SHALL always be delivered.
4. WHILE the User has opted out of all notifications, THE App SHALL not send any push notifications to the User's device except for new Challenge notifications as specified in criterion 2.
5. IF the App would send a push notification that would cause the total push notifications sent to a User within any rolling 24-hour window to exceed 3, THEN THE App SHALL suppress the lowest-priority notification (social feed activity first, then progress updates) to stay within the cap; Challenge notifications are exempt from this cap.
6. WHEN the User has not opened the App for 7 consecutive days and at least one Avatar ecosystem state change has occurred during that period, THE App SHALL send a single re-engagement notification summarizing the Avatar ecosystem changes; this notification does not count toward the daily notification cap.
