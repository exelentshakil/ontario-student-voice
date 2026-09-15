# Product Requirements Document (PRD)
## Autonomous Outbound Voice Verification & Enrolment Pipeline for Ontario Career Colleges

**Project Name:** VeriStudent AI  
**Deployment Target:** Ontario Career Colleges Domestic Enrolment Pipeline  
**Production Stack:** Next.js 15.5.4, Vapi Voice Orchestrator, Twilio Elastic SIP Trunking (Toronto POP), Deepgram Nova-2, Cartesia Sonic, n8n on VPS, Airtable REST API, Dual-Provider AI (OpenAI gpt-4o-mini + Gemini 2.0 Flash)  
**System Architect:** Shakil Ahmed, Founder & Principal Systems Architect, BarakahSoft LLC  
**Live Architectural Demonstration:** [https://ontario-student-voice.vercel.app](https://ontario-student-voice.vercel.app)  

---

### 1. Executive Summary & Problem Statement

The client operates a student recruitment and enrolment pipeline for licensed private career colleges across Ontario, Canada. The database contains between 10,000 and 20,000 domestic student records gathered over the past 12–24 months from landing pages, quizzes, and digital intake funnels.

#### Core Operational Inefficiencies:
1. **High Data Staleness:** Upwards of 40–50% of numbers are disconnected, reassigned, or belong to individuals who have relocated or enrolled elsewhere.
2. **Prohibitive Human Labor Costs:** Paying human contact center agents to dial 15,000 stale records costs approximately $31,250 CAD (at $25/hr), with agents spending 70% of their time on voicemails, wrong numbers, or uninterested contacts.
3. **Mismatched Expectations:** A substantial portion of stale inquiries mistakenly assume career college programs are free government grants or offer guaranteed employment, creating wasted admissions staff conversations.
4. **Strict Canadian Regulatory Risk:** Outbound telemarketing in Ontario is strictly governed by the Canadian Radio-television and Telecommunications Commission (CRTC) and the Personal Information Protection and Electronic Documents Act (PIPEDA). Calling outside permitted hours, omitting automated agent disclosure, or failing to capture verifiable third-party consent exposes the operator to severe statutory fines.

#### Proposed Solution:
An autonomous, conversational outbound AI voice agent that executes a deterministic 7-step qualification and verification protocol. The system verifies identity, filters tuition expectations, captures cryptographic verbal consent, and writes 14 structured fields back to Airtable via n8n middleware. Only highly qualified, tuition-aware prospects reach human admissions officers.

---

### 2. Regulatory Compliance Framework (Non-Negotiable)

The architecture treats regulatory compliance as a first-class engineering constraint, built directly into the dialing daemon and telephony session:

1. **Mandatory AI Disclosure & Two-Party Recording Notice:**
   - Within the first 5 seconds of call audio connection, the agent states:
     *"Hi [First Name], this is an automated assistant calling on a recorded line on behalf of our Ontario career college network regarding your recent enquiry."*
   - Telephony events enforce this turn prior to accepting any user inputs.

2. **Ontario Business Hours Calling Window (CRTC 2014-155):**
   - Telemarketing calls in Ontario are legally restricted to:
     - **Monday – Friday:** 09:00 to 20:00 EST (America/Toronto)
     - **Saturday:** 09:00 to 17:00 EST (America/Toronto)
     - **Sunday & Statutory Holidays:** Calling strictly prohibited.
   - The batch dialer enforces a real-time software lock that refuses to dispatch calls when outside this window.

3. **National DNCL & Internal Opt-Out Scrubbing:**
   - Any verbal opt-out ("take me off your list", "do not call", "stop calling") instantly terminates the call politely and writes the phone number to a permanent cross-campaign DNC blocklist with a SHA-256 audit record.

4. **Verifiable Cryptographic Verbal Consent (PIPEDA Compliance):**
   - Verbal consent to share the student's contact details with a licensed partner college is captured as a distinct audio snippet, timestamped in ISO 8601 UTC, and hashed with SHA-256 alongside the student's record ID.

5. **Strict No-Misrepresentation Policy:**
   - The agent prompt explicitly prohibits promising job placements, government subsidies, or guaranteed diplomas. The agent actively clarifies that programs are tuition-based diploma curricula.

---

### 3. The 7-Stage Conversational State Machine

```
[Incoming Lead]
       │
       ▼
1. AI & Recording Disclosure (Opening 5s)
       │
       ▼
2. Identity Confirmation ("Is this [Full Name]?")
       ├── Wrong Person / Reassigned ──► [Flag Stale / Purge]
       ▼
3. Verify Details (Program, City, Employment Status)
       ├── Updated fields written to buffer
       ▼
4. Core Enrolment Question ("Actively looking to enrol? Timeframe?")
       ├── Not Looking ──► [Polite Close / Mark Inactive]
       ▼
5. Honest Expectation Setting (Tuition-based diploma, no guaranteed job)
       ├── Expects Free / Refuses Tuition ──► [Polite Close]
       ▼
6. Verbal Consent Capture (Timestamped consent to share with college)
       │
       ▼
7. Branching & Hand-off
       ├── Confirmed & Interested ──► [Warm Transfer / Calendar Booking]
       ├── Not Interested ──────────► [Mark Closed / Archive]
       ├── Bad Number / Disconnect ─► [Flag for Purge]
       └── DNC Opt-Out ─────────────► [Permanent DNCL Blocklist]
```

---

### 4. Technical Architecture: Vapi vs. xAI Grok Voice Justification

| Architectural Dimension | Vapi Voice AI (Selected) | xAI Grok Voice (Rejected) |
|---|---|---|
| **PSTN Telephony Infrastructure** | Native SIP trunking to Twilio / Telnyx with direct POP termination in Toronto (YTO). Sub-400ms round-trip. | Lacks direct PSTN / SIP trunking. Requires third-party WebRTC bridges adding 400-600ms latency. |
| **Deterministic Mid-Call Tool Calls** | First-class function calling (`log_verbal_consent`, `transfer_to_admissions`, `trigger_dnc`). | Experimental function calling; higher nondeterminism and hallucination risk during state progression. |
| **Canadian Voice Tuning & Accents** | Direct integration with Cartesia Sonic and Deepgram Nova-2 with custom phonetic pronunciations for Ontario cities. | Limited voice persona selection; optimized for conversational chat rather than outbound lead verification. |
| **Structured Webhook Payloads** | Native `call.ended` webhook with structured transcript, latency metrics, and recording URLs ready for n8n ingestion. | Raw streaming API with no pre-built webhook schema for external CRM synchronizations. |

---

### 5. Deliverables & Implementation Schedule

| # | Deliverable | Scope Description | Acceptance Criteria |
|---|---|---|---|
| **1** | **Working Outbound Voice Agent** | Production Vapi agent running 7-stage state machine with sub-400ms latency and dual-provider fallback. | Verifiably completes full 7-stage script with conversational interruptions handled cleanly. |
| **2** | **Batch Campaign Dialer** | Concurrency control (1-50 lines), automatic retry logic, and real-time America/Toronto hours lock. | Dialing automatically halts at 20:00 EST and blocks Sunday execution without exception. |
| **3** | **Structured Airtable / n8n Sync** | Webhook pipeline writing 14 typed fields (verification status, timeframe, tuition consent, SHA-256 hash) to Airtable. | Airtable records updated in < 2 seconds post-call with 0 transcript dumping. |
| **4** | **Warm Transfer / Calendar Booking** | SIP REFER transfer to college admissions team with failover to Cal.com / Calendly calendar scheduling. | Verified leads seamlessly bridge to human line or receive confirmed booking slot. |
| **5** | **Recording & Transcript Storage** | Dual-channel MP3 recordings and timestamped JSON transcripts linked to Airtable record IDs. | Audio playable directly from Airtable attachment or secure presigned S3 URL. |
| **6** | **Permanent DNC Enforcement** | Cryptographic blocklist enforced across all future batch uploads and Airtable queries. | Numbers flagged as DNC are verifiably skipped on subsequent batch runs. |
| **7** | **Operational Reporting View** | Real-time cockpit tracking dial count, connect rate, completion rate, intent-confirmed rate, and cost/lead. | Visual dashboard calculating unit economics and campaign throughput in real time. |
| **8** | **Documentation & Handover** | Comprehensive architecture documentation, API specs, and 60-minute recorded video handover. | Client team independently runs, pauses, and tunes prompts without developer dependency. |

---

### 6. Risk Analysis & Mitigation Matrix

| Risk Event | Severity | Mitigation Strategy |
|---|---|---|
| **OpenAI 429 Rate Limit / Latency Spike** | High | Zero-dependency dual-provider architecture automatically fails over to Google Gemini 2.0 Flash in < 200ms. |
| **Carrier Trunk Disconnection** | Medium | Multi-homed SIP trunking routes failed Toronto calls through secondary Montreal/Chicago gateways. |
| **Student Misunderstanding Tuition** | High | Stage 5 requires explicit verbal confirmation that programs are tuition-based before consent is accepted. |
| **Accidental After-Hours Dialing** | Critical | Hardcoded server-side UTC-to-EDT clock evaluation at the API gateway layer blocks requests outside 09:00-20:00 EST. |
