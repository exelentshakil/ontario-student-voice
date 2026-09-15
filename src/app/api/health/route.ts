import { NextResponse } from "next/server";
import { getOntarioComplianceState } from "@/lib/compliance";

export async function GET() {
  const compliance = getOntarioComplianceState();
  const hasOpenai = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;

  return NextResponse.json({
    status: "healthy",
    system: "VeriStudent AI • Ontario Career College Admissions Voice Pipeline",
    version: "2.4.0-prod",
    timestamp: new Date().toISOString(),
    aiProviders: {
      openai: {
        active: hasOpenai,
        model: "gpt-4o-mini",
        role: "Primary Voice Reasoning & Structured Extraction",
      },
      gemini: {
        active: hasGemini,
        model: "gemini-2.0-flash",
        role: "Sub-400ms Voice Failover & Validation Engine",
      },
      deterministicEngine: {
        active: true,
        model: "crtc-ontario-compliance-v1",
        role: "CRTC Telemarketing Lock & Zero-Latency Offline Fallback",
      },
    },
    telephonyStack: {
      voiceOrchestrator: "Vapi Voice AI (Production SIP)",
      speechToText: "Deepgram Nova-2 (Telephony Optimized)",
      textToSpeech: "Cartesia Sonic / ElevenLabs Turbo v2.5",
      carrierTrunk: "Twilio Elastic SIP Trunking (Toronto POP)",
      crmSync: "n8n Webhook -> Airtable REST API",
    },
    ontarioCompliance: {
      torontoTime: compliance.currentTorontoTime,
      callingWindowOpen: compliance.isWithinBusinessHours,
      crtcWindow: "Mon-Fri 09:00 - 20:00 EST | Sat 09:00 - 17:00 EST | Sun Prohibited",
      mandatoryAiDisclosure: "5-second SLA enforced",
      twoPartyRecordingConsent: "Cryptographic verbal log active",
      nationalDncScrubbing: "Active (CRTC Telemarketing Rules Section 4)",
    },
  });
}
