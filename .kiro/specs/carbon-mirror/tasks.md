# Implementation Plan: CarbonMirror

## Overview

CarbonMirror is built as a monorepo containing three packages: `mobile` (React Native), `gateway` (Node.js/Express), and `ai-engine` (Python/FastAPI). Tasks follow the dependency order: infrastructure and shared types → auth → onboarding/profile → core calculation services → feature screens → social features → notifications → testing. Property-based tests are placed immediately after the code they exercise to catch regressions early.

---

## Tasks

- [ ] 1. Monorepo scaffold and shared infrastructure
  - [ ] 1.1 Initialise monorepo workspace with packages: `mobile`, `gateway`, `ai-engine`
    - Create root `package.json` with Yarn/npm workspaces; add `apps/mobile`, `services/gateway`, `services/ai-engine` directories
    - Add root `.gitignore`, `README.md`, and `docker-compose.yml` with PostgreSQL, Redis, and service containers
    - _Requirements: 9.1, 9.3_
  - [ ] 1.2 Set up PostgreSQL and run all 11 table migrations
    - Write migration files for all 11 tables: `users`, `lifestyle_profiles`, `emission_records`, `carbon_score_cache`, `scenarios`, `suggestions`, `challenges`, `what_if_queries`, `social_posts`, `post_adoptions`, `notification_log`, `emission_factor_versions`
    - Add `CHECK` constraints, composite PKs, and the `what_if_queries` trim trigger (delete oldest when count > 20)
    - _Requirements: 1.3, 7.5, 9.3, 9.6_
  - [ ] 1.3 Configure Redis and Bull job queue in Node.js gateway
    - Install `ioredis`, `bull`; create `src/queue/index.ts` exporting named queues: `notificationQueue`, `emissionRecalcQueue`
    - Add health-check probe: connect Redis, set key, retrieve, delete
    - _Requirements: 9.4, 10.1_
  - [ ] 1.4 Bootstrap Node.js Express gateway with Zod validation middleware, JWT auth skeleton, and error envelope
    - Initialise Express app; add `zod` request-validation middleware factory; add global error handler emitting `{ error, fields }` envelope as specified in the design
    - Add `GET /health` returning HTTP 200
    - _Requirements: 1.2, 1.4, 7.1, 8.1_
  - [ ] 1.5 Bootstrap Python FastAPI AI Engine with health check and shared Pydantic schemas
    - Create `ai-engine/main.py` with FastAPI app; add `GET /health`; define Pydantic schemas for `LifestyleProfile`, `ScenarioResult`, `Suggestion`, `Challenge`, `WhatIfResult`
    - Configure Hypothesis settings (min 100 examples) in `conftest.py`
    - _Requirements: 2.1, 4.1, 5.1_
  - [ ] 1.6 Set up React Native project with navigation, React Query, and Zustand
    - Bootstrap with React Native CLI (or Expo bare); install `@react-navigation/native` v6, `@tanstack/react-query`, `zustand`, `@react-native-async-storage/async-storage`
    - Wire React Navigation tab bar: Home, Simulator, Avatar, Social, Profile tabs
    - Configure React Query with `AsyncStorage` persister for offline stale-data rendering
    - _Requirements: 1.1_

- [ ] 2. Authentication — register, login, refresh token
  - [ ] 2.1 Implement `/auth/register` and `/auth/login` endpoints in gateway
    - Write Zod schemas for `RegisterBody` and `LoginBody`; implement bcrypt password hashing; issue JWT access token (15 min) and refresh token (30 days); store refresh token hash in `users`
    - _Requirements: 1.3_
  - [ ] 2.2 Implement `/auth/refresh` endpoint and JWT middleware
    - Validate refresh token, rotate and reissue both tokens; add `authMiddleware` that verifies access JWT and attaches `req.user`
    - Apply `authMiddleware` globally to all protected routes
    - _Requirements: 1.3_
  - [ ] 2.3 Implement auth screens in React Native (Register, Login)
    - Create `RegisterScreen` and `LoginScreen` with controlled form inputs; call `/auth/register` and `/auth/login`; store tokens securely with `react-native-keychain`; navigate to Onboarding on first login, Dashboard on subsequent logins
    - _Requirements: 1.1_

