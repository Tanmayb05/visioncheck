# Roadmap: VisionCheck

## Overview

This milestone closes the 7 identified gaps from the post-launch feature audit. Starting from a fully functional 8-test screening flow, four phases layer in: trustworthy onboarding (disclaimer + calibration), more accurate testing (lens simulation + inconsistency detection), actionable results (referral links + local history + PDF export), and a CHW batch mode for population-level screening.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Safe Onboarding** - Add safety disclaimer, tutorial popup, and phone calibration before any test begins
- [ ] **Phase 2: Test Quality** - Introduce virtual lens simulation and inconsistency detection with retest prompts
- [ ] **Phase 3: Results Utility** - Add referral links, local history, progress graph, and PDF export to the results screen
- [ ] **Phase 4: CHW Mode** - Enable community health worker batch mode with anonymized patient tracking

## Phase Details

### Phase 1: Safe Onboarding
**Goal**: Users are informed, consented, and physically calibrated before running any test
**Depends on**: Nothing (first phase)
**Requirements**: ONBR-01, ONBR-02, ONBR-03, ONBR-04
**Success Criteria** (what must be TRUE):
  1. User sees a prominent "not a diagnosis" safety disclaimer before the first test loads
  2. User can open a tutorial popup that explains the 8-test flow at any point before testing
  3. User is shown a distance calibration guide (with visual indicator) and prompted to adjust phone distance before tests begin
  4. Letter and symbol sizes on all test screens automatically scale to the physical size appropriate for the detected or user-entered screen size
**Plans**: TBD

### Phase 2: Test Quality
**Goal**: Tests produce more reliable results through lens estimation and inconsistency detection
**Depends on**: Phase 1
**Requirements**: LENS-01, LENS-02, RELY-01, RELY-02
**Success Criteria** (what must be TRUE):
  1. User completes a virtual lens simulation step where blur levels are presented incrementally and "Clear / Blurry" is judged
  2. User sees an approximate correction range derived from lens trial responses on the results screen
  3. When an inconsistent result is detected (e.g., better score on harder line), user is prompted to retest that eye before proceeding
  4. User can trigger a retest for any individual test directly from the results screen
**Plans**: TBD

### Phase 3: Results Utility
**Goal**: Results screen becomes a complete, shareable, and longitudinal health record for the user
**Depends on**: Phase 2
**Requirements**: REFL-01, REFL-02, DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. Results screen displays at least one clinic or NGO referral link filtered to the user's country
  2. User can save a completed screening to local storage and see it appear in a history list showing date, urgency level, and summary
  3. User can view a graph comparing acuity scores across past sessions for each eye
  4. User can export the current results as a downloadable PDF
**Plans**: TBD

### Phase 4: CHW Mode
**Goal**: Community health workers can run multiple anonymous screenings and review aggregate urgency data
**Depends on**: Phase 3
**Requirements**: CHW-01, CHW-02
**Success Criteria** (what must be TRUE):
  1. A CHW mode toggle is accessible in the app that strips identifiable patient data before saving any result
  2. CHW mode shows an aggregate summary view displaying patient counts broken down by urgency tier (routine / soon / urgent / emergency)
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Safe Onboarding | 0/TBD | Not started | - |
| 2. Test Quality | 0/TBD | Not started | - |
| 3. Results Utility | 0/TBD | Not started | - |
| 4. CHW Mode | 0/TBD | Not started | - |
