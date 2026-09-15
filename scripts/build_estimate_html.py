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
  <title>Production Scope & Formal Estimate - Ontario Student Voice Verification</title>
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
      font-size: 9.6px;
    }}

    .page-container {{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      box-sizing: border-box;
    }}

    /* 1. Executive Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 7px;
    }}
    .brand-section {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .brand-logo {{
      width: 36px;
      height: 36px;
      object-fit: contain;
      border-radius: 6px;
    }}
    .brand-title {{
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }}
    .brand-subtitle {{
      font-size: 8.8px;
      color: #475569;
      margin-top: 1px;
    }}
    .meta-box {{
      text-align: right;
      font-size: 8.2px;
      color: #334155;
    }}
    .meta-box strong {{
      color: #0f172a;
    }}
    .demo-pill {{
      display: inline-block;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #4338ca;
      font-size: 8px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
      margin-top: 3px;
      text-decoration: none;
    }}

    /* 2. Scope & Milestones Table */
    .section-title {{
      font-size: 9.8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1e293b;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    table.scope-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 8.6px;
      table-layout: fixed;
    }}
    table.scope-table th {{
      background: #f1f5f9;
      color: #334155;
      text-align: left;
      font-weight: 700;
      padding: 4px 6px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
    }}
    table.scope-table td {{
      padding: 4px 6px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }}
    table.scope-table tr:nth-child(even) {{
      background: #f8fafc;
    }}
    .milestone-name {{
      font-weight: 700;
      color: #0f172a;
    }}
    .milestone-desc {{
      color: #475569;
      font-size: 8px;
      line-height: 1.25;
      margin-top: 1px;
    }}
    .price-col {{
      text-align: right;
      font-weight: 700;
      color: #0f172a;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }}
    .status-live {{
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      border-radius: 4px;
      padding: 1px 4px;
      font-weight: 700;
      font-size: 7.5px;
    }}

    /* 3. Financial Summary & Architecture Stack */
    .summary-grid {{
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 10px;
    }}
    .tech-card {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 9px;
      font-size: 8.2px;
    }}
    .tech-card-title {{
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      font-size: 8px;
      margin-bottom: 4px;
      letter-spacing: 0.3px;
    }}
    .tech-list {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 8px;
      color: #475569;
    }}
    .total-card {{
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 6px;
      padding: 6px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }}
    .total-row {{
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }}
    .total-label {{
      font-size: 9.5px;
      font-weight: 700;
      color: #1e1b4b;
    }}
    .total-amount {{
      font-size: 16px;
      font-weight: 900;
      color: #4338ca;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }}
    .total-sub {{
      font-size: 7.8px;
      color: #4338ca;
      line-height: 1.2;
    }}

    /* 4. Production SLAs & Guarantees */
    .sla-section {{
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 6px;
      padding: 5px 9px;
      font-size: 8px;
      color: #581c87;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }}
    .sla-item strong {{
      color: #3b0764;
    }}

    /* 5. Authorization & Acceptance */
    .auth-section {{
      border: 1px solid #cbd5e1;
      background: #ffffff;
      border-radius: 6px;
      padding: 6px 10px;
    }}
    .auth-header {{
      display: flex;
      justify-content: space-between;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #334155;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 5px;
    }}
    .auth-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      font-size: 8px;
    }}
    .auth-party {{
      display: flex;
      flex-direction: column;
      gap: 2px;
    }}
    .auth-party-title {{
      font-weight: 700;
      color: #0f172a;
    }}
    .auth-sign-line {{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 4px;
      gap: 6px;
    }}
    .auth-sign-field {{
      border-bottom: 1px solid #94a3b8;
      height: 16px;
      flex: 1;
      font-family: 'Brush Script MT', cursive, sans-serif;
      font-size: 13px;
      color: #1e293b;
      line-height: 16px;
      padding-left: 4px;
    }}
    .auth-date-field {{
      border-bottom: 1px solid #94a3b8;
      height: 16px;
      width: 75px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8px;
      text-align: center;
      line-height: 16px;
    }}
    .auth-label {{
      font-size: 7px;
      color: #64748b;
      text-transform: uppercase;
    }}

    /* 6. Executive Signature Footer */
    .footer-container {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-top: 1px solid #e2e8f0;
      padding-top: 5px;
    }}
    .footer-founder {{
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .founder-avatar {{
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      object-fit: cover;
      border: 1.5px solid #4f46e5;
    }}
    .founder-info {{
      font-size: 8.2px;
      line-height: 1.25;
    }}
    .founder-name {{
      font-weight: 700;
      color: #0f172a;
    }}
    .founder-company {{
      color: #475569;
    }}
    .founder-sub {{
      font-size: 7.4px;
      color: #64748b;
    }}
    .footer-brand {{
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .business-logo {{
      width: 22px;
      height: 22px;
      object-fit: contain;
    }}
    .demo-badge {{
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 7.6px;
      padding: 3px 8px;
      border-radius: 4px;
      text-decoration: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }}
  </style>
</head>
<body>
<div class="page-container">

  <!-- 1. Executive Header -->
  <div class="header">
    <div class="brand-section">
      <img src="data:image/png;base64,{logo_b64}" alt="BarakahSoft" class="brand-logo" />
      <div>
        <div class="brand-title">BarakahSoft LLC • Production Scope &amp; Formal Estimate</div>
        <div class="brand-subtitle">Autonomous Outbound Voice Verification &amp; Enrolment System for Ontario Career Colleges</div>
      </div>
    </div>
    <div class="meta-box">
      <div><strong>Date:</strong> 15 Sep 2026 • <strong>Doc ID:</strong> EST-ONT-2026-01</div>
      <div><strong>Engagement:</strong> Turnkey Implementation • <strong>Timeline:</strong> 10–12 Days</div>
      <a href="https://ontario-student-voice.vercel.app" target="_blank" class="demo-pill">Live Demo: ontario-student-voice.vercel.app</a>
    </div>
  </div>

  <!-- 2. Scope & Milestones Table -->
  <div>
    <div class="section-title">
      <span>Turnkey Milestone Roadmap &amp; Deliverables</span>
      <span style="font-size: 8px; font-weight: normal; color: #64748b;">Fixed-Price Comprehensive Package</span>
    </div>
    <table class="scope-table">
      <thead>
        <tr>
          <th style="width: 17%;">Milestone</th>
          <th style="width: 59%;">Technical Scope &amp; Deliverables</th>
          <th style="width: 12%;">Duration</th>
          <th style="width: 12%; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="milestone-name">Phase 0: Prototype</div>
            <span class="status-live">DELIVERED &amp; LIVE</span>
          </td>
          <td>
            <div class="milestone-desc"><strong>Live Architectural Proof-of-Concept:</strong> Interactive 7-stage voice simulator, dual-provider OpenAI/Gemini failover, America/Toronto business hours lock, SHA-256 verbal consent generator, and Airtable queue.</div>
          </td>
          <td>Delivered</td>
          <td class="price-col" style="color: #059669;">$0.00</td>
        </tr>
        <tr>
          <td>
            <div class="milestone-name">Milestone 1</div>
            <div class="milestone-desc">Voice Agent Core</div>
          </td>
          <td>
            <div class="milestone-desc"><strong>Production Vapi Outbound Agent &amp; State Machine:</strong> Deepgram Nova-2 + Cartesia Canadian voice; mandatory 5-second AI disclosure, 2-party recording consent, identity verification, program/city checks, tuition expectation filter, and timestamped verbal consent capture.</div>
          </td>
          <td>3 Days</td>
          <td class="price-col">$400.00</td>
        </tr>
        <tr>
          <td>
            <div class="milestone-name">Milestone 2</div>
            <div class="milestone-desc">Batch Campaign Dialer</div>
          </td>
          <td>
            <div class="milestone-desc"><strong>Dialing Engine &amp; CRTC Calling Window Lock:</strong> Concurrency throttling (1–50 lines), automated busy/unanswered retry cadence, real-time Ontario hours lock (Mon–Fri 9am–8pm, Sat 9am–5pm EST, Sunday dial block), and National DNCL scrubbing.</div>
          </td>
          <td>2 Days</td>
          <td class="price-col">$300.00</td>
        </tr>
        <tr>
          <td>
            <div class="milestone-name">Milestone 3</div>
            <div class="milestone-desc">Airtable &amp; n8n Sync</div>
          </td>
          <td>
            <div class="milestone-desc"><strong>Bi-Directional Middleware &amp; Structured Extraction:</strong> Self-hosted n8n webhook consuming Vapi <code>call.ended</code> payloads; writes 14 typed fields to Airtable (status, timeframe, tuition consent, SHA-256 hash) with 0 raw transcript dumps.</div>
          </td>
          <td>2 Days</td>
          <td class="price-col">$350.00</td>
        </tr>
        <tr>
          <td>
            <div class="milestone-name">Milestone 4</div>
            <div class="milestone-desc">Transfers &amp; Recordings</div>
          </td>
          <td>
            <div class="milestone-desc"><strong>Warm Transfer, Calendar Booking &amp; Audio Storage:</strong> SIP REFER transfer bridging confirmed prospects to human admissions lines; Cal.com callback booking fallback; dual-channel MP3 recordings and timestamped transcripts linked to Airtable records.</div>
          </td>
          <td>2 Days</td>
          <td class="price-col">$250.00</td>
        </tr>
        <tr>
          <td>
            <div class="milestone-name">Milestone 5</div>
            <div class="milestone-desc">DNC, QA &amp; Handover</div>
          </td>
          <td>
            <div class="milestone-desc"><strong>Permanent DNC Blocklist, Carrier QA &amp; Handover:</strong> Cross-campaign opt-out enforcement; 50-call live carrier test run; full operational documentation &amp; prompt tuning guide; 60-minute recorded video handover call with admissions staff.</div>
          </td>
          <td>2 Days</td>
          <td class="price-col">$200.00</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 3. Financial Summary & Architecture Stack -->
  <div class="summary-grid">
    <div class="tech-card">
      <div class="tech-card-title">Production Telephony &amp; Compliance Specifications</div>
      <div class="tech-list">
        <div>• <strong>Voice AI:</strong> Vapi Orchestrator (&lt;400ms)</div>
        <div>• <strong>Telephony:</strong> Twilio SIP (Toronto POP)</div>
        <div>• <strong>STT Model:</strong> Deepgram Nova-2 Telephony</div>
        <div>• <strong>TTS Model:</strong> Cartesia Sonic Canadian</div>
        <div>• <strong>LLM Primary:</strong> OpenAI gpt-4o-mini</div>
        <div>• <strong>LLM Failover:</strong> Gemini 2.0 Flash (&lt;200ms)</div>
        <div>• <strong>Middleware:</strong> n8n VPS Webhook Ingestion</div>
        <div>• <strong>Compliance:</strong> CRTC 2014-155 &amp; PIPEDA</div>
      </div>
    </div>

    <div class="total-card">
      <div class="total-row">
        <span class="total-label">Total Turnkey Investment:</span>
        <span class="total-amount">$1,500.00</span>
      </div>
      <div class="total-sub">
        <strong>100% Fixed-Price Guarantee.</strong> Zero hidden fees, zero vendor markups. Wholesale telephony (~$0.05 CAD/min) billed directly by Twilio &amp; Vapi to your existing accounts.
      </div>
    </div>
  </div>

  <!-- 4. Production SLAs & Guarantees -->
  <div class="sla-section">
    <div class="sla-item">• <strong>30-Day Bug Warranty:</strong> Zero-cost bug fixes &amp; prompt tuning</div>
    <div class="sla-item">• <strong>Zero Vendor Lock-in:</strong> 100% code, prompt, &amp; workflow ownership</div>
    <div class="sla-item">• <strong>60-Min Handover:</strong> Full walkthrough so your team operates independently</div>
  </div>

  <!-- 5. Formal Authorization & Engagement Acceptance -->
  <div class="auth-section">
    <div class="auth-header">
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
          <span class="auth-label" style="width: 75px; text-align: center;">Date</span>
        </div>
      </div>

      <div class="auth-party">
        <div class="auth-party-title">Authorized Client: Ontario Career College Network</div>
        <div>Signatory: <strong>Authorized Representative</strong> • Enrolment Operations</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field" style="color: #64748b; font-family: inherit; font-size: 8.2px; font-style: italic;">[ Accepted via Upwork Contract Offer / Sign-off ]</div>
          <div class="auth-date-field">___ / ___ / 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Client Signature</span>
          <span class="auth-label" style="width: 75px; text-align: center;">Date</span>
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