- [ ] 3. Onboarding and Lifestyle Profile
  - [ ] 3.1 Implement profile Zod schema and `POST /profiles` gateway endpoint
    - Define `LifestyleProfileSchema`: `commute_distance_km` (number, 0–500), `transport_mode`, `energy_source`, `dietary_pattern`, `consumption_level` as required enums; reject out-of-range distance with the standard validation envelope
    - Write `ProfileRepository.create()` inserting a row with `is_current = TRUE`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ] 3.2 Implement `GET /profiles/me` and `PATCH /profiles/me` gateway endpoints
    - `PATCH` inserts a new profile row with `is_current = TRUE` and sets `is_current = FALSE` on the previous row (version history pattern); triggers async score recalculation job
    - _Requirements: 1.6, 1.7, 1.8_
  - [ ]* 3.3 Write property test P3 — Input Validation Accepts and Rejects Correct Ranges
    - **Property 3: Input Validation Accepts and Rejects Correct Ranges**
    - Use `fast-check`: generate arbitrary floats, assert `validateCommute(x)` accepts iff `x ∈ [0, 500]`; generate arbitrary strings, assert `validateWhatIfQuery(s)` accepts iff `s.length ≤ 200`
    - Tag: `// Feature: carbon-mirror, Property 3: Input Validation Accepts and Rejects Correct Ranges`
    - **Validates: Requirements 1.2, 7.1**
  - [ ] 3.4 Build onboarding flow screens in React Native
    - Create multi-step `OnboardingNavigator` with 5 steps: commute distance (numeric input), transport mode (picker), energy source (picker), dietary pattern (picker), consumption habits (picker)
    - Disable "Next" button on empty field; show inline field-level error on invalid distance; show retry banner if `POST /profiles` fails without clearing form state
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ] 3.5 Build Profile Settings screen in React Native
    - Render all 5 Lifestyle Profile fields in editable form; call `PATCH /profiles/me`; invalidate React Query cache on success to trigger score and scenario refresh
    - _Requirements: 1.6, 1.7, 1.8_

- [ ] 4. Emission Factor Service
  - [ ] 4.1 Implement `EmissionFactorService` module in gateway
    - Create `src/services/emissionFactorService.ts`: `getFactors(source, version?)` fetches from IPCC/EPA/DEFRA endpoint, caches in Redis with 7-day TTL keyed by `{source}-{version}`
    - On fetch failure, serve last cached factors and set `staleness_notice: true` on the response; schedule a Bull retry job every 30 minutes
    - Write to `emission_factor_versions` table on every fresh fetch
    - _Requirements: 9.1, 9.2, 9.4_
  - [ ] 4.2 Implement `GET /emission-factors/:id` endpoint
    - Return factor detail (value, unit, source name, version string) plus `staleness_notice` boolean
    - _Requirements: 9.1, 9.4_
  - [ ] 4.3 Implement background recalculation job for factor version updates
    - Bull worker subscribes to `emissionRecalcQueue`; when a new factor version is stored, queries all `emission_records` using the superseded version and re-queues each for recalculation; enqueues user notification per affected user
    - Must complete all records within 24 hours of factor update
    - _Requirements: 9.2_

- [ ] 5. Carbon Score and Emission Records
  - [ ] 5.1 Implement `POST /score` on Python AI Engine
    - Weighted sum of transport/energy/diet/consumption emission factors; normalise to percentile in [0, 100] against regional baseline; return `{ carbon_score, percentile, emission_records[] }`
    - Emission factors sourced via `EmissionFactorService`
    - _Requirements: 1.5, 9.1, 9.3_
  - [ ] 5.2 Implement `EmissionRecordRepository` in gateway — immutable insert and fetch by ID
    - `insertRecord()`: insert with `recorded_at` (UTC ISO 8601), `factor_source`, `factor_version`, `input_values` JSONB; record is never mutated after insert
    - `findById()`: fetch single record; used for round-trip verification
    - _Requirements: 9.3, 9.6_
  - [ ]* 5.3 Write property test P2 — Emission Record Storage Round-Trip
    - **Property 2: Emission Record Storage Round-Trip**
    - Use `fast-check`: generate random valid emission record payloads; insert via `EmissionRecordRepository.insertRecord()`; retrieve with `findById()`; deep-equal assert on `co2_kg`, `input_values`, `factor_version`, `factor_source`, `recorded_at`; assert `factor_source` and `factor_version` are non-null and non-empty
    - Tag: `// Feature: carbon-mirror, Property 2: Emission Record Storage Round-Trip`
    - **Validates: Requirements 9.1, 9.3, 9.6**
  - [ ] 5.4 Implement `GET /carbon-score` endpoint (cache-read path) and `carbon_score_cache` invalidation logic
    - Return score from `carbon_score_cache`; if cache miss, call AI Engine `/score` synchronously and populate cache
    - On new emission record insert, delete cache row for that user to force recomputation on next request
    - _Requirements: 1.5, 1.7, 1.8_
  - [ ] 5.5 Implement `formatCO2` utility and CO₂ precision rendering in React Native
    - `formatCO2(value: number): string` — always render one decimal place (e.g., `"12.3"`)
    - Apply to every CO₂ value on Dashboard, Simulator, Time Machine, Suggestions, Challenges, Social Feed, Avatar, What-If screens
    - _Requirements: 9.5_
  - [ ]* 5.6 Write property test P13 — CO₂ Value Precision
    - **Property 13: CO₂ Value Precision**
    - Use `fast-check`: generate `co2_kg: float in [0, 1e7]`; assert `formatCO2(co2_kg)` matches `/^\d+\.\d{1}$/`
    - Tag: `// Feature: carbon-mirror, Property 13: CO₂ Value Precision`
    - **Validates: Requirements 9.5**

