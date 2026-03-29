# VisionCheck — Product Requirements Document

**Version:** 2.0  
**Date:** March 28, 2026  
**Author:** VisionCheck Team  
**Hackathon:** RevolutionUC 2026  

---

## 1. Problem Statement

### 1.1 The crisis

Sub-Saharan Africa carries a disproportionate burden of preventable blindness. The region is home to 7.1% of the world's 38 million blind individuals, while having fewer than 1 ophthalmologist per 1 million people. Approximately 1% of the African population is blind, with cataract as the leading cause (~50% of cases), followed by trachoma, glaucoma, and uncorrected refractive errors.

Glaucoma alone affects roughly 6 million people across the continent, with up to half a million already blind. The disease has an earlier onset and more aggressive course in people of African descent — yet only 1 in 20 people with the condition in Africa are even aware they have it. Over 50% present with blindness at the time of diagnosis because they never received a screening.

For children, the consequences are compounding: visually impaired children in low- and middle-income countries are 5-7 percentage points less likely to ever enroll in school, complete primary education, or become literate. In Francophone Africa, only about 5% of second-graders have ever participated in a vision screening. Uncorrected refractive error is the single most common vision problem among children — and the most easily fixable with a pair of glasses.

Two out of three people in low-income countries who need glasses don't have access to them. One in two who need cataract surgery can't access it.

### 1.2 The opportunity

Smartphone adoption in sub-Saharan Africa was at 51% in 2022 and is projected to reach 87% by 2030. Android Go has been pre-installed on over 40 million entry-level smartphones across Nigeria, Kenya, and Ethiopia alone. Mobile penetration is approaching 50% across the region, with over 500 million unique subscribers.

A smartphone screen is precise enough to administer the same basic vision screening tests that optometrists have relied on for over a century: Snellen acuity charts, Ishihara color plates, astigmatism dials, Amsler grids, and contrast charts. None of these require special hardware.

We can bring the eye clinic to the phone.

### 1.3 Why existing solutions fall short

Peek Vision requires clinical-grade training and organizational partnerships. EyeQue requires a $30+ hardware attachment. WHO's WHOeyes app covers only visual acuity. Generic eye chart apps offer a single test with no analysis, no voice guidance, no low-literacy support, and no referral pathway.

No existing tool combines comprehensive multi-test screening, AI-powered analysis, multilingual voice guidance, offline capability, and zero hardware cost — all designed for low-literacy users in low-resource settings.

---

## 2. Product Vision

**VisionCheck** is a free, mobile-first web application that delivers a comprehensive basic eye screening using only a smartphone. It requires no special hardware, no internet connection after initial load, and no medical training to operate. It is designed from the ground up for people who may never have had an eye test, may not be able to read, and may live hours away from the nearest clinic.

**One-liner:** A free eye test in your pocket — for the 1 billion people who've never had one.

**Positioning:** VisionCheck is a screening and referral tool, not a diagnostic instrument. It identifies people who likely have a treatable vision problem and connects them to care. The goal is not to replace optometrists — it's to find the millions of people who need one and don't know it.

---

## 3. Target Users

### 3.1 Primary: Unscreened individuals in low-resource settings

- Adults and children (8+) in sub-Saharan Africa, South Asia, and rural communities worldwide
- Have never had an eye test and may not know they have a vision problem
- Smartphone access (own, shared, or community phone)
- Potentially low literacy — the app must be fully navigable without reading
- May live in bright outdoor environments with no access to controlled lighting
- Primarily Android users on low-end devices (1-2GB RAM)

### 3.2 Secondary: Community health workers (CHWs) and teachers

- Conduct screenings in villages, schools, and mobile clinics
- Research shows trained teachers can effectively screen children using simple tools
- Need batch screening capability: screen a classroom of 30 students, generate one report
- Limited technical training — app must be self-explanatory
- Need shareable results (WhatsApp, SMS, PDF) to forward to referral centers

### 3.3 Tertiary: NGOs and public health organizations

- Sightsavers, Orbis International, WHO AFRO, OneSight EssilorLuxottica Foundation
- Need aggregated anonymized data for regional planning and resource allocation
- Integration with existing referral networks and eye care programs
- Evidence of screening volume and detection rates for grant reporting

---

## 4. Feature Requirements

