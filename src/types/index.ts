export type VerificationStatus =
  | "Pending Dial"
  | "Calling / In-Progress"
  | "Verified & Interested"
  | "Not Interested / Closed"
  | "Invalid / Disconnected"
  | "Wrong Person / Reassigned"
  | "DNC Opt-Out (Permanent)"
  | "Retry Scheduled";

export type EmploymentStatus =
  | "Unemployed / Seeking Work"
  | "Employed (Looking for Career Change)"
  | "Part-time / Underemployed"
  | "Student / Academic"
  | "Other";

export type IntakeTimeframe =
  | "Immediate (Next 30 Days)"
  | "Fall 2026"
  | "Winter 2027"
  | "Within 6-12 Months"
  | "Not Looking"
  | "Undecided";

export interface TranscriptTurn {
  id: string;
  speaker: "agent" | "student" | "system";
  text: string;
  timestampSec: number;
  complianceTag?:
    | "CRTC_AI_DISCLOSURE"
    | "TWO_PARTY_RECORDING"
    | "IDENTITY_VERIFICATION"
    | "TUITION_EXPECTATIONS"
    | "VERBAL_CONSENT_CAPTURED"
    | "DNC_TRIGGERED"
    | "WARM_TRANSFER_INITIATED";
}

export interface VerifiedDetails {
  identityConfirmed: boolean;
  confirmedProgram: string;
  confirmedCity: string;
  confirmedEmployment: string;
  lookingToEnrol: boolean;
  targetIntake: IntakeTimeframe;
  tuitionAcknowledged: boolean; // Mandatory filter: acknowledged tuition-based diploma, not free training, no guaranteed job
  consentToShareTimestamp?: string;
  consentVerbalQuote?: string;
  consentSha256?: string;
  dispositionNote?: string;
  assignedPartnerCollege?: string;
  transferOutcome?: "Warm Transfer Completed" | "Admissions Callback Booked" | "N/A";
  bookingSlot?: string;
  recordingUrl?: string;
  costCad?: number;
}

export interface StudentRecord {
  id: string;
  airtableRecordId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  province: "ON";
  originalProgramInterest: string;
  currentEmploymentStatus: EmploymentStatus;
  leadSource: string;
  dateCollected: string; // e.g. "2024-04-18"
  staleDays: number;
  verificationStatus: VerificationStatus;
  dialAttempts: number;
  lastDialedAt?: string;
  callDurationSec?: number;
  verifiedDetails?: VerifiedDetails;
  callTranscript?: TranscriptTurn[];
}

export type CallStage =
  | "idle"
  | "initiating"
  | "ai_disclosure"
  | "identity_check"
  | "verify_details"
  | "core_question"
  | "tuition_expectations"
  | "verbal_consent"
  | "branch_action"
  | "completed";

export interface BatchDialerConfig {
  campaignName: string;
  concurrencyLimit: number;
  ontarioHoursEnforced: boolean;
  nationalDncScrubbed: boolean;
  maxRetries: number;
  retryIntervalHours: number;
  primaryProvider: "Vapi (SIP Trunked)" | "xAI Grok Voice";
  voiceModel: "Deepgram Nova-2 + OpenAI gpt-4o-mini" | "Deepgram Nova-2 + Gemini 2.0 Flash";
}

export interface KpiSummary {
  totalRecords: number;
  dialedCount: number;
  connectedCount: number;
  connectRatePct: number;
  intentConfirmedCount: number;
  intentConfirmedRatePct: number;
  staleBadNumberCount: number;
  staleBadNumberPct: number;
  dncOptOutCount: number;
  verbalConsentCount: number;
  avgCallDurationSec: number;
  totalCostCad: number;
  costPerConfirmedLeadCad: number;
}

export interface OntarioComplianceState {
  currentTorontoTime: string;
  isWithinBusinessHours: boolean;
  windowOpensAt: string;
  windowClosesAt: string;
  crtcTelemarketingCompliant: boolean;
  activeDncCount: number;
  twoPartyRecordingEnforced: boolean;
  mandatoryAiDisclosureEnforced: boolean;
}