- [ ] 6. Future Simulator — Three-Scenario Projection
  - [ ] 6.1 Implement `POST /scenarios` on Python AI Engine
    - Given `(profile, timeline_yr ∈ {1, 5, 10})`, compute all three paths: Current `= E_base × years`, Better `= E_base × reduction_factor_better × years` (factor in [0.60, 0.80]), Green `= E_base × reduction_factor_green × years` (factor in [0.20, 0.50]); factors deterministic for a given profile hash
    - Each path returns `{ co2_kg, cost_local, trees_offset, energy_kwh, assumes_uncommitted_changes }`
    - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.7_
  - [ ]* 6.2 Write property test P4 — Scenario Reduction Bounds and Structural Completeness
    - **Property 4: Scenario Reduction Bounds and Structural Completeness**
    - Use `Hypothesis`: generate random valid lifestyle profile dicts; for each timeline in {1, 5, 10}, call `compute_scenarios(profile, timeline)`; assert all three paths present with all four metrics; `better.co2_kg ∈ [0.60×, 0.80×] current.co2_kg`; `green.co2_kg ∈ [0.20×, 0.50×] current.co2_kg`
    - Tag: `# Feature: carbon-mirror, Property 4: Scenario Reduction Bounds and Structural Completeness`
    - **Validates: Requirements 2.1, 2.2, 2.5, 2.6**
  - [ ] 6.3 Implement `GET /scenarios?timeline=` gateway endpoint and `scenarios` table upsert
    - Proxy profile to AI Engine `/scenarios`; upsert results to `scenarios` table; set `assumes_uncommitted_changes` flag; return all three scenario rows
    - SLA: full recomputation within 5 s of profile update (enforced via Bull job priority)
    - _Requirements: 2.1, 2.2, 2.3, 2.7, 1.7, 1.8_
  - [ ] 6.4 Build Future Simulator screen in React Native
    - Render three `ScenarioCard` components (red/yellow/green indicators per design); add `TimelineSlider` with values [1, 5, 10] using Zustand for slider position state
    - On slider change, invalidate `scenarios` React Query key; all 12 metric values (3 paths × 4 metrics) must re-render within 500 ms; show inline disclaimer on `assumes_uncommitted_changes = true` scenarios
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 2.8_

- [ ] 7. Carbon Time Machine — Relatable Equivalents
  - [ ] 7.1 Implement Carbon Equivalent conversion logic in gateway
    - Create `src/services/equivalentsService.ts`: define fixed priority ordered list of 5 equivalent types (km driven, smartphone charges, ceiling fan hours, flights, trees); select first 3 in order; apply conversion factors from `EmissionFactorService`
    - Expose `computeEquivalents(co2_kg: number): EquivalentResult[]`
    - _Requirements: 3.1, 3.2_
  - [ ]* 7.2 Write property test P1 — Carbon Equivalent Round-Trip
    - **Property 1: Carbon Equivalent Round-Trip**
    - Use `fast-check`: generate `v: float in (0, 1e6]` and `f: float in (0.001, 1e4]`; assert `|(v/f)*f - v| / v < 0.01`
    - Tag: `// Feature: carbon-mirror, Property 1: Carbon Equivalent Round-Trip`
    - **Validates: Requirements 3.5**
  - [ ] 7.3 Implement `GET /equivalents` gateway endpoint
    - Fetch current user's latest `co2_kg` from `carbon_score_cache`; call `computeEquivalents()`; return array of exactly 3 equivalents each with `{ type, value, unit, factor, source }`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ] 7.4 Build Carbon Time Machine screen in React Native
    - Render 3 equivalent cards with numeric value and unit label; on tap, display bottom-sheet tooltip showing `factor` and `source` name; use React Query for data; re-fetch when emission record changes
    - _Requirements: 3.1, 3.3, 3.4_