### 4.1 Core screening tests (MVP — hackathon scope)

| # | Test | What it screens for | Method | Literacy required | Priority |
|---|---|---|---|---|---|
| 1 | Visual acuity (Tumbling E) | Myopia, hyperopia, general blur | Tumbling E optotype — user swipes direction E faces. Per-eye testing | None | P0 |
| 2 | Color vision | Red-green and blue-yellow deficiency | Ishihara-style dot plates with number identification | Numerals only | P0 |
| 3 | Astigmatism | Uneven corneal curvature | Radial line dial — tap lines that look different | None | P0 |
| 4 | Contrast sensitivity | Early cataracts, glaucoma, corneal opacity | Landolt C at decreasing contrast levels | None | P0 |
| 5 | Near vision / presbyopia | Age-related farsightedness | Calibrated reading text at decreasing sizes | Minimal | P0 |
| 6 | Amsler grid | Macular degeneration, macular edema, central field defects | Grid with central fixation — report wavy, blank, or dark areas | None | P0 |
| 7 | Symptom questionnaire | Cataracts, glaucoma, trachoma, diabetic retinopathy, retinal detachment, dry eye | Structured icon-driven question flow with risk scoring | None (icon-based) | P0 |
| 8 | Peripheral vision quick test | Advanced glaucoma field loss | Dot detection at screen periphery while fixating centrally | None | P1 |

### 4.2 Children's mode (hackathon scope)

For users under 12 or anyone who cannot identify numbers or letters:
- LEA symbol test (house, circle, square, apple) instead of Tumbling E for visual acuity
- Matching card interface: "Point to the shape that matches what you see"
- Larger tap targets (64px minimum)
- Simplified 3-color traffic light results: green (OK), yellow (check needed), red (see doctor)
- Designed for teachers to administer in a classroom setting

### 4.3 Symptom questionnaire design

The questionnaire bridges the gap between what we can screen on a phone and what requires clinical tools. It uses icon-based responses so literacy is not required.

| Symptom cluster | Likely condition | Urgency flag | Icons |
|---|---|---|---|
| Cloudy/foggy vision, night difficulty, glare sensitivity, fading colors, double vision | Cataract (50% of African blindness) | Soon | Cloud icon, moon icon, sun glare icon |
| Eye pain, halos around lights, tunnel vision, family history of blindness | Glaucoma (earlier onset in African descent) | Urgent | Pain icon, halo icon, tunnel icon |
| Itchy eyes, tearing, crusty lashes, light sensitivity, childhood infection history | Trachoma risk | Soon | Itch icon, tear icon, sun icon |
| Sudden floaters, flashes of light, curtain/shadow over vision | Retinal detachment | Emergency | Flash icon, curtain icon |
| Blurred vision + known diabetes or family diabetes | Diabetic retinopathy | Urgent | Blur icon, glucose icon |
| Red eye, pain, discharge, recent trauma or foreign body | Infection / injury | Soon | Red eye icon, bandage icon |
| Burning, gritty/sandy feeling, excessive tearing, dryness | Dry eye / environmental | Routine | Sand icon, wind icon |

### 4.4 AI-powered results engine (hackathon scope)

**Google Gemini API integration:**
- Input: All test results + symptom responses + age + gender as structured JSON
- Output: Plain-language health summary in user's selected language
- Risk stratification: routine / soon / urgent / emergency
- Personalized next-step recommendations based on detected issues
- Contextual awareness: references nearest known eye care resources where possible
- Fallback: If offline or API fails, show pre-computed result templates based on score thresholds

### 4.5 Voice guidance (hackathon scope)

**ElevenLabs integration:**
- Voice narration for every test instruction, every button, every result
- Critical for low-literacy users — the primary interaction mode, not a nice-to-have
- Languages (MVP): English, French, Swahili, Amharic
- Languages (v1.1): Yoruba, Hausa, Zulu, Igbo, Somali, Afrikaans
- Warm, reassuring, unhurried tone — not clinical or robotic
- Fallback: On-screen icon animations if audio fails or user enables silent mode
- Low-data mode: Pre-generated audio clips cached locally after first load

### 4.6 Accessibility and localization

