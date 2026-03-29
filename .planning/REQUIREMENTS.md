# Requirements: VisionCheck

**Defined:** 2026-03-28
**Core Value:** A patient or health worker can complete a full eye screening and get actionable results — including when to urgently see a doctor — without any special equipment or connectivity.

## v1 Requirements

### Onboarding

- [ ] **ONBR-01**: User sees a clear "not a diagnosis" safety disclaimer before any test begins
- [ ] **ONBR-02**: User can view a "How it works" tutorial popup explaining the test flow
- [ ] **ONBR-03**: User is guided to hold the phone at the correct distance before testing (calibration step with visual indicator)
- [ ] **ONBR-04**: Letter/symbol size auto-adjusts based on detected or entered screen size to ensure consistent physical sizing

### Lens Trial

- [ ] **LENS-01**: App presents a virtual lens simulation step where user judges "Clear?" vs "Blurry?" at incrementally adjusted contrast/blur levels
- [ ] **LENS-02**: App calculates an approximate correction range from lens trial responses and includes it in results

### Reliability

- [ ] **RELY-01**: App detects inconsistent results across a test (e.g., better score on harder line than easier) and prompts user to retest that eye
- [ ] **RELY-02**: App shows a retest button per individual test from the results screen

### Referral

- [ ] **REFL-01**: Results screen links to at least one local clinic or NGO directory for follow-up care
- [ ] **REFL-02**: Links are filterable or regionally relevant (country-level at minimum)

### Data & History

- [ ] **DATA-01**: User can optionally save test results to local storage after completing a screening
- [ ] **DATA-02**: User can view a history list of past screenings (date, urgency level, summary)
- [ ] **DATA-03**: User can view a progress graph comparing acuity scores across sessions for each eye
- [ ] **DATA-04**: User can export results as a PDF (using jsPDF)

### CHW Mode

- [ ] **CHW-01**: A "Community Health Worker" mode toggle is available that anonymizes patient data before saving
- [ ] **CHW-02**: CHW mode aggregates results across multiple patients into a summary view (count by urgency tier)

## v2 Requirements

### Advanced Referral

- **REFL-03**: GPS-based nearest clinic suggestion
- **REFL-04**: In-app appointment booking flow

### Advanced Analytics

- **DATA-05**: Export CHW aggregate data as CSV
- **DATA-06**: Sync data to an optional cloud backend

### Accessibility

- **ACCS-01**: High-contrast UI mode for low-vision users reviewing results
- **ACCS-02**: Screen reader compatibility audit

## Out of Scope

| Feature | Reason |
|---------|--------|
| Medical diagnosis | Legal/safety — screening only, always refer to doctor |
| EHR/hospital integration | Too complex for v1, no backend |
| Native app (iOS/Android) | PWA covers mobile use case |
| Real-time video consultation | Bandwidth unreliable in target settings |
| OAuth / user accounts | No backend; local storage only |
| Physical lens kit integration | Hardware-dependent, impractical for distribution |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ONBR-01 | Phase 1 | Pending |
| ONBR-02 | Phase 1 | Pending |
| ONBR-03 | Phase 1 | Pending |
| ONBR-04 | Phase 1 | Pending |
| LENS-01 | Phase 2 | Pending |
| LENS-02 | Phase 2 | Pending |
| RELY-01 | Phase 2 | Pending |
| RELY-02 | Phase 2 | Pending |
| REFL-01 | Phase 3 | Pending |
| REFL-02 | Phase 3 | Pending |
| DATA-01 | Phase 3 | Pending |
| DATA-02 | Phase 3 | Pending |
| DATA-03 | Phase 3 | Pending |
| DATA-04 | Phase 3 | Pending |
| CHW-01 | Phase 4 | Pending |
| CHW-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after initial definition*