- [ ] 8. AI Lifestyle Detective
  - [ ] 8.1 Implement `POST /detective` on Python AI Engine
    - Rule-based layer: map profile attributes to high-emission patterns; ML layer: gradient-boosted model scores suggestions by predicted CO₂ savings (use IPCC factor data)
    - Each suggestion must include: `emission_source`, `profile_attribute`, `alternative`, `monthly_co2_kg` (rounded to 1 decimal), `time_cost_min_week` (integer)
    - If transit alternative to a driving commute is identified, call Maps API for actual route duration; if Maps API fails, include `transit_time: null` with note
    - Must run within 10 s; return at least 1 suggestion when identifiable
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ]* 8.2 Write property test P10 — Suggestions Schema, Ranking, and Trimming
    - **Property 10: Suggestions Schema, Ranking, and Trimming**
    - Use `Hypothesis`: generate lists of 1–20 suggestion objects with random `monthly_co2_kg` values and required fields; call `rank_and_trim(suggestions)`; for lists ≥ 5 assert length == 5 sorted descending; for lists 1–4 assert length unchanged sorted descending; assert all suggestions have all required fields with correct types
    - Tag: `# Feature: carbon-mirror, Property 10: Suggestions Schema, Ranking, and Trimming`
    - **Validates: Requirements 4.2, 4.4, 4.5**
  - [ ] 8.3 Implement `GET /suggestions` gateway endpoint and `suggestions` table upsert
    - Trigger `POST /detective` async after profile submission/update; upsert results to `suggestions` with `rank` column; return ranked list (top 5 if ≥ 5, all if 1–4, zero-suggestions message if empty)
    - _Requirements: 4.1, 4.4, 4.5, 4.6_
  - [ ] 8.4 Implement `POST /suggestions/:id/acted` gateway endpoint
    - Record `acted_at` UTC timestamp on the suggestion row; validate suggestion belongs to requesting user
    - _Requirements: 4.7_
  - [ ] 8.5 Build AI Lifestyle Detective screen in React Native
    - Render suggestion cards sorted by CO₂ savings descending; show "Already optimised — revisit in 30 days" message when list is empty; "Mark as acted on" button per card; show transit route duration when present
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 9. AI Carbon Challenges
  - [ ] 9.1 Implement `POST /classify-persona` on Python AI Engine
    - Map lifestyle profile fields to one of: `Student`, `Hostel Resident`, `Office Worker`, `Other`; return value must always be one of these four (never null)
    - _Requirements: 5.1_
  - [ ]* 9.2 Write property test P16 — Persona Classification Completeness
    - **Property 16: Persona Classification Completeness**
    - Use `Hypothesis`: generate random valid lifestyle profile dicts; call `classify_persona(profile)`; assert result ∈ `{'Student', 'Hostel Resident', 'Office Worker', 'Other'}` and is never null or empty
    - Tag: `# Feature: carbon-mirror, Property 16: Persona Classification Completeness`
    - **Validates: Requirements 5.1**
  - [ ] 9.3 Implement `POST /challenges/generate` on Python AI Engine
    - Retrieve persona, recent completions (last 90 days), and current profile; sample from challenge template library filtered by persona and recency exclusions; select ≥ 3 challenges with highest expected CO₂ savings; each challenge has `description`, `co2_savings_kg`, `difficulty` (Easy/Medium/Hard), `reward_points` (1–500 integer)
    - _Requirements: 5.2, 5.5, 5.6_
  - [ ]* 9.4 Write property test P5 — Challenge Reward Points Bounds and Minimum Active Count
    - **Property 5: Challenge Reward Points Bounds and Minimum Active Count**
    - Use `Hypothesis`: generate random user persona and lifestyle profile; call `generate_challenges(profile, persona)`; assert `len(challenges) >= 3`; for all challenges assert `1 <= reward_points <= 500` (integer)
    - Tag: `# Feature: carbon-mirror, Property 5: Challenge Reward Points Bounds and Minimum Active Count`
    - **Validates: Requirements 5.2**
  - [ ]* 9.5 Write property test P6 — No Duplicate Challenges Within 90 Days
    - **Property 6: No Duplicate Challenges Within 90 Days**
    - Use `Hypothesis`: generate a random set of recently completed `template_id`s (up to 50); call `generate_challenges(profile, persona, recently_completed)`; assert no returned challenge has a `template_id` in the completed set
    - Tag: `# Feature: carbon-mirror, Property 6: No Duplicate Challenges Within 90 Days`
    - **Validates: Requirements 5.6**
  - [ ] 9.6 Implement challenge CRUD in gateway (`GET /challenges`, `POST /challenges/:id/complete`, `POST /challenges/refresh`)
    - `GET /challenges`: return all active challenges for user; auto-trigger generation job if active count < 3
    - `POST /challenges/:id/complete`: set `status = 'complete'`, `completed_at = now()`; credit `reward_points` and log `co2_savings_kg` to cumulative savings; enqueue replenishment job if active count drops below 3
    - `POST /challenges/refresh`: replace one active challenge with a newly generated one within 5 s; maintain ≥ 3 active
    - _Requirements: 5.2, 5.3, 5.5, 5.7, 5.8_
  - [ ] 9.7 Build Challenges screen in React Native
    - List active challenge cards with description, CO₂ savings, difficulty badge, reward points; "Complete" and "Refresh" buttons; show total reward points and cumulative CO₂ saved on Profile screen
    - _Requirements: 5.2, 5.3, 5.7, 5.8_

- [ ] 10. Checkpoint — Core services complete
  - Ensure all tests pass for tasks 1–9. Verify: Carbon Score calculates within 3 s, Simulator recomputes within 2 s, Detective runs within 10 s, Challenges refresh within 5 s. Ask the user if questions arise.

