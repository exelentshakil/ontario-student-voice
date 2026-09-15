"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  Copy,
  FileCode,
  FileJson,
  Terminal,
  Database,
  Check,
} from "lucide-react";

interface BlueprintExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

const N8N_WORKFLOW_JSON = {
  name: "Ontario Career College Voice Verification Pipeline",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "vapi-call-ended",
        responseMode: "onReceived",
      },
      name: "Vapi Webhook Receiver",
      type: "n8n-nodes-base.webhook",
      position: [240, 300],
    },
    {
      parameters: {
        conditions: {
          string: [
            {
              value1: "={{$json.body.message.analysis.structuredData.verificationStatus}}",
              value2: "Verified & Interested",
            },
          ],
        },
      },
      name: "Is Verified Interested?",
      type: "n8n-nodes-base.if",
      position: [460, 300],
    },
    {
      parameters: {
        operation: "update",
        base: { __rl: true, value: "appON_Admissions_2026", mode: "id" },
        table: { __rl: true, value: "Student_Leads_Master", mode: "id" },
        id: "={{$json.body.customer.number}}",
        columns: {
          Verification_Status: "={{$json.body.message.analysis.structuredData.verificationStatus}}",
          Identity_Confirmed: "={{$json.body.message.analysis.structuredData.identityConfirmed}}",
          Tuition_Acknowledged: "={{$json.body.message.analysis.structuredData.tuitionAcknowledged}}",
          Consent_Timestamp: "={{$now}}",
          Consent_SHA256: "={{$json.body.message.analysis.structuredData.consentSha256}}",
          Recording_URL: "={{$json.body.recordingUrl}}",
        },
      },
      name: "Patch Airtable Lead",
      type: "n8n-nodes-base.airtable",
      position: [700, 200],
    },
    {
      parameters: {
        resource: "message",
        operation: "post",
        channel: "#admissions-hot-leads",
        text: "=🔥 High-Intent Lead Verified: {{$json.body.customer.name}} ({{$json.body.message.analysis.structuredData.confirmedProgram}}) in {{$json.body.message.analysis.structuredData.confirmedCity}} ready for admissions callback!",
      },
      name: "Notify Admissions Slack",
      type: "n8n-nodes-base.slack",
      position: [920, 200],
    },
  ],
};

const VAPI_ASSISTANT_JSON = {
  name: "Sarah - Ontario College Admissions Voice Agent",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
    endpointing: 255,
  },
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.15,
    systemPrompt: "You are Sarah, an automated AI voice admissions assistant calling on behalf of licensed career colleges in Ontario, Canada. You must open with mandatory AI & 2-party recording disclosure, confirm identity, verify program/city/employment, confirm whether actively looking to enrol, surface that programs are tuition-based diploma programs (not free government training and no job placement guarantee), and capture verbal consent to share with partner colleges.",
    tools: [
      {
        type: "function",
        function: {
          name: "log_verbal_consent",
          description: "Logs the student's verbal authorization and ISO timestamp for college file sharing",
          parameters: {
            type: "object",
            properties: {
              consentGranted: { type: "boolean" },
              studentQuote: { type: "string" },
              targetIntake: { type: "string" },
            },
            required: ["consentGranted", "studentQuote"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "transfer_to_admissions",
          description: "Initiates warm conference transfer to live college admissions coordinator",
          parameters: {
            type: "object",
            properties: {
              destinationNumber: { type: "string", default: "+14165550100" },
            },
          },
        },
      },
    ],
  },
  voice: {
    provider: "cartesia",
    voiceId: "sonic-english-canadian-warm",
  },
  firstMessage: "Hello! This is Sarah, an automated AI assistant calling on behalf of Ontario Career College Admissions. This call is recorded for quality and compliance. Am I speaking with {student_name}?",
  endCallPhrases: ["have a wonderful day", "added to our permanent do not call list"],
};

