"use client";

import React, { useState } from "react";
import { X, Code, Copy, Check, ExternalLink, Terminal, Globe, Shield } from "lucide-react";

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiDocsModal({ isOpen, onClose }: ApiDocsModalProps) {
  const [activeTab, setActiveTab] = useState<"verify" | "webhook" | "batch" | "health">("verify");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = {
    verify: {
      method: "POST",
      path: "/api/ai/verify",
      description:
        "Processes real-time outbound voice turns with strict Canadian CRTC compliance, 7-step state machine progression, and zero-dependency OpenAI/Gemini failover.",
      requestExample: `{
  "student": {
    "id": "std_tor_081",
    "fullName": "Marcus Vance",
    "phone": "+1-416-555-0142",
    "city": "Toronto",
    "programInterest": "Cybersecurity & Network Administration",
    "currentEmployment": "Part-Time Retail Associate"
  },
  "currentStage": "4_CORE_QUESTION",
  "studentMessage": "Yes, I'm definitely still looking to start this September.",
  "history": [
    { "speaker": "agent", "text": "Are you still actively looking to enrol in a college program?" }
  ]
}`,
      responseExample: `{
  "reply": "That's great Marcus. Before we proceed, I want to be completely transparent: our partner career colleges offer intensive tuition-based diploma programs, not free government training, and there is no guaranteed job placement. Are you prepared to invest in your tuition if accepted?",
  "nextStage": "5_EXPECTATION_SETTING",
  "extractedData": {
    "isActivelyLooking": true,
    "targetTimeframe": "September 2026"
  },
  "branching": "IN_PROGRESS",
  "provider": "openai",
  "model": "gpt-4o-mini",
  "latencyMs": 112
}`,
    },
    webhook: {
      method: "POST",
      path: "/api/vapi/webhook",
      description:
        "Consumes Vapi call.ended telemetry, parses transcript turns, validates SHA-256 verbal consent audit hash, and dispatches structured payload to n8n for Airtable record updates.",
      requestExample: `{
  "message": {
    "type": "call.ended",
    "call": {
      "id": "call_vapi_9934",
      "status": "ended",
      "endedReason": "customer-ended-call",
      "customer": { "number": "+14165550142", "name": "Marcus Vance" }
    },
    "customer": { "id": "std_tor_081" },
    "analysis": {
      "structuredData": {
        "status": "CONFIRMED_INTERESTED",
        "actively_looking": true,
        "timeframe": "September 2026",
        "tuition_acknowledged": true,
        "consent_timestamp": "2026-09-15T14:14:02.000Z",
        "consent_quote": "Yes, I agree to share my details with the college admissions office."
      }
    }
  }
}`,
      responseExample: `{
  "success": true,
  "status": "AIRTABLE_SYNCED",
  "syncedFields": [
    "Verification Status",
    "Actively Looking",
    "Target Timeframe",
    "Tuition Acknowledged",
    "Consent Timestamp",
    "Verbal Consent Hash",
    "Recording URL",
    "Vapi Call ID"
  ],
  "airtableRecordId": "rec9810427bba",
  "n8nExecutionId": "exec_44921"
}`,
    },
    batch: {
      method: "POST",
      path: "/api/batch/dial",
      description:
        "Batch campaign dialing engine with concurrency throttling (1-50 channels) and automated Ontario business hours gatekeeper (Mon-Fri 9am-8pm, Sat 9am-5pm EST).",
      requestExample: `{
  "leadIds": ["std_tor_081", "std_mis_092", "std_brm_103"],
  "concurrencyLimit": 15,
  "enforceOntarioHours": true,
  "callerId": "+1-416-555-0100"
}`,
      responseExample: `{
  "status": "DISPATCHED",
  "campaignId": "cmp_ontario_sept_01",
  "queuedCount": 3,
  "concurrencyActive": 15,
  "ontarioWindow": {
    "isWithinPermittedHours": true,
    "currentTime": "14:14:02 EDT",
    "rulesApplied": "CRTC Telecom Regulatory Policy CRTC 2014-155"
  }
}`,
    },
    health: {
      method: "GET",
      path: "/api/health",
      description:
        "System health and observability probe monitoring Twilio SIP latency, Vapi orchestrator, OpenAI/Gemini endpoints, and real-time CRTC calling status.",
      requestExample: `GET /api/health HTTP/1.1
Host: ontario-student-voice.vercel.app`,
      responseExample: `{
  "status": "healthy",
  "timestamp": "2026-09-15T14:14:02.105Z",
  "checks": {
    "openai": { "status": "operational", "latencyMs": 48 },
    "gemini": { "status": "operational", "latencyMs": 32 },
    "vapi_orchestrator": { "status": "connected", "region": "us-east-1" },
    "twilio_sip_trunk": { "status": "active", "edge": "toronto-canada" },
    "ontario_compliance_window": {
      "isPermitted": true,
      "timezone": "America/Toronto",
      "dayOfWeek": 2,
      "currentTime": "14:14:02"
    }
  }
}`,
    },
  };

  const current = endpoints[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  API &amp; Webhook Integration Specs
                </h3>
                <span className="rounded bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  OpenAPI 3.1
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Production REST endpoints for Vapi, n8n, Twilio, and Airtable synchronization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-panel-subtle)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--color-border-subtle)] bg-[var(--color-panel-subtle)] px-6 pt-2 gap-1 overflow-x-auto">
          {(["verify", "webhook", "batch", "health"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab
                  ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] bg-[var(--color-panel)] rounded-t-lg"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                  endpoints[tab].method === "POST"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                }`}
              >
                {endpoints[tab].method}
              </span>
              {endpoints[tab].path}
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded px-2 py-1 text-xs font-mono font-bold ${
                  current.method === "POST"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                }`}
              >
                {current.method}
              </span>
              <span className="font-mono text-sm font-bold text-[var(--color-text-primary)]">
                {current.path}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {current.description}
            </p>
          </div>

          {/* Request Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Request Payload
              </span>
              <button
                onClick={() => handleCopy(current.requestExample, `req_${activeTab}`)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-brand-primary)] hover:underline cursor-pointer"
              >
                {copiedCode === `req_${activeTab}` ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy Payload
                  </>
                )}
              </button>
            </div>
            <pre className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 font-mono text-xs text-[var(--color-text-primary)] overflow-x-auto leading-relaxed">
              {current.requestExample}
            </pre>
          </div>

          {/* Response Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Response Payload (200 OK)
              </span>
              <button
                onClick={() => handleCopy(current.responseExample, `res_${activeTab}`)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-brand-primary)] hover:underline cursor-pointer"
              >
                {copiedCode === `res_${activeTab}` ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy Payload
                  </>
                )}
              </button>
            </div>
            <pre className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 font-mono text-xs text-[var(--color-text-primary)] overflow-x-auto leading-relaxed">
              {current.responseExample}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-panel-subtle)] px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>Strict TLS 1.3 encryption &amp; Bearer token authentication enforced</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