- [ ] 11. Carbon Avatar
  - [ ] 11.1 Implement `getAvatarState` pure function and regression-cap state machine
    - `getAvatarState(percentile: number): 'Polluted Forest' | 'Grassland' | 'Thriving Forest'` — Polluted > 70, Grassland 30–70, Thriving < 30
    - Implement regression-cap logic: track avatar state change history over rolling 7-day window; if a score change would trigger > 1 ecosystem regression within the window, cap at exactly 1 regression and defer the rest
    - Contextual transition messages must be ≤ 140 characters
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  - [ ]* 11.2 Write property test P12 — Avatar State Machine Correctness and Regression Cap
    - **Property 12: Avatar State Machine Correctness and Regression Cap**
    - Use `fast-check`:
      (a) Generate `percentile: float in [0, 100]`; assert state transitions are correct for all boundary values
      (b) Generate sequences of score changes over 7-day window that trigger ≥ 2 regressions; assert state decrements by at most 1
      (c) Generate random state transitions; assert contextual message length ≤ 140
    - Tag: `// Feature: carbon-mirror, Property 12: Avatar State Machine Correctness and Regression Cap`
    - **Validates: Requirements 6.1, 6.3, 6.5**
  - [ ] 11.3 Implement `GET /avatar-state` gateway endpoint
    - Return `{ state, carbon_score, percentile, co2_to_next_state_kg, contextual_message }`; if already Thriving Forest, return `co2_to_next_state_kg: null` and a "best state reached" message
    - _Requirements: 6.1, 6.3, 6.4_
  - [ ] 11.4 Build Avatar screen in React Native
    - Render three ecosystem state assets (Polluted Forest / Grassland / Thriving Forest); animate transition using React Native Animated (1–3 s duration) on state change; show contextual message on transition
    - Display `carbon_score`, `state` label, and `co2_to_next_state_kg` value (or "best state" message if Thriving Forest); hide these values when user navigates away
    - On Challenge completion, play celebratory animation (2–4 s) before reverting to ecosystem view
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

