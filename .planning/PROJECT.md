# VisionCheck

## What This Is

A mobile-first React web app for vision screening in low-resource settings (NGOs, community health workers, rural clinics). Users run a self-guided 8-test eye assessment on their phone and get an urgency-classified result with an AI-generated summary. Built for RevolutionUC 2026.

## Core Value

A patient or health worker can complete a full eye screening and get actionable results — including when to urgently see a doctor — without any special equipment or connectivity.

## Requirements

### Validated

- ✓ Welcome screen with 8-language support — existing
- ✓ User profile collection (age, diabetes, glasses) — existing
- ✓ 8-test screening flow: Tumbling E acuity, Ishihara color, astigmatism, Landolt C contrast, near vision, Amsler grid, peripheral, symptoms — existing
- ✓ Results dashboard with urgency classification (routine/soon/urgent/emergency) — existing
- ✓ Gemini AI summary of results — existing
- ✓ Voice narration via browser Speech Synthesis — existing
- ✓ WhatsApp/native share buttons — existing

### Active

- [ ] Safety disclaimer ("not a diagnosis") shown prominently before testing
- [ ] "How it works" tutorial / onboarding popup
- [ ] Phone distance calibration guide with auto letter-size adjustment
- [ ] Virtual lens simulation / trial step for approximate correction estimation
- [ ] Inconsistency detection with retest prompts
- [ ] Clinic/NGO referral links on results screen
- [ ] Save results to local storage with history view
- [ ] Multi-session progress comparison (test-over-test graph)
- [ ] CHW batch mode for anonymous community tracking
- [ ] PDF export of results (jsPDF already installed)

### Out of Scope

- Actual medical diagnosis — screening tool only; always refer to a doctor
- EHR/hospital system integration — out of scope for v1, complexity too high
- Native iOS/Android app — PWA covers the mobile use case
- Real-time video consultation — bandwidth not reliable in target settings

## Context

- **Stack:** Create React App, @google/generative-ai, jsPDF (installed, not wired), PWA manifest configured
- **Key files:** `src/App.js` (routing state machine), `src/screens/` (one file per screen), `src/utils/scoring.js`, `src/utils/gemini.js`, `src/utils/voice.js`
- **Target users:** Patients in low-resource settings (rural, NGO clinics), community health workers (CHWs) doing population screening
- **Context:** RevolutionUC 2026 hackathon project. App is fully functional for 8-test flow. Focus of this milestone: fill the 7 identified gaps from feature audit.
- **Prior work:** gap analysis identified: missing calibration, safety disclaimer, tutorial, lens simulation, retest detection, clinic links, data persistence/history

## Constraints

- **Tech stack:** Must stay within Create React App — no ejecting, no framework migration
- **Offline-first:** Core tests must work without internet (Gemini has local fallback already)
- **No backend:** All data local (localStorage). No server, no auth, no DB.
- **jsPDF:** Already installed — use it for PDF export, don't add alternatives

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| localStorage for persistence | No backend, offline-first, privacy for health data | — Pending |
| Skip lens simulation physical kit flow | Too hardware-dependent; virtual simulation is achievable | — Pending |
| CHW batch mode as optional toggle | Volunteers need anonymous aggregate data; regular users don't | — Pending |

---
*Last updated: 2026-03-28 after initialization*
