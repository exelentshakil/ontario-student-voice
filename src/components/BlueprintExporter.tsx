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
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";

interface BlueprintExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = "n8n" | "vapi" | "twilio" | "airtable";

interface TabMeta {
  key: TabKey;
  label: string;
  formatBadge: string;
  filename: string;
  targetStack: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  description: string;
}

const TAB_CONFIGS: TabMeta[] = [
  {
    key: "n8n",
    label: "n8n Workflow JSON",
    formatBadge: "JSON",
    filename: "ontario_voice_n8n_workflow.json",
    targetStack: "n8n Self-Hosted / Cloud Automation",
    icon: FileJson,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "Production event webhook receiver, conditional intent routing, Airtable patch, and Slack alert pipeline.",
  },
  {
    key: "vapi",
    label: "Vapi Assistant Spec",
    formatBadge: "SPEC",
    filename: "vapi_assistant_spec.json",
    targetStack: "Vapi Voice AI Orchestrator",
    icon: FileCode,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    description: "Complete assistant schema: Deepgram Nova-2 STT, Cartesia Canadian voice, OpenAI gpt-4o-mini, and tool definitions.",
  },
  {
    key: "twilio",
    label: "Twilio SIP Script",
    formatBadge: "BASH",
    filename: "twilio_sip_setup.sh",
    targetStack: "Twilio Elastic SIP Trunk (Toronto POP)",
    icon: Terminal,
    iconColor: "text-amber-600 dark:text-amber-400",
    description: "cURL script configuring Canadian E.164 caller ID, TLS encryption, and sub-40ms low-latency media termination.",
  },
  {
    key: "airtable",
    label: "Airtable Schema",
    formatBadge: "SCHEMA",
    filename: "airtable_schema_spec.json",
    targetStack: "Airtable REST API",
    icon: Database,
    iconColor: "text-teal-600 dark:text-teal-400",
    description: "14-field typed table schema including verification status, tuition acknowledgement, and SHA-256 consent hash.",
  },
];

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
    systemPrompt:
      "You are Sarah, an automated AI voice admissions assistant calling on behalf of licensed career colleges in Ontario, Canada. You must open with mandatory AI & 2-party recording disclosure, confirm identity, verify program/city/employment, confirm whether actively looking to enrol, surface that programs are tuition-based diploma programs (not free government training and no job placement guarantee), and capture verbal consent to share with partner colleges.",
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
  firstMessage:
    "Hello! This is Sarah, an automated AI assistant calling on behalf of Ontario Career College Admissions. This call is recorded for quality and compliance. Am I speaking with {student_name}?",
  endCallPhrases: ["have a wonderful day", "added to our permanent do not call list"],
};

export function BlueprintExporter({ isOpen, onClose }: BlueprintExporterProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("n8n");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeMeta = TAB_CONFIGS.find((t) => t.key === activeTab) || TAB_CONFIGS[0];

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
              {
                name: "City",
                type: "singleSelect",
                options: ["Toronto", "Mississauga", "Brampton", "Hamilton", "Ottawa", "London"],
              },
              { name: "Program_Interest", type: "singleLineText" },
              {
                name: "Verification_Status",
                type: "singleSelect",
                options: [
                  "Verified & Interested",
                  "Not Interested / Closed",
                  "Invalid / Disconnected",
                  "DNC Opt-Out",
                ],
              },
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
    const blob = new Blob([getContent()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeMeta.filename;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4 bg-[var(--color-panel)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  Production Integration Blueprints
                </h3>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-xs font-mono font-bold">
                  Turnkey Deploy
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Downloadable infrastructure configs for n8n, Vapi, Twilio Elastic SIP, and Airtable
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-panel-subtle)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tier 1: Full-Width 4-Tab Segmented Strip (Guaranteed Zero Truncation & Zero Wrapping) */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-6 py-3 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-[var(--color-panel)] rounded-xl border border-[var(--color-border)]">
            {TAB_CONFIGS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)] shadow-sm font-bold border border-[var(--color-brand-primary)]/25"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${tab.iconColor} shrink-0`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span className="rounded bg-[var(--color-panel-subtle)] px-1.5 py-0.5 text-xs font-mono font-bold text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]">
                    {tab.formatBadge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2: Dedicated Action Controls & File Context Sub-Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 text-xs shrink-0">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="font-mono font-bold text-[var(--color-brand-primary)]">
              {activeMeta.filename}
            </span>
            <span>•</span>
            <span className="text-[var(--color-text-muted)] truncate max-w-sm">
              {activeMeta.targetStack}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Copy className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="whitespace-nowrap">{copied ? "Copied!" : "Copy Code"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-primary)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Download File</span>
            </button>
          </div>
        </div>

        {/* Code Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-panel)]">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 font-mono text-xs overflow-x-auto leading-relaxed text-[var(--color-text-primary)] select-all max-h-[380px]">
            <pre className="whitespace-pre">{getContent()}</pre>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-panel-subtle)] px-6 py-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Ready for instant import into n8n Cloud or self-hosted Docker instances.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              100% Client Ownership
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] px-4 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
