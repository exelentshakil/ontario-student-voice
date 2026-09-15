import os
import base64
import subprocess
import re

current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.abspath(os.path.join(current_dir, ".."))
docs_dir = os.path.join(project_dir, "docs")
html_path = os.path.join(docs_dir, "estimate.html")
pdf_path = os.path.join(docs_dir, "ESTIMATE.pdf")

with open(os.path.join(docs_dir, "headshot.jpeg"), "rb") as f:
    headshot_b64 = base64.b64encode(f.read()).decode("utf-8")

with open(os.path.join(docs_dir, "logo.png"), "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Production Scope & Formal Estimate - Autonomous Ontario Career College Voice Verification Pipeline</title>
  <style>
    @page {{
      size: letter portrait;
      margin: 6mm 8.5mm 6mm 8.5mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    html, body {{
      margin: 0;
      padding: 0;
      height: 100%;
      background: #ffffff;
      overflow: hidden;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.32;
      font-size: 9.4px;
    }}

    .page-container {{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      box-sizing: border-box;
      gap: 6px;
    }}

    /* 1. Executive Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 6px;
    }}
    .header-left {{
      flex: 1;
      min-width: 0;
    }}
    .brand-title {{
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #4f46e5;
      margin-bottom: 2px;
      white-space: nowrap;
    }}
    h1 {{
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
      letter-spacing: -0.02em;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .subtitle {{
      font-size: 8.6px;
      color: #475569;
      margin: 0;
      line-height: 1.25;
      white-space: nowrap;
    }}
    .meta-card {{
      flex-shrink: 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 5px 10px;
      font-size: 8.3px;
      text-align: right;
      line-height: 1.36;
      white-space: nowrap;
    }}
    .meta-card strong {{
      color: #0f172a;
    }}
    .live-badge {{
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 9999px;
      font-size: 8px;
      text-transform: uppercase;
      margin-left: 3px;
    }}

    /* 2. Scope & Milestones Table */
    .scope-block {{
      margin-top: 0;
    }}
    .section-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3.5px;
    }}
    .section-title {{
      font-size: 9.6px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      border-left: 3px solid #4f46e5;
      padding-left: 6px;
      margin: 0;
    }}
    .section-meta {{
      font-size: 8.2px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
    }}
    th {{
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.2px;
      letter-spacing: 0.04em;
      border: 1px solid #cbd5e1;
      padding: 3.8px 6px;
      text-align: left;
    }}
    td {{
      border: 1px solid #e2e8f0;
      padding: 3.8px 6px;
      font-size: 8.5px;
      vertical-align: top;
    }}
    .phase-num {{
      font-weight: 800;
      color: #1e293b;
      font-size: 8.5px;
      white-space: nowrap;
    }}
    .phase-name {{
      font-weight: 700;
      color: #0f172a;
      font-size: 8.8px;
    }}
    .phase-desc {{
      color: #475569;
      font-size: 7.9px;
      margin-top: 1px;
      line-height: 1.22;
    }}
    .phase-0-row {{
      background: #f0fdf4;
    }}
    .phase-0-badge {{
      color: #15803d;
      font-weight: 800;
    }}
    .total-row {{
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      border: 1px solid #0f172a;
    }}
    .total-row td {{
      border: 1px solid #0f172a;
      padding: 4.2px 6px;
      font-size: 8.8px;
    }}

    /* 3. 2-Column Technical & Financial Breakdown */
    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
    }}
    .card-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 5px 9px;
    }}
    .card-box-title {{
      font-size: 8.4px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #1e293b;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }}
    .milestone-item {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      border-bottom: 1px dotted #cbd5e1;
      padding: 2px 0;
      font-size: 7.8px;
    }}
    .milestone-item:last-child {{
      border-bottom: none;
      padding-bottom: 0;
    }}
    .milestone-name {{
      color: #334155;
    }}
    .milestone-val {{
      font-weight: 800;
      color: #0f172a;
      font-family: ui-monospace, monospace;
      white-space: nowrap;
    }}
    .guardrail-item {{
      font-size: 7.8px;
      color: #334155;
      margin-bottom: 2px;
      padding-left: 10px;
      position: relative;
      line-height: 1.22;
    }}
    .guardrail-item:last-child {{
      margin-bottom: 0;
    }}
    .guardrail-item::before {{
      content: "✓";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: 800;
      font-size: 7.5px;
    }}

    /* 4. Commercial Terms Section */
    .terms-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      padding: 5px 9px;
    }}
    .terms-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }}
    .term-col {{
      font-size: 7.8px;
      line-height: 1.22;
    }}
    .term-title {{
      font-weight: 800;
      color: #4f46e5;
      text-transform: uppercase;
      font-size: 7.7px;
      margin-bottom: 1px;
    }}
    .term-body {{
      color: #475569;
    }}

    /* 5. Formal Acceptance Authorization Block */
    .auth-block {{
      border: 1px solid #94a3b8;
      border-radius: 6px;
      background: #f8fafc;
      padding: 6px 11px;
    }}
    .auth-title {{
      font-size: 8.4px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin-bottom: 3.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2px;
    }}
    .auth-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }}
    .auth-party {{
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 7.9px;
    }}
    .auth-party-title {{
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      font-size: 7.8px;
      margin-bottom: 1px;
    }}
    .auth-sign-line {{
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-top: 3px;
    }}
    .auth-sign-field {{
      flex: 1;
      border-bottom: 1.2px solid #475569;
      min-height: 22px;
      display: flex;
      align-items: flex-end;
      font-family: "Brush Script MT", "Caveat", cursive, sans-serif;
      font-size: 14px;
      color: #1e3a8a;
      padding-left: 4px;
      padding-bottom: 1px;
    }}
    .auth-date-field {{
      width: 90px;
      border-bottom: 1.2px solid #475569;
      min-height: 22px;
      font-family: ui-monospace, monospace;
      font-size: 8px;
      color: #334155;
      text-align: center;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 1px;
      white-space: nowrap;
    }}
    .auth-label {{
      font-size: 7px;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 1.5px;
    }}

    /* 6. Executive Signature Footer */
    .footer-container {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 5px 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }}
    .footer-founder {{
      display: flex;
      align-items: center;
      gap: 9px;
      flex: 1;
      min-width: 0;
    }}
    .founder-avatar {{
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #4f46e5;
      flex-shrink: 0;
    }}
    .founder-info {{
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }}
    .founder-name {{
      font-size: 8.8px;
      color: #0f172a;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .founder-name strong {{
      color: #0f172a;
      font-weight: 800;
    }}
    .founder-company {{
      font-size: 8px;
      color: #334155;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .founder-company strong {{
      color: #1e293b;
      font-weight: 700;
    }}
    .founder-sub {{
      font-size: 7.5px;
      color: #475569;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .footer-brand {{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2.5px;
      flex-shrink: 0;
    }}
    .business-logo {{
      height: 17px;
      width: auto;
      object-fit: contain;
    }}
    .demo-badge {{
      font-size: 7.6px;
      color: #4338ca;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      padding: 1.5px 6px;
      border-radius: 3px;
      font-weight: 700;
      font-family: ui-monospace, monospace;
      text-decoration: none;
      white-space: nowrap;
    }}
  </style>