- Icon-driven navigation throughout — every action has an icon, not just text
- All tap targets minimum 48px (64px in children's mode)
- High-contrast UI optimized for outdoor / bright sunlight conditions
- Right-to-left layout support for Amharic and Arabic (v1.1)
- Color choices tested for color-blind accessibility in all non-color-test screens
- Screen reader compatible for users with partial vision
- Works on Android Go devices (1GB RAM, small screens)
- Font sizes scale to device — minimum 16px body text

### 4.7 Results and reporting

- Visual summary card with pass/warning/fail indicators per test
- AI-generated plain-language summary (Gemini)
- Downloadable PDF report with QR code linking to digital results
- WhatsApp share button: generates formatted text message with results summary
- SMS fallback: Short coded result string for feature phones (e.g., "VA:R20/40 L20/30 COL:OK AST:WARN CTR:OK PRE:FAIL → REFER")
- Print-friendly view for clinics with printers

### 4.8 Community health worker (CHW) batch mode

- Screen multiple patients in sequence without reloading app
- Patient log with anonymous ID (no names stored)
- Aggregate report: "Screened 28 students. 8 need referral. 3 urgent."
- Export as CSV for data entry into health systems
- Offline-first: Full functionality without internet

---

## 5. Africa-specific UX design principles

These principles are grounded in the research on barriers to eye care adoption in Africa and mobile internet usage patterns.

### 5.1 Design for zero literacy

The entire screening flow must be completable by someone who cannot read any language. This means:
- Tumbling E (swipe direction) instead of Snellen letters for acuity
- Icon-based symptom questionnaire with audio prompts
- Swipe and tap gestures instead of text input wherever possible
- Results shown as color-coded visual indicators, not text scores
- Voice narration as the primary instruction channel

### 5.2 Design for shared devices

Many users in rural Africa share a phone within a household or community:
- No account creation required — zero setup
- No personal data stored on device after session ends
- Results can be shared immediately via WhatsApp/SMS then discarded
- Each screening session is independent

### 5.3 Design for low bandwidth and offline use

- Progressive Web App (PWA) with service worker caching
- Core tests work with zero internet after first load
- AI analysis and voice generation are "enhancement" features — results are meaningful without them
- Low-data mode toggle: Skip voice, skip AI, run tests locally
- Total app size under 3MB for initial load

### 5.4 Design for bright outdoor environments

- High-contrast color scheme (dark text on light backgrounds, not vice versa)
- No subtle gradients or thin lines that wash out in sunlight
- Test stimuli (letters, plates, grids) rendered at maximum contrast
- Brightness check prompt before tests begin

### 5.5 Design for trust and adoption

Research indicates that misconceptions about spectacles and preference for traditional medicine are significant barriers:
- Results screen includes culturally sensitive explanation of what the findings mean
- Emphasis: "Glasses are not a sign of weakness — they are a tool like shoes for your feet"
- Never use fear-based messaging
- Show that the app is endorsed/used by known health organizations (when applicable)
- Disclaimer always visible: "This is a screening, not a diagnosis"

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React (Single Page App) | Fast, component-based, works as PWA. React works well on low-end devices with virtual DOM. |
| Hosting | Vercel or Netlify | Free tier, global CDN with African PoPs, instant deploys |
| AI analysis | Google Gemini API | Multi-language, strong medical reasoning, generous free tier |
| Voice | ElevenLabs API | Natural multilingual TTS, low latency, emotional range |
| Reports | Client-side PDF generation (jsPDF) | Works offline, no server needed |
| Data | React state + optional Supabase | Zero-server MVP; Supabase for CHW batch mode later |
| Offline | Service Worker + Cache API | Core tests cached after first visit |

### 6.2 Architecture diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        USER'S PHONE                           │
│                                                               │
│  ┌─────────────────── SCREENING ENGINE ────────────────────┐  │
│  │                                                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌─────────┐  │  │
│  │  │ Tumbling │ │ Color    │ │ Astigmat.  │ │Contrast │  │  │
│  │  │ E Acuity │ │ Vision   │ │ Dial       │ │Sensitiv.│  │  │
│  │  └────┬─────┘ └────┬─────┘ └─────┬──────┘ └────┬────┘  │  │
│  │       │             │             │              │       │  │
│  │  ┌────┴────┐ ┌──────┴─────┐ ┌────┴─────┐ ┌─────┴────┐  │  │
│  │  │ Near    │ │ Amsler     │ │ Periph.  │ │ Symptom  │  │  │
│  │  │ Vision  │ │ Grid       │ │ Vision   │ │ Quest.   │  │  │
│  │  └────┬────┘ └──────┬─────┘ └────┬─────┘ └─────┬────┘  │  │
│  │       │             │             │              │       │  │
│  │       └─────────────┴─────────────┴──────────────┘       │  │
│  │                          │                               │  │
│  │              ┌───────────▼───────────┐                   │  │
│  │              │    Results Engine     │                   │  │
│  │              │  (Local scoring +     │                   │  │
│  │              │   risk stratification)│                   │  │
│  │              └───────────┬───────────┘                   │  │
│  └──────────────────────────┼──────────────────────────────┘  │
│                             │                                 │
│          ┌──────────────────┼──────────────────┐              │
│          │                  │                  │              │
│          ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  PDF Report  │  │  Gemini API  │  │  ElevenLabs  │        │
│  │  (offline)   │  │  (online)    │  │  (online)    │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                  │                │
│         ▼                 ▼                  ▼                │
│  ┌──────────────────────────────────────────────────┐         │
│  │              SHARE / EXPORT                      │         │
│  │  WhatsApp │ SMS │ PDF │ CSV (CHW) │ Print        │         │
│  └──────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────┘
```

### 6.3 Data flow

1. User selects language → cached audio loads (if available) or ElevenLabs generates voice prompts
2. User completes each test → results stored in React state (never leaves device)
3. Symptom questionnaire completes → risk scores computed locally
4. All tests complete → results JSON sent to Gemini API for enhanced analysis (if online)
5. If offline → local scoring algorithm generates results using pre-computed thresholds
6. Results displayed on screen → available as PDF, WhatsApp text, or SMS summary
7. No personal data stored after session unless user explicitly saves/shares
8. CHW batch mode: anonymized session data stored in local storage until exported

### 6.4 Offline strategy

| Component | Offline behavior |
|---|---|
| All 8 screening tests | Fully functional — no network needed |
| Local results scoring | Fully functional — threshold-based |
| Gemini AI summary | Unavailable — shows "Enhanced analysis requires internet" with local summary instead |
| ElevenLabs voice | Unavailable unless pre-cached — falls back to on-screen icon animations |
| PDF generation | Fully functional — client-side jsPDF |
| WhatsApp/SMS sharing | Uses device's native share — works if device has signal |

---

## 7. Screen-by-screen specification

### Screen 1: Welcome and language selection
- App logo (eye icon) and name "VisionCheck"
- Language selector with flag icons (tap to select, no reading required)
- Animated hand icon showing "hold phone at arm's length"
- Brightness check: "Is this white box clearly visible?" (auto-detect if screen brightness is sufficient)
- Disclaimer in selected language + voice: "This is a screening tool, not a diagnosis"
- Large green CTA button with play icon: "Start Screening"

### Screen 2: User profile (minimal)
- Age range selector: icons showing child / young adult / adult / elder
- "Who is being tested?" icons: myself / my child / someone else
- "Do you have diabetes?" yes/no (affects risk scoring)
- "Do you wear glasses?" yes/no/don't know
- No name, no registration, no personal data

### Screen 3: Visual acuity — Tumbling E
- Eye selector: animated icon showing which eye to cover
- Large E displayed in one of 4 rotations
- User swipes in the direction the E "points" (up/down/left/right)
- 4 large arrow buttons as fallback for users unfamiliar with swiping
- E decreases in size each correct round
- Per-eye testing: right eye first, then left
- Voice: "Cover your left eye. Which direction is the letter pointing?"
- Progress dots at top

### Screen 4: Color vision — Ishihara plates
- Dot plate displayed prominently
- Number pad (0-9) for input
- "I can't see a number" button with X icon
- 4-6 plates including 1 control plate
- Voice: "What number do you see in the circle?"

### Screen 5: Astigmatism — radial dial
- Radial line pattern with center dot
- Instruction: focus on center, tap lines that look different
- Lines highlight on tap (toggle selection)
- "All lines look the same" button
- Voice: "Look at the center dot. Do all lines look the same?"

### Screen 6: Contrast sensitivity — Landolt C
- C-shaped ring at decreasing contrast levels
- "Which direction is the gap?" — 4 directional buttons
- "I can't see it" button
- Progressive difficulty until failure
- Voice: "Can you see the letter C? Which way is the opening?"

### Screen 7: Near vision — reading test
- Text displayed at calibrated size (user holds phone at reading distance ~35cm)
- Progressively smaller text
- "I can read this" / "I can't read this" buttons
- For non-readers: use symbol patterns (shapes decreasing in size)
- Voice: "Hold the phone at reading distance. Can you read the text?"

### Screen 8: Amsler grid
- Grid with central fixation dot
- Per-eye testing
- "Do the lines look straight?" yes/no
- "Are any areas wavy, blurry, dark, or missing?" — tap affected areas on grid
- Voice: "Look at the center dot. Are all the lines straight?"

### Screen 9: Peripheral vision
- Central fixation target (hold gaze here)
- Dots appear at random screen positions
- User taps when they see a dot in their peripheral vision
- Maps basic visual field defects
- Voice: "Keep looking at the center. Tap when you see a dot appear."

### Screen 10: Symptom questionnaire
- One question per screen, icon-driven
- Each symptom shown as a clear illustration
- Yes / No / Not sure buttons with icons (checkmark / X / question mark)
- Covers: blurred vision, night vision difficulty, eye pain, floaters, family history, diabetes, prior eye problems
- Voice reads each question aloud
- Results feed into risk scoring algorithm

### Screen 11: Results dashboard
- Traffic light summary: green / yellow / red per test area
- AI-generated plain-language summary (or local summary if offline)
- Urgency banner if any condition flagged urgent/emergency
- Per-test detail cards (expandable)
- Recommendations section with actionable next steps
- "Share Results" bar: WhatsApp, SMS, PDF, Print
- "Retake" button
- Voice reads the summary aloud

---

## 8. Business model and scalability

### Phase 1: Free public tool (now — hackathon + 3 months)
- Completely free, no registration required
- Open source to build community trust and enable contributions
- Seed funding: hackathon prizes + university grants
- Target: 1,000 screenings in first month via university health fairs and church groups

### Phase 2: NGO and health system partnerships (3-12 months)
- Partner with Sightsavers, Orbis International, OneSight EssilorLuxottica Foundation
- Provide CHW batch screening tools with analytics dashboards
- Grant funded: Global Innovation Fund, USAID Development Innovation Ventures, Bill & Melinda Gates Foundation Grand Challenges, Wellcome Trust
- White-label version for health ministries
- Target: 50,000 screenings across 5 countries

### Phase 3: B2B licensing and referral network (6-18 months)
- License to optical chains in emerging markets (e.g., Lenskart India, Visionspring Africa)
- Pre-screening funnel: free test → detection → appointment booking → glasses purchase
- Revenue share model on converted referrals ($0.50-2.00 per converted patient)
- Telemedicine bridge: connect screening results to remote ophthalmologists
- Target: 500,000 screenings, 10% referral conversion

### Phase 4: Data platform and health intelligence (12+ months)
- API for integration into national health information systems
- Anonymized population-level vision data for health ministries and WHO
- Epidemiological insights: prevalence mapping by region, age, gender
- Insurance partnerships: screening data reduces risk assessment costs
- Target: 2M+ screenings, data licensing revenue

### Revenue projections (Year 1-3)

| Stream | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Grants and awards | $50K | $150K | $100K |
| NGO licensing (CHW tools) | $0 | $80K | $250K |
| B2B referral revenue | $0 | $30K | $200K |
| API / data access fees | $0 | $0 | $100K |
| Telemedicine bridge fees | $0 | $20K | $150K |
| **Total** | **$50K** | **$280K** | **$800K** |

### Market size

- 1.1 billion people globally with unaddressed vision impairment (WHO 2023)
- 7.1% of the world's blind live in sub-Saharan Africa
- Global eyewear market: $180B (growing 8% annually)
- Mobile health market in Africa: projected $1.5B by 2027
- Smartphone adoption in sub-Saharan Africa: 51% in 2022, projected 87% by 2030
- 2 out of 3 people in low-income countries who need glasses don't have them
- Even capturing 0.01% of referral conversions = millions of lives changed

---

## 9. Competitive landscape

| Competitor | What they do well | Where VisionCheck wins |
|---|---|---|
| Peek Vision (Kenya) | Clinical-grade, WHO-endorsed, used in Kenya school programs | Free, no partnership required, self-service, voice-guided, works offline, multi-test |
| WHOeyes (WHO) | Official, validated, available in 6 UN languages | Only tests acuity — VisionCheck covers 8 tests + symptoms + AI analysis |
| EyeQue (US) | At-home refraction with actual prescription numbers | Requires $30+ hardware attachment — impossible in low-resource settings |
| ScanMyEye (India) | AI cataract detection from phone camera photo | Single condition only; requires good camera; no screening suite |
| BegIA (Spain) | AI facial analysis for glaucoma, cataracts, diabetic retinopathy | Research stage; requires specific photo conditions; no self-service screening |
| Generic eye chart apps | Simple, widely available, free | Single test, no AI, no voice, no low-literacy design, no referral pathway |

**Our moat:** No competitor combines all of these: comprehensive 8-test screening + AI analysis + multilingual voice guidance + zero hardware cost + offline capability + low-literacy icon-driven UX + children's mode + CHW batch tools. This is a systems-level solution, not a single-feature app.

---

## 10. Impact metrics

### Direct impact (trackable in-app)
- Total screenings completed (by country, region, age group, gender)
- Vision issues detected (by condition type and severity)
- Referrals generated (urgent vs. routine)
- Referral follow-through rate (if integrated with providers)
- Children screened in school programs
- CHW screenings completed per batch session

### Indirect impact (estimated / measured via partners)
- School enrollment and performance improvement in children with corrected vision
- Productivity gains for adults who receive glasses post-screening
- Early detection rate of serious conditions (cataracts, glaucoma, macular degeneration)
- Healthcare cost savings from early intervention vs. late-stage treatment
- Reduction in preventable blindness in screened populations

### Targets

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Total screenings | 100,000 | 500,000 | 2,000,000 |
| Countries reached | 3 | 10 | 25 |
| Issues detected | 25,000 | 125,000 | 500,000 |
| Referrals generated | 10,000 | 50,000 | 200,000 |
| Schools with CHW screening | 50 | 500 | 5,000 |

---

## 11. Judging criteria alignment (RevolutionUC 2026)

### Learning
- Researched the epidemiology of vision impairment across sub-Saharan Africa using WHO, PMC, and IAPB data
- Studied validated clinical screening methods: Snellen/Tumbling E acuity, Ishihara plates, Amsler grid, Landolt C contrast, radial astigmatism dial
- Learned to design for zero-literacy users: icon-driven UX, voice-first interaction, swipe-based inputs
- Integrated Google Gemini API for multilingual medical reasoning
- Integrated ElevenLabs for natural voice synthesis in African languages
- Explored PWA architecture for offline-first mobile applications
- Studied cultural barriers to eye care adoption and designed for trust

### Execution
- Fully functional 8-test screening app covering acuity, color vision, astigmatism, contrast, near vision, macular health, peripheral vision, and symptom-based risk assessment
- AI-powered results engine with urgency classification and personalized recommendations
- Multilingual voice guidance in 4+ languages
- Children's mode with symbol-based testing
- PDF, WhatsApp, and SMS result sharing
- Polished, mobile-first UI that works on low-end Android devices

### Originality
- No existing free tool combines this breadth of screening with this depth of accessibility design
- First to integrate AI health analysis with multilingual voice guidance for eye screening
- First to include a symptom-based referral system for conditions that can't be screened on-phone (cataracts, trachoma, diabetic retinopathy)
- Designed not just as an app, but as a health system: screening → detection → referral → follow-up

---

## 12. Prize category targeting

| Prize | Fit | Strategy |
|---|---|---|
| **Best Social Impact** | Primary target | 1.1B people with preventable vision impairment. This directly addresses the biggest gap in global eye care. |
| **Best Business Plan** | Strong fit | Clear 4-phase path from free tool → NGO partnerships → B2B licensing → data platform. Revenue projections grounded in real market data. |
| **1st Place Overall** | Strong contender | Combines technical depth (8 tests, AI, voice, offline) with genuine human impact and polished execution |
| **Most Technically Impressive** | Possible | 8 screening algorithms, Gemini API, ElevenLabs, PWA offline, CHW batch mode — significant technical breadth |
| **[MLH] Best Use of Gemini API** | Strong fit | Gemini analyzes multi-test results and generates personalized health recommendations in the user's local language |
| **[MLH] Best Use of ElevenLabs** | Strong fit | Voice narration is not a feature — it's the primary interaction mode for low-literacy users. Without it, the app doesn't serve its target audience. |
| **Medpace Sponsor Challenge** | Possible stretch | Eye screening generates clinical trial-adjacent data; digital screening as clinical trial recruitment funnel |

---

## 13. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Users treat screening as diagnosis | High | Prominent disclaimers at start, in results, and in every shared report. Never output prescription numbers. Always say "see a professional." |
| Inaccurate results from uncalibrated screens | High | Distance calibration guide with visual reference. Brightness check at start. Control plates in color test to verify screen quality. Results always framed as "screening" not "measurement." |
| Low-literacy users can't navigate UI | High | Voice-first design. Icon-driven navigation. Tumbling E instead of letters. Swipe instead of type. Tested with non-literate users. |
| Cultural resistance to glasses or screening | Medium | Culturally sensitive messaging. Avoids fear-based language. Frames glasses positively. Designed with community health workers who understand local context. |
| API costs at scale (Gemini, ElevenLabs) | Medium | Gemini free tier is generous. Pre-cache common voice clips. Offline fallback for both. Cache result patterns. Apply for Google for Startups / ElevenLabs social impact credits. |
| Regulatory concerns | Low | Explicitly positioned as screening, not diagnostic. No prescription output. Similar regulatory category to blood pressure apps and BMI calculators. |
| Device fragmentation (many Android versions) | Medium | PWA approach avoids app store. Tested on Android Go. Minimal dependencies. Graceful degradation for older browsers. |
| Intermittent connectivity | Medium | Offline-first PWA architecture. Core tests need zero internet. Results shareable via SMS (no data needed). |

---

## 14. Hackathon deliverables checklist

### Done
- [x] Working web app with visual acuity (Snellen), color vision, astigmatism, and contrast tests
- [x] Results dashboard with per-test scoring
- [x] Mobile-first responsive UI
- [x] Product requirements document (this document)

### In progress
- [ ] Tumbling E acuity test (replace Snellen letters — critical for low-literacy)
- [ ] Amsler grid test for macular degeneration
- [ ] Near vision / presbyopia test
- [ ] Symptom questionnaire with icon-driven UI
- [ ] Peripheral vision quick test
- [ ] Children's mode with LEA symbols

### Remaining
- [ ] Gemini API integration for AI results analysis
- [ ] ElevenLabs voice narration integration (4 languages)
- [ ] PDF report generation with QR code
- [ ] WhatsApp/SMS result sharing
- [ ] Offline PWA capability
- [ ] CHW batch screening mode
- [ ] 3-minute demo video
- [ ] Devpost submission with full writeup
- [ ] Live deployment on Vercel

---

## 15. Research sources

This PRD was informed by the following research:

- WHO Regional Office for Africa — Eye Health data (afro.who.int)
- WHO Fact Sheet — Vision Impairment and Blindness (February 2026)
- PMC: "Blindness in Africa: present situation and future needs"
- PMC: "Prevalence and causes of vision impairment in East Africa: A narrative review"
- IAPB: "Glaucoma blindness in Africa"
- PMC: "Using the Amsler Grid Test for Age-Related Macular Degeneration Screening"
- World Bank / EYElliance: "Looking Ahead: Visual Impairment and School Outcomes"
- PMC: "Childhood visual impairment causes and barriers to accessing eye care" (Africa focus)
- GSMA: "The Mobile Economy Sub-Saharan Africa 2024"
- Market Data Forecast: "Africa Smartphone Market Size, Share & Growth Report 2034"
- Glaucoma Research Foundation: "Easier Glaucoma Diagnosis With Smartphone Apps and AI"
- American Academy of Ophthalmology: eye health screening app recommendations
- Peek Vision: validated smartphone-based acuity testing methodology

---

*Built with purpose at RevolutionUC 2026.*  
*Because everyone deserves to see clearly.*