- [ ] 12. What-If Scanner
  - [ ] 12.1 Implement `POST /whatif` on Python AI Engine
    - spaCy + custom entity recogniser slot-filler extracts `{ activity, quantity, timeframe }` from free text (max 200 chars)
    - On success: return `{ activity_category, co2_monthly_kg, cost_monthly, breakeven_months, parsed_ok: true }`
    - On parse failure: return `{ parsed_ok: false, missing_slots: [...] }` identifying which of activity/quantity/timeframe is missing
    - _Requirements: 7.2, 7.3, 7.4_
  - [ ] 12.2 Implement `POST /whatif` gateway endpoint and `what_if_queries` persistence
    - Validate query ≤ 200 chars; proxy to AI Engine; persist result to `what_if_queries` (regardless of parse success); apply rate limit 10 req/min
    - On parse failure, return HTTP 422 with user-readable message identifying missing slots
    - _Requirements: 7.2, 7.3, 7.4, 7.5_
  - [ ]* 12.3 Write property test P11 — What-If Query History Bounded at 20
    - **Property 11: What-If Query History Bounded at 20**
    - Use `fast-check`: generate `n ∈ [21, 50]` query payloads for a single user; insert all; call `getWhatIfHistory(userId)`; assert returned array length == 20 and contains the 20 most recently inserted
    - Tag: `// Feature: carbon-mirror, Property 11: What-If Query History Bounded at 20`
    - **Validates: Requirements 7.5**
  - [ ] 12.4 Implement `GET /whatif/history` endpoint
    - Return last 20 queries for user, ordered by `submitted_at` descending; database trigger enforces the 20-row cap
    - _Requirements: 7.5_
  - [ ] 12.5 Implement "Apply this change" endpoint logic
    - `POST /whatif/:id/apply`: copy parsed `activity_category` change into `PATCH /profiles/me` payload; trigger full profile update flow (score recalculation, scenario regeneration); return confirmation once recalculation is complete
    - _Requirements: 7.7_
  - [ ] 12.6 Build What-If Scanner screen in React Native
    - Free-text input (max 200 chars); submit button; render `activity_category` label alongside result for user verification; show `co2_monthly_kg`, `cost_monthly`, `breakeven_months` on success; show field-level error identifying missing slots on parse failure; scrollable history list capped at 20 items; "Apply this change" button on each result
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 13. Social Carbon Swap
  - [ ] 13.1 Implement social post validation logic in gateway
    - Create `validatePost` Zod schema: description 1–300 chars, `co2_savings_kg` in [0.01, 500], `activity_category` must be in `VALID_CATEGORIES` set from `EmissionFactorService`
    - On `co2_savings_kg > 500` server-side, still accept submission but flag for confirmation (return `{ requires_confirmation: true }`)
    - Return validation error listing accepted categories if category is unrecognised
    - _Requirements: 8.1, 8.6, 8.8_
  - [ ]* 13.2 Write property test P7 — Social Post CO₂ Savings Validation Bounds
    - **Property 7: Social Post CO₂ Savings Validation Bounds**
    - Use `fast-check`: generate `(description: string, category: string, savings: float)`; assert `validatePost(...)` accepts iff all three constraints hold independently; test each constraint in isolation
    - Tag: `// Feature: carbon-mirror, Property 7: Social Post CO₂ Savings Validation Bounds`
    - **Validates: Requirements 8.1, 8.6**
  - [ ] 13.3 Implement `POST /posts`, `GET /posts`, `POST /posts/:id/flag` gateway endpoints
    - `POST /posts`: validate, persist, make visible within 30 s via feed query
    - `GET /posts`: return feed excluding posts with `flag_count >= 6` (use DB view); include community aggregate header
    - `POST /posts/:id/flag`: increment `flag_count`; once ≥ 6, post excluded from feed automatically
    - _Requirements: 8.1, 8.2, 8.5_
  - [ ]* 13.4 Write property test P14 — Flagged Post Exclusion from Feed
    - **Property 14: Flagged Post Exclusion from Feed**
    - Use `fast-check`: generate list of posts with random `flag_count ∈ [0, 10]`; call `getFeedPosts(posts)`; assert none have `flag_count >= 6`
    - Tag: `// Feature: carbon-mirror, Property 14: Flagged Post Exclusion from Feed`
    - **Validates: Requirements 8.5**
  - [ ] 13.5 Implement `POST /posts/:id/adopt` gateway endpoint and adoption idempotency
    - Insert into `post_adoptions(post_id, user_id)` — composite PK prevents duplicates; increment `adoption_count` on first adoption only; add `co2_savings_kg` to user's cumulative savings within 1 s; return error message if already adopted
    - _Requirements: 8.4, 8.7_
  - [ ]* 13.6 Write property test P8 — Post Adoption Idempotency
    - **Property 8: Post Adoption Idempotency**
    - Use `fast-check`: generate user ID and post ID; call `adoptPost(userId, postId)` once — assert adoption_count incremented by 1 and CO₂ savings added; call again — assert adoption_count unchanged and no duplicate CO₂ savings
    - Tag: `// Feature: carbon-mirror, Property 8: Post Adoption Idempotency`
    - **Validates: Requirements 8.4, 8.7**
  - [ ] 13.7 Implement community aggregate calculation and `GET /posts` header value
    - `getCommunityTotal(adoptions)` sums `co2_savings_kg` from confirmed adoptions only; result served in feed header; refreshed every 60 s via Bull scheduled job writing to Redis
    - _Requirements: 8.3_
  - [ ]* 13.8 Write property test P15 — Community CO₂ Aggregate Accuracy
    - **Property 15: Community CO₂ Aggregate Accuracy**
    - Use `fast-check`: generate random set of confirmed adoption records with `co2_savings_kg` values; assert `getCommunityTotal(adoptions)` equals exact sum of all input `co2_savings_kg` values
    - Tag: `// Feature: carbon-mirror, Property 15: Community CO₂ Aggregate Accuracy`
    - **Validates: Requirements 8.3**
  - [ ] 13.9 Build Social Carbon Swap screen in React Native
    - Scrollable feed of eco-hack posts excluding flagged; community aggregate CO₂ header (poll/refresh every 60 s); "Adopt this hack" button with immediate count increment and confirmation prompt; "Flag" button; "New Post" form with character counter and category picker
    - Show "already adopted" message on duplicate adoption attempt; show validation warning if CO₂ savings > 500 before confirming publish
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 14. Notification System
  - [ ] 14.1 Implement notification dispatcher with rolling 24-hour cap and priority suppression
    - Create Bull worker `notificationWorker.ts`; before every dispatch, query `notification_log` for `user_id` in rolling 24-hour window
    - If non-exempt count would exceed 3, mark the lowest-priority notification `suppressed = true` (social feed first, then progress updates); write to `notification_log` regardless
    - Challenge notifications bypass all cap checks
    - _Requirements: 10.2, 10.3, 10.4, 10.5_
  - [ ]* 14.2 Write property test P9 — Notification Cap and Opt-Out Suppression
    - **Property 9: Notification Cap and Opt-Out Suppression**
    - Use `fast-check`:
      (a) Generate sequences of 1–10 non-exempt and 0–5 challenge jobs in a 24-hour window; run through dispatcher; assert non-exempt dispatched ≤ 3, all challenges dispatched, suppressed are lowest-priority
      (b) Set user opt-out; generate 1–5 non-challenge jobs; assert none dispatched
    - Tag: `// Feature: carbon-mirror, Property 9: Notification Cap and Opt-Out Suppression`
    - **Validates: Requirements 10.4, 10.5**
  - [ ] 14.3 Implement weekly summary notification job
    - Scheduled Bull job: runs daily; checks `notification_log` for each user's last weekly summary; if 7+ days elapsed, enqueue weekly summary within 24 hours containing: total 7-day emissions, change vs previous 7 days, active challenge count
    - _Requirements: 10.1_
  - [ ] 14.4 Implement re-engagement notification job
    - Query users inactive for 7+ consecutive days; check if any avatar state change occurred during that period; if yes, enqueue single re-engagement notification; log with type `re_engagement`; this type is exempt from the rolling 24-hour cap
    - _Requirements: 10.6_
  - [ ] 14.5 Implement `GET /notification-prefs` and `PUT /notification-prefs` endpoints
    - Persist frequency (`daily` / `weekly` / `off`) and type toggles (`progress_updates`, `social_feed`); challenge notifications are not configurable
    - _Requirements: 10.3, 10.4_
  - [ ] 14.6 Build Notification Preferences screen in React Native
    - Frequency picker (daily / weekly / off) and type toggles for progress updates and social feed; persist via `PUT /notification-prefs`; settings persist across screen navigation
    - _Requirements: 10.3_

