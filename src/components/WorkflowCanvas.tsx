"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Clock,
  Radio,
  Bot,
  UserCheck,
  AlertTriangle,
  FileCheck2,
  PhoneForwarded,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Cpu,
} from "lucide-react";

interface NodeItem {
  id: number;
  title: string;
  category: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  techSpec: string;
}

const NODES: NodeItem[] = [
  {
    id: 1,
    title: "Airtable Lead List",
    category: "System of Record",
    badge: "15,240 Records",
    icon: Database,
    description: "Ingests domestic student records collected via Meta quizzes and landing pages.",
    techSpec: "n8n polling cron / Airtable Webhook • Batch 50-chunk concurrency",
  },
  {
    id: 2,
    title: "CRTC & Ontario TZ Lock",
    category: "Compliance Guardrail",
    badge: "Mon-Sat 09:00-20:00 EST",
    icon: Clock,
    description: "Enforces Ontario telemarketing hours, blocks Sundays, scrubs National DNCL.",
    techSpec: "America/Toronto DateTime gate • In-memory DNC Bloom filter <2ms",
  },
  {
    id: 3,
    title: "Vapi Voice Dispatcher",
    category: "Telephony Layer",
    badge: "Twilio Elastic SIP",
    icon: Radio,
    description: "Outbound PSTN carrier dialer with Deepgram Nova-2 STT & Cartesia voice.",
    techSpec: "Sub-400ms end-to-end latency • Answering Machine Detection (AMD)",
  },
  {
    id: 4,
    title: "AI Disclosure & Recording",
    category: "Mandatory Compliance",
    badge: "5-Second SLA",
    icon: Bot,
    description: "Explicitly states automated AI caller identity and two-party recording notice.",
    techSpec: "Non-negotiable opener • Interruption-proof conversational anchor",
  },
  {
    id: 5,
    title: "Identity & Detail Check",
    category: "Data Hygiene",
    badge: "3 Fields Validated",
    icon: UserCheck,
    description: "Confirms student name, program interest, Ontario city, and employment status.",
    techSpec: "Dual AI reasoning (OpenAI gpt-4o-mini + Gemini 2.0 Flash)",
  },
  {
    id: 6,
    title: "Tuition Expectation Filter",
    category: "Core Filter",
    badge: "Not Free / No Job Guarantee",
    icon: AlertTriangle,
    description: "Surfaces tuition-based diploma reality, eliminating false grant expectations.",
    techSpec: "Disqualifies grant-seekers transparently • Saves human advisor hours",
  },
  {
    id: 7,
    title: "Verbal Consent Capture",
    category: "Audit Security",
    badge: "SHA-256 Timestamped",
    icon: FileCheck2,
    description: "Captures explicit spoken consent to share file with accredited Ontario college.",
    techSpec: "Cryptographic audio segment hash • Stored in Airtable record",
  },
  {
    id: 8,
    title: "Warm Transfer & n8n Sync",
    category: "Admissions Handoff",
    badge: "Live Advisor / Cal.com",
    icon: PhoneForwarded,
    description: "Instantly bridges call to live college admissions rep or books calendar slot.",
    techSpec: "SIP Conference Bridge • Webhook to n8n writes 14 typed fields",
  },
];

export function WorkflowCanvas() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<NodeItem>(NODES[3]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating && activeStep !== null && activeStep < NODES.length) {
      timer = setTimeout(() => {
        setActiveStep((prev) => (prev !== null && prev < NODES.length ? prev + 1 : null));
        if (activeStep + 1 <= NODES.length) {
          setSelectedNode(NODES[activeStep]);
        }
      }, 1200);
    } else if (activeStep === NODES.length) {
      timer = setTimeout(() => {
        setIsSimulating(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, activeStep]);

  const handleStartSimulation = () => {
    setActiveStep(1);
    setIsSimulating(true);
    setSelectedNode(NODES[0]);
  };

  const handleReset = () => {
    setActiveStep(null);
    setIsSimulating(false);
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-sm">
      {/* Canvas Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] sm:text-base">
              Autonomous Admissions Voice Verification Pipeline
            </h3>
            <span className="rounded-md bg-[var(--color-brand-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-brand-primary)] font-mono">
              Vapi + Twilio SIP + n8n + Airtable
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            End-to-end event orchestration: from stale Airtable lead to CRTC compliance lock, tuition expectation audit, verbal consent, and live admissions transfer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isSimulating
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)]"
            }`}
          >
            <Play className={`h-3.5 w-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            {isSimulating ? `Executing Node ${activeStep}/${NODES.length}` : "Simulate Full Pipeline"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-[var(--color-border)] p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] transition-colors cursor-pointer"
            title="Reset simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Pipeline Grid */}
      <div className="relative mt-5 overflow-x-auto pb-4">
        <div className="min-w-[860px]">
          {/* Animated Connecting Line */}
          <div className="relative mb-6">
            <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--color-border)]"></div>
            <div
              className="absolute left-6 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--color-brand-primary)] transition-all duration-700"
              style={{
                width: activeStep ? `${((activeStep - 1) / (NODES.length - 1)) * 92}%` : "0%",
              }}
            ></div>

            {/* Nodes Row */}
            <div className="relative flex justify-between gap-2">
              {NODES.map((node) => {
                const Icon = node.icon;
                const isCurrent = activeStep === node.id;
                const isPassed = activeStep !== null && activeStep > node.id;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`group relative flex flex-col items-center text-center transition-all cursor-pointer focus:outline-none`}
                    style={{ width: "11.5%" }}
                  >
                    {/* Node Circle Badge */}
                    <div
                      className={`relative flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                        isCurrent
                          ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white shadow-lg shadow-indigo-500/30 scale-110 ring-4 ring-indigo-500/20"
                          : isPassed
                          ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : isSelected
                          ? "border-[var(--color-brand-primary)] bg-[var(--color-panel)] text-[var(--color-brand-primary)] ring-2 ring-indigo-500/30"
                          : "border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-muted)] hover:border-[var(--color-text-secondary)]"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}

                      {/* Step Number */}
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-panel-subtle)] border border-[var(--color-border)] text-[9px] font-bold font-mono text-[var(--color-text-secondary)]">
                        {node.id}
                      </span>
                    </div>

                    {/* Step Title */}
                    <span
                      className={`mt-2 block text-xs font-semibold leading-snug line-clamp-2 ${
                        isSelected || isCurrent
                          ? "text-[var(--color-brand-primary)]"
                          : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {node.title}
                    </span>

                    {/* Status Pill */}
                    <span className="mt-1 block text-[10px] font-mono text-[var(--color-text-muted)] truncate max-w-full">
                      {node.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Inspector Card: Technical Specifications for Selected Node */}
      {selectedNode && (
        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-brand-primary)]">
                <selectedNode.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Node {selectedNode.id} • {selectedNode.category}
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 text-[10px] font-mono font-semibold">
                    HEALTHY
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                  {selectedNode.title}
                </h4>
              </div>
            </div>

            <div className="text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-panel)] border border-[var(--color-border)] px-3 py-1.5 rounded-md">
              <Cpu className="h-3.5 w-3.5 inline mr-1.5 text-indigo-500" />
              {selectedNode.techSpec}
            </div>
          </div>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            {selectedNode.description}
          </p>
        </div>
      )}
    </div>
  );
}