</head>
<body>
<div class="page-container">

  <!-- 1. Executive Header -->
  <div class="header">
    <div class="header-left">
      <div class="brand-title">BarakahSoft LLC • Systems Architecture • Ref #BS-2026-ONT-VOICE</div>
      <h1>Autonomous Ontario Career College Voice Verification Pipeline</h1>
      <p class="subtitle">Vapi Voice Platform • Twilio Elastic SIP (Toronto POP) • CRTC 2014-155 Hours Lock • Airtable &amp; n8n Sync</p>
    </div>
    <div class="meta-card">
      <div><strong>Client:</strong> Ontario Career College Enrolment Operations</div>
      <div><strong>Timeline:</strong> 10–12 Business Days (5 Production Milestones)</div>
      <div><strong>Turnkey Package:</strong> <strong>$1,500.00 Fixed USD</strong></div>
      <div><strong>Live Prototype:</strong> <span class="live-badge">Verified &amp; Operational</span></div>
    </div>
  </div>

  <!-- 2. Scope Table -->
  <div class="scope-block">
    <div class="section-header">
      <h2 class="section-title">Production Scope &amp; Milestone Delivery Schedule</h2>
      <div class="section-meta">Live Cockpit: https://ontario-student-voice.vercel.app</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Milestone</th>
          <th style="width: 58%;">Architecture &amp; Production Engineering Deliverables</th>
          <th style="width: 10%; text-align: center;">Timeline</th>
          <th style="width: 8%; text-align: center;">Share</th>
          <th style="width: 12%; text-align: right;">Investment</th>
        </tr>
      </thead>
      <tbody>
        <tr class="phase-0-row">
          <td class="phase-num"><span class="phase-0-badge">Phase 0</span></td>
          <td>
            <div class="phase-name">Interactive Architecture Prototype &amp; Outbound State Simulator (Live)</div>
            <div class="phase-desc">Working 7-stage voice flow with mandatory AI disclosure, tuition expectation filter, dual-provider OpenAI/Gemini failover, America/Toronto business hours lock, SHA-256 consent generator, and Airtable queue. Built upfront to de-risk delivery.</div>
          </td>
          <td style="text-align: center; font-weight: 700; white-space: nowrap;">Live Now</td>
          <td style="text-align: center; color: #16a34a; font-weight: 700;">Included</td>
          <td style="text-align: right; font-weight: 800; color: #16a34a;">$0.00 (Live)</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 1</td>
          <td>
            <div class="phase-name">Vapi Voice Agent Core &amp; CRTC 7-Stage State Machine</div>
            <div class="phase-desc">Production Vapi agent with Deepgram Nova-2 STT &amp; Cartesia Sonic Canadian voice; opening 5-second AI disclosure, 2-party recording notice, identity verification, tuition expectation filter, and timestamped verbal consent logging.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">3 Days</td>
          <td style="text-align: center; font-weight: 700; color: #4f46e5;">27%</td>
          <td style="text-align: right; font-weight: 700;">$400.00</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 2</td>
          <td>
            <div class="phase-name">Batch Campaign Dialer, Concurrency Engine &amp; Ontario Hours Lock</div>
            <div class="phase-desc">Airtable batch query runner with concurrency throttling (1–50 lines), automated busy/unanswered retry logic (3 attempts), real-time America/Toronto calling hours gate (Mon–Fri 9am–8pm, Sat 9am–5pm EST), and National DNCL scrubbing.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">2 Days</td>
          <td style="text-align: center; font-weight: 700; color: #4f46e5;">20%</td>
          <td style="text-align: right; font-weight: 700;">$300.00</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 3</td>
          <td>
            <div class="phase-name">n8n Middleware &amp; Bi-Directional Airtable Synchronization</div>
            <div class="phase-desc">Self-hosted n8n webhook workflow consuming Vapi <code>call.ended</code> payloads; writes 14 typed fields (status, timeframe, tuition consent, SHA-256 hash, call recording URL) back to Airtable with zero raw transcript dumping.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">2 Days</td>
          <td style="text-align: center; font-weight: 700; color: #4f46e5;">23%</td>
          <td style="text-align: right; font-weight: 700;">$350.00</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 4</td>
          <td>
            <div class="phase-name">Warm Transfer, Calendar Callback &amp; Audio Storage Pipeline</div>
            <div class="phase-desc">SIP REFER warm transfer bridging confirmed prospects directly to human admissions staff; Cal.com callback booking fallback; dual-channel MP3 recordings and timestamped transcripts linked to Airtable record IDs.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">2 Days</td>
          <td style="text-align: center; font-weight: 700; color: #4f46e5;">17%</td>
          <td style="text-align: right; font-weight: 700;">$250.00</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 5</td>
          <td>
            <div class="phase-name">Permanent DNC Enforcement, Live Carrier QA &amp; 60-Min Handover</div>
            <div class="phase-desc">Cross-campaign permanent opt-out enforcement; 50-call live carrier staging QA run; full operations &amp; prompt tuning documentation; 60-minute recorded video handover call with admissions leadership.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">2 Days</td>
          <td style="text-align: center; font-weight: 700; color: #4f46e5;">13%</td>
          <td style="text-align: right; font-weight: 700;">$200.00</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Total Turnkey Production Scope (All 8 Brief Deliverables Included)</td>
          <td style="text-align: center; font-weight: 800;">10–12 Days</td>
          <td style="text-align: center; font-weight: 800;">100%</td>
          <td style="text-align: right; font-weight: 800; font-family: ui-monospace, monospace; font-size: 10px;">$1,500.00</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 3. 2-Column Technical & Financial Breakdown -->
  <div class="grid-2col">
    <div class="card-box">
      <div class="card-box-title">Milestone Escrow &amp; Release Schedule</div>
      <div class="milestone-item">
        <span class="milestone-name">Phase 0: Interactive Architectural Prototype (Live)</span>
        <span class="milestone-val" style="color: #16a34a;">$0.00 (Delivered)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">M1: Vapi Voice Agent &amp; 7-Stage State Machine</span>
        <span class="milestone-val">$400.00 (Net 3 Days)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">M2: Batch Campaign Dialer &amp; Ontario Hours Lock</span>
        <span class="milestone-val">$300.00 (Net 5 Days)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">M3: n8n Middleware &amp; 14-Field Airtable Sync</span>
        <span class="milestone-val">$350.00 (Net 7 Days)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">M4: Warm Transfer, Calendar Booking &amp; Audio S3</span>
        <span class="milestone-val">$250.00 (Net 9 Days)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">M5: Permanent DNC, Staging QA &amp; 60-Min Handover</span>
        <span class="milestone-val">$200.00 (Net 11 Days)</span>
      </div>
    </div>

    <div class="card-box">
      <div class="card-box-title">Production Telephony &amp; Compliance Guardrails</div>
      <div class="guardrail-item"><strong>PSTN Carrier:</strong> Twilio Elastic SIP trunk terminating at Toronto POP (&lt;400ms latency)</div>
      <div class="guardrail-item"><strong>Voice Stack:</strong> Deepgram Nova-2 telephony STT + Cartesia Sonic Canadian voice persona</div>
      <div class="guardrail-item"><strong>Dual AI Engine:</strong> OpenAI gpt-4o-mini primary with automatic Gemini 2.0 Flash failover</div>
      <div class="guardrail-item"><strong>CRTC 2014-155:</strong> Hardware/software locked to Mon–Fri 9am–8pm &amp; Sat 9am–5pm EST</div>
      <div class="guardrail-item"><strong>PIPEDA Consent:</strong> SHA-256 tamper-evident verbal consent hash logged per student</div>
    </div>
  </div>

  <!-- 4. Commercial Terms Section -->
  <div class="terms-box">
    <div class="terms-grid">
      <div class="term-col">
        <div class="term-title">Fixed-Price Guarantee</div>
        <div class="term-body">100% milestone-based fixed investment ($1,500.00). Zero hidden fees, zero vendor markups, zero scope creep.</div>
      </div>
      <div class="term-col">
        <div class="term-title">30-Day Bug Warranty</div>
        <div class="term-body">Full post-deployment coverage for prompt fine-tuning, webhook sync edge cases, and carrier error handling at $0 extra.</div>
      </div>
      <div class="term-col">
        <div class="term-title">100% Code Ownership</div>
        <div class="term-body">All n8n workflows, Vapi prompts, and Twilio configs reside 100% in your existing private accounts with no lock-in.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Handover &amp; Training</div>
        <div class="term-body">60-minute recorded video walkthrough + step-by-step SOP so your team independently runs and tunes the agent.</div>
      </div>
    </div>
  </div>

  <!-- 5. Formal Acceptance Authorization Block -->
  <div class="auth-block">
    <div class="auth-title">
      <span>Formal Authorization &amp; Engagement Acceptance</span>
      <span style="font-weight: 500; font-size: 7.4px; color: #475569;">Binding upon signature by authorized representatives</span>
    </div>
    <div class="auth-grid">
      <div class="auth-party">
        <div class="auth-party-title">Authorized Provider: BarakahSoft LLC (Wyoming, USA)</div>
        <div>Signatory: <strong>Shakil Ahmed</strong> • Principal Systems Architect &amp; Founder</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field">Shakil Ahmed</div>
          <div class="auth-date-field">15 Sep 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Provider Signature</span>
          <span class="auth-label" style="width: 90px; text-align: center;">Date</span>
        </div>
      </div>

      <div class="auth-party">
        <div class="auth-party-title">Authorized Client: Ontario Career College Network</div>
        <div>Signatory: <strong>Authorized Representative</strong> • Enrolment Operations</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field" style="color: #64748b; font-family: inherit; font-size: 8px; font-style: italic;">[ Accepted via Upwork Contract Offer / Sign-off ]</div>
          <div class="auth-date-field">___ / ___ / 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Client Signature</span>
          <span class="auth-label" style="width: 90px; text-align: center;">Date</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Executive Signature Footer -->
  <div class="footer-container">
    <div class="footer-founder">
      <img src="data:image/jpeg;base64,{headshot_b64}" alt="Shakil Ahmed" class="founder-avatar" />
      <div class="founder-info">
        <div class="founder-name"><strong>Shakil Ahmed</strong> • Founder &amp; Lead Systems Architect (12+ Yrs Exp)</div>
        <div class="founder-company"><strong>BarakahSoft LLC</strong> • Enterprise Telecom &amp; AI Systems Partner</div>
        <div class="founder-sub">Former Lead Engineer at Legiit ($1M ARR Command Center) • Verified Upwork Partner</div>
      </div>
    </div>
    <div class="footer-brand">
      <img src="data:image/png;base64,{logo_b64}" alt="BarakahSoft" class="business-logo" />
      <a href="https://ontario-student-voice.vercel.app" target="_blank" class="demo-badge">ontario-student-voice.vercel.app</a>
    </div>
  </div>
</div>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved estimate.html to:", html_path)

# Run headless Chrome to produce clean 1-page ESTIMATE.pdf with NO header/footer artifacts
chrome_cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file://{os.path.abspath(html_path)}"
]

res = subprocess.run(chrome_cmd, capture_output=True, text=True)
if res.returncode == 0:
    print("Successfully generated ESTIMATE.pdf via Chrome Headless at:", pdf_path)
    print("File size:", os.path.getsize(pdf_path), "bytes")
else:
    print("Chrome print-to-pdf error:", res.stderr)

# Verify page count
with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()

pages = re.findall(rb"/Type\s*/Page[^s]", pdf_bytes)
print(f"Verified PDF page count: {len(pages)} page(s)")
if len(pages) != 1:
    print("WARNING: Expected exactly 1 page!")
    exit(1)