- [ ] 15. Checkpoint — All features wired end-to-end
  - Ensure all tests pass and all endpoints respond correctly. Smoke-test: API `/health` returns 200, AI Engine `/health` returns 200, Redis connects, PostgreSQL executes test query. Ask the user if questions arise.

- [ ] 16. Property-Based and Unit Tests — remaining properties
  - [ ]* 16.1 Write unit tests for commute distance boundary values (Node.js, Jest)
    - Test `validateCommute` with: -1, 0, 250, 500, 501; assert exact pass/fail for each boundary
    - _Requirements: 1.2_
  - [ ]* 16.2 Write unit tests for What-If slot extractor (Python, Pytest)
    - Test `extract_slots()` with: complete `{activity, quantity, timeframe}` triple; one slot missing; all slots missing; assert `missing_slots` array contents
    - _Requirements: 7.4_
  - [ ]* 16.3 Write unit test for `what_if_queries` history trim trigger (Node.js, Jest)
    - Insert exactly 21 rows for one user; verify the oldest row is deleted and row count is 20
    - _Requirements: 7.5_
  - [ ]* 16.4 Write unit tests for post validation boundaries (Node.js, Jest)
    - Test description exactly 1 char, 300 chars, 301 chars; CO₂ savings 0.005, 0.01, 500, 500.01; assert accept/reject at each boundary
    - _Requirements: 8.1_
  - [ ]* 16.5 Write unit tests for avatar transition message length (Node.js, Jest)
    - Assert message present and ≤ 140 chars for each state change direction: Thriving→Grassland, Grassland→Polluted, Polluted→Grassland, Grassland→Thriving
    - _Requirements: 6.3_
  - [ ]* 16.6 Write unit test for staleness notice on cached emission factor response (Node.js, Jest)
    - Simulate `EmissionFactorService` fetch failure; assert next `getFactors()` call returns last cached factors with `staleness_notice: true`
    - _Requirements: 9.4_
  - [ ]* 16.7 Write unit test asserting re-engagement notification is exempt from rolling 24-hour cap (Node.js, Jest)
    - Send 3 non-exempt notifications to fill cap; dispatch a re-engagement notification; assert it is not suppressed
    - _Requirements: 10.6_

- [ ] 17. Integration and Smoke Tests
  - [ ]* 17.1 Write integration test: Onboarding → Carbon Score → Scenario generation
    - Against test DB and mock AI Engine: `POST /profiles` → assert Carbon Score returned within 3 s → assert all three scenario paths available for each timeline
    - _Requirements: 1.5, 2.1, 2.3_
  - [ ]* 17.2 Write integration test: Profile update → cache invalidation → scenario recomputation within 5 s
    - `PATCH /profiles/me` → assert `carbon_score_cache` row invalidated → assert new scenarios computed and stored within 5 s
    - _Requirements: 1.7, 1.8_
  - [ ]* 17.3 Write integration test: What-If query → Apply → full recalculation
    - `POST /whatif` (successful parse) → `POST /whatif/:id/apply` → assert profile updated, score recalculated, scenarios regenerated, confirmation returned
    - _Requirements: 7.7_
  - [ ]* 17.4 Write integration test: Social post publish → feed visibility within 30 s
    - `POST /posts` → `GET /posts` within 30 s → assert post appears in feed
    - _Requirements: 8.2_
  - [ ]* 17.5 Write integration test: Challenge complete → reward points credited → cumulative CO₂ updated
    - `POST /challenges/:id/complete` → assert `reward_points` added to user account → assert `co2_savings_kg` added to cumulative savings
    - _Requirements: 5.3_
  - [ ]* 17.6 Write integration test: Emission factor fetch failure → staleness notice → factor refresh → notice removed
    - Disable mock factor endpoint → assert `staleness_notice: true` on next factor-dependent response → re-enable mock → assert notice removed within 1 hour (fast-forwarded in test time)
    - _Requirements: 9.4_
  - [ ]* 17.7 Write integration test: New challenge generated → push notification enqueued within 1 hour
    - Trigger challenge generation; assert Bull job enqueued with type `challenge` and `sent_at` within 1 hour
    - _Requirements: 10.2_
  - [ ]* 17.8 Write integration test: Maps API transit route for commute suggestion
    - Mock Maps API; submit driving-commute profile to `POST /detective`; assert transit suggestion includes route duration
    - _Requirements: 4.3_
  - [ ]* 17.9 Write integration test: 7-day inactivity + avatar change → re-engagement notification
    - Set user `last_open` to 8 days ago; simulate avatar state change; run re-engagement job; assert notification dispatched and not counted toward 24-hour cap
    - _Requirements: 10.6_
  - [ ]* 17.10 Write smoke tests for all services
    - Node.js API `GET /health` → HTTP 200; Python AI Engine `GET /health` → HTTP 200; PostgreSQL connection pool test query; Redis connect/set/get/delete; FCM/APNs dry-run ping
    - _Requirements: 9.1_

