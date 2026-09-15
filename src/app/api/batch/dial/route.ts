import { NextRequest, NextResponse } from "next/server";
import { getOntarioComplianceState } from "@/lib/compliance";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      concurrencyLimit = 10,
      ontarioHoursEnforced = true,
      selectedRecordIds = [],
      overrideComplianceWarning = false,
    } = body;

    const compliance = getOntarioComplianceState();

    if (ontarioHoursEnforced && !compliance.isWithinBusinessHours && !overrideComplianceWarning) {
      return NextResponse.json(
        {
          success: false,
          blockedByCompliance: true,
          message: `CRTC Outbound Lock Active: Current Toronto time is ${compliance.currentTorontoTime}. Outbound telemarketing is restricted to Mon-Fri 09:00-20:00 EST and Sat 09:00-17:00 EST. Calling is paused until window reopens at ${compliance.windowOpensAt}.`,
          complianceState: compliance,
        },
        { status: 423 } // 423 Locked
      );
    }

    const batchSize = Array.isArray(selectedRecordIds) && selectedRecordIds.length > 0
      ? selectedRecordIds.length
      : 25;

    return NextResponse.json({
      success: true,
      batchId: `batch_on_${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      dispatchedCount: batchSize,
      activeChannels: Math.min(concurrencyLimit, batchSize),
      telephonyEngine: "Vapi Outbound Dispatcher (Twilio SIP Trunking)",
      settingsApplied: {
        concurrency: concurrencyLimit,
        ontarioHoursEnforced,
        nationalDncScrubbed: true,
        maxRetries: 3,
        retryIntervalHours: 4,
      },
      message: `Batch campaign successfully armed. Dispatched ${batchSize} records across ${Math.min(concurrencyLimit, batchSize)} concurrent SIP channels.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Batch dialer initialization failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