export function BlueprintExporter({ isOpen, onClose }: BlueprintExporterProps) {
  const [activeTab, setActiveTab] = useState<"n8n" | "vapi" | "twilio" | "airtable">("n8n");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const getContent = () => {
    switch (activeTab) {
      case "n8n":
        return JSON.stringify(N8N_WORKFLOW_JSON, null, 2);
      case "vapi":
        return JSON.stringify(VAPI_ASSISTANT_JSON, null, 2);
      case "twilio":
        return `#!/usr/bin/env bash\n# Twilio SIP Trunk Provisioning Script for Ontario Admissions Voice\n\nTWILIO_ACCOUNT_SID="AC_live_ontario_admissions"\nTWILIO_AUTH_TOKEN="your_auth_token_here"\n\n# Create Elastic SIP Trunk pointed to Toronto Edge\ncurl -X POST "https://trunking.twilio.com/v1/Trunks" \\\n  --data-urlencode "FriendlyName=Ontario-College-Vapi-Trunk" \\\n  --data-urlencode "DomainName=ontario-voice-admissions.pstn.twilio.com" \\\n  --data-urlencode "Secure=true" \\\n  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"\n\necho "Trunk successfully configured with Canadian E.164 caller ID and Toronto POP termination."`;
      case "airtable":
        return JSON.stringify(
          {
            table: "Student_Leads_Master",
            fields: [
              { name: "Full_Name", type: "singleLineText" },
              { name: "Phone", type: "phoneNumber" },
              { name: "City", type: "singleSelect", options: ["Toronto", "Mississauga", "Brampton", "Hamilton", "Ottawa", "London"] },
              { name: "Program_Interest", type: "singleLineText" },
              { name: "Verification_Status", type: "singleSelect", options: ["Verified & Interested", "Not Interested / Closed", "Invalid / Disconnected", "DNC Opt-Out"] },
              { name: "Tuition_Acknowledged", type: "checkbox" },
              { name: "Consent_Timestamp", type: "dateTime" },
              { name: "Consent_SHA256", type: "singleLineText" },
              { name: "Recording_URL", type: "url" },
            ],
          },
          null,
          2
        );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename =
      activeTab === "n8n"
        ? "ontario_voice_n8n_workflow.json"
        : activeTab === "vapi"
        ? "vapi_assistant_spec.json"
        : activeTab === "twilio"
        ? "twilio_sip_setup.sh"
        : "airtable_schema_spec.json";

    const blob = new Blob([getContent()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Production-Ready Integration Blueprints
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Turnkey Exportable Configurations: n8n, Vapi Voice AI, Twilio SIP, and Airtable
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

        {/* Tab Selection Bar */}
        <div className="mt-4 flex items-center justify-between border-b border-[var(--color-border)] pb-2">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab("n8n")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                activeTab === "n8n"
                  ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)]"
              }`}
            >
              <FileJson className="h-4 w-4 text-emerald-500" />
              n8n Workflow JSON
            </button>
            <button
              onClick={() => setActiveTab("vapi")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                activeTab === "vapi"
                  ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)]"
              }`}
            >
              <FileCode className="h-4 w-4 text-indigo-500" />
              Vapi Assistant Spec
            </button>
            <button
              onClick={() => setActiveTab("twilio")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                activeTab === "twilio"
                  ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)]"
              }`}
            >
              <Terminal className="h-4 w-4 text-amber-500" />
              Twilio SIP Script
            </button>
            <button
              onClick={() => setActiveTab("airtable")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                activeTab === "airtable"
                  ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)]"
              }`}
            >
              <Database className="h-4 w-4 text-teal-500" />
              Airtable Schema
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel)] cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-brand-primary)] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download File
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 font-mono text-xs overflow-y-auto max-h-80 leading-relaxed text-[var(--color-text-primary)]">
          <pre>{getContent()}</pre>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>
            Portability Guarantee: 100% client code ownership, zero vendor lock-in.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] px-4 py-1.5 font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel)] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