- [ ] 18. React Native UI Tests (Detox)
  - [ ]* 18.1 Detox: Onboarding flow — field presence, empty-field blocking, invalid distance error
    - Assert all 5 fields present; tap "Next" with empty field → blocked; enter 501 km → inline error shown
    - _Requirements: 1.1, 1.2, 1.4_
  - [ ]* 18.2 Detox: Simulator slider — 12 metric values update within 500 ms
    - Drag `TimelineSlider`; assert all 12 values (3 paths × 4 metrics) re-render within 500 ms
    - _Requirements: 2.8_
  - [ ]* 18.3 Detox: Carbon Time Machine — equivalent tap shows tooltip with factor and source
    - Tap each of the 3 equivalent cards; assert tooltip appears with `factor` and `source` text
    - _Requirements: 3.3_
  - [ ]* 18.4 Detox: Avatar screen — correct state label and CO₂-to-next-state rendered
    - Assert ecosystem state label matches current percentile; assert CO₂-to-next-state value displayed (or "best state" if Thriving Forest)
    - _Requirements: 6.4_
  - [ ]* 18.5 Detox: Challenge completion — celebratory animation 2–4 s then reverts
    - Tap "Complete" on a challenge; assert animation plays for 2–4 s; assert standard ecosystem view resumes after
    - _Requirements: 6.6_
  - [ ]* 18.6 Detox: What-If history — scrollable list capped at 20 items
    - Navigate to What-If Scanner history; assert list renders at most 20 items
    - _Requirements: 7.5_
  - [ ]* 18.7 Detox: Notification preferences — toggles persist across navigation
    - Toggle "Social feed" off; navigate away; navigate back; assert toggle is still off
    - _Requirements: 10.3_

- [ ] 19. Final checkpoint
  - Ensure all tests pass (unit, PBT, integration, smoke, Detox). Verify no property test has < 100 iterations. Ask the user if any tasks or edge cases need attention.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP build
- Each task references specific requirements for full traceability
- All PBT tasks must run a minimum of 100 iterations per property (configured in Jest globals for fast-check and `settings(max_examples=100)` for Hypothesis)
- Property tests are deliberately placed immediately after the code they validate to catch regressions at the earliest possible point
- Emission records are immutable after insert — updates produce new rows; this is enforced at the repository layer, not just by convention
- The `what_if_queries` 20-row cap is enforced by a PostgreSQL trigger (task 1.2) and verified by property test P11 and unit test 16.3
- Challenge exemption from the notification cap is enforced unconditionally at the dispatcher level, not by user preference settings
- Re-engagement notifications are always exempt from the rolling 24-hour cap (distinct type in `notification_log`)
- Maps API failures in the Lifestyle Detective are graceful: suggestion is surfaced without the duration annotation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "1.6"] },
    { "id": 2, "tasks": ["2.1", "2.2"] },
    { "id": 3, "tasks": ["2.3", "3.1", "4.1"] },
    { "id": 4, "tasks": ["3.2", "3.4", "4.2", "4.3", "5.1"] },
    { "id": 5, "tasks": ["3.3", "3.5", "5.2"] },
    { "id": 6, "tasks": ["5.3", "5.4", "6.1", "7.1", "8.1", "9.1"] },
    { "id": 7, "tasks": ["5.5", "5.6", "6.2", "6.3", "7.2", "7.3", "8.2", "8.3", "8.4", "9.2", "9.3", "11.1", "12.1"] },
    { "id": 8, "tasks": ["6.4", "7.4", "8.5", "9.4", "9.5", "9.6", "11.2", "11.3", "12.2", "13.1"] },
    { "id": 9, "tasks": ["9.7", "11.4", "12.3", "12.4", "12.5", "13.2", "13.3", "14.1"] },
    { "id": 10, "tasks": ["12.6", "13.4", "13.5", "13.7", "14.2", "14.3", "14.4", "14.5"] },
    { "id": 11, "tasks": ["13.6", "13.8", "13.9", "14.6", "16.1", "16.2", "16.3", "16.4", "16.5", "16.6", "16.7"] },
    { "id": 12, "tasks": ["17.1", "17.2", "17.3", "17.4", "17.5", "17.6", "17.7", "17.8", "17.9", "17.10"] },
    { "id": 13, "tasks": ["18.1", "18.2", "18.3", "18.4", "18.5", "18.6", "18.7"] }
  ]
}
```
