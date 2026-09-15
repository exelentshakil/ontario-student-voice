# Production Scope & Formal Estimate
## Autonomous Outbound Voice Verification System for Ontario Career Colleges

**Prepared For:** Enrolment Operations Leadership, Ontario Career College Network  
**Prepared By:** Shakil Ahmed, Founder & Principal Systems Architect, BarakahSoft LLC  
**Date:** September 15, 2026  
**Interactive Working Demo:** [https://ontario-student-voice.vercel.app](https://ontario-student-voice.vercel.app)  
**Total Investment:** $1,500.00 Fixed-Price Package  
**Turnaround Timeline:** 10–12 Business Days  

---

### Executive Summary

BarakahSoft LLC has engineered a turnkey, production-grade outbound voice verification system designed specifically for qualifying 10,000–20,000 stale domestic student records across Ontario career colleges. 

The system directly addresses your core operational bottleneck: eliminating the cost of manual human dialing ($31,250+ CAD) while strictly enforcing Canadian CRTC telemarketing rules, filtering out prospects expecting free government training, capturing timestamped verbal consent, and updating Airtable with 14 typed verification fields via n8n middleware.

---

### Scope of Work & Fixed-Price Milestones

| Milestone | Deliverables & Technical Scope | Timeline | Investment |
|---|---|---|---|
| **Phase 0: Prototype** | **Live Architectural Prototype** (Delivered)<br>• Working 7-stage voice simulator with OpenAI/Gemini failover<br>• Ontario CRTC hours lock and SHA-256 consent generator<br>• Airtable queue simulator and visual workflow canvas | **Live** | **$0.00** |
| **Milestone 1** | **Outbound Vapi Voice Agent & Compliance Engine**<br>• Production Vapi assistant configured with Deepgram Nova-2 & Cartesia<br>• Strict 5-second AI disclosure and 2-party recording notice<br>• Identity check, program/city verification, and tuition expectation filter<br>• Cryptographic verbal consent capture with ISO 8601 timestamping | 3 Days | **$400.00** |
| **Milestone 2** | **Batch Campaign Dialer & Ontario Hours Lock**<br>• Airtable batch query runner with concurrency throttling (1–50 channels)<br>• Automated retry logic for busy/unanswered calls (up to 3 attempts)<br>• Hardcoded America/Toronto timezone gatekeeper (Mon–Fri 9am–8pm, Sat 9am–5pm EST)<br>• National DNCL scrubbing integration before dial dispatch | 2 Days | **$300.00** |
| **Milestone 3** | **n8n Middleware & Bi-Directional Airtable Sync**<br>• Self-hosted n8n webhook workflow consuming Vapi `call.ended` events<br>• Structured data extraction mapping 14 typed fields to Airtable<br>• Elimination of raw transcript dumps; typed qualification schema<br>• Error handling, dead-letter queues, and automatic sync retries | 2 Days | **$350.00** |
| **Milestone 4** | **Warm Transfer & Calendar Callback System**<br>• SIP REFER warm transfer bridging confirmed prospects to human admissions<br>• Cal.com / Calendly fallback booking for after-hours or busy lines<br>• Dual-channel MP3 call recording and transcript attachment to Airtable | 2 Days | **$250.00** |
| **Milestone 5** | **Permanent DNC Enforcement, QA & 60-Min Handover**<br>• Permanent cross-campaign DNC blocklist with SHA-256 opt-out logging<br>• End-to-end 50-call staging QA test on live Canadian carrier lines<br>• Comprehensive system documentation & prompt tuning guide<br>• 60-Minute recorded video handover call with your internal operations team | 2 Days | **$200.00** |
| **Total** | **Complete Turnkey Outbound Voice Verification Platform** | **10–12 Days** | **$1,500.00** |

---

### Technical Architecture & Standards

- **Voice AI Orchestrator:** Vapi Voice Platform with sub-400ms round-trip latency
- **Telephony Carrier:** Twilio Elastic SIP Trunking with direct Toronto POP termination (YTO)
- **STT & TTS Models:** Deepgram Nova-2 (telephony optimized) + Cartesia Sonic (Canadian natural persona)
- **LLM Intelligence:** Dual-provider architecture (OpenAI `gpt-4o-mini` primary with automatic failover to Google Gemini `gemini-2.0-flash`)
- **System of Record:** Airtable REST API with custom field schema
- **Automation Middleware:** Self-hosted n8n instance on your private VPS
- **Compliance:** CRTC 2014-155, PIPEDA Canadian Privacy, National DNCL

---

### Production Guarantees & Terms

1. **30-Day Post-Launch Bug Warranty:** Any functional discrepancies or webhook sync errors are resolved at zero additional charge for 30 days following handover.
2. **Zero Vendor Lock-in & Full Code Ownership:** All n8n workflows, Vapi prompt configurations, and Twilio SIP credentials belong 100% to you and reside entirely in your existing infrastructure.
3. **No Hidden Platform Surcharges:** The system connects directly to your own Airtable, Twilio, and n8n accounts. Wholesale telephony costs (~$0.05–$0.08 CAD per connected minute) are billed directly by Twilio and Vapi without markup.

---

### Formal Acceptance & Signatures

**Authorized Provider:**  
BarakahSoft LLC (Wyoming, USA)  
**Signatory:** Shakil Ahmed, Founder & Principal Systems Architect  
**Date:** September 15, 2026  

**Authorized Client:**  
Ontario Career College Admissions Leadership  
**Signatory:** Authorized Representative  
**Date:** Accepted via Upwork Contract Offer  
