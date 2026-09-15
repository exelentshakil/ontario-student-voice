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
  CheckCircle2,
  Cpu,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Activity,
  Lock,
  Zap,
} from "lucide-react";

interface NodeItem {
  id: number;
  stage: 1 | 2;
  stepNumber: string;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  techSpec: string;
  complianceRule: string;
  fallbackPolicy: string;
}

const NODES: NodeItem[] = [
  // STAGE 1: PRE-CALL & COMPLIANCE GATEWAY
  {
    id: 1,
    stage: 1,
    stepNumber: "01",
    title: "Airtable Lead Ingestion",
    category: "System of Record",
    badge: "15.2k Records",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
    icon: Database,
    description: "Ingests domestic student records collected via Meta quizzes and landing pages that are 1–2 years stale.",
    techSpec: "n8n cron webhook poller • 50-chunk concurrency batches • Zero raw transcript dumping",
    complianceRule: "PIPEDA Schedule 1: Data accuracy validation on records exceeding 12 months stale age.",
    fallbackPolicy: "Queue pause with exponential backoff on Airtable 429 rate limit errors (5 req/sec).",
  },
  {
    id: 2,
    stage: 1,
    stepNumber: "02",
    title: "CRTC & Ontario TZ Gate",
    category: "Regulatory Compliance",
    badge: "09:00–20:00 EST",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
    icon: Clock,
    description: "Hardware & software lock enforcing CRTC telemarketing calling hours; Sunday dials are strictly blocked at carrier trunk.",
    techSpec: "America/Toronto timezone hardware clock lock • National DNCL scrubbing • In-memory Bloom filter <2ms",
    complianceRule: "CRTC Telecommunications Act (Telecom Decision 2014-155 Part II Section 4).",
    fallbackPolicy: "Immediate queue pause when local Toronto clock hits 20:00 EST; auto-resumes at 09:00 EST.",
  },
  {
    id: 3,
    stage: 1,
    stepNumber: "03",
    title: "Vapi Voice Dispatcher",
    category: "Telephony Infrastructure",
    badge: "Toronto POP",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900",
    icon: Radio,
    description: "PSTN carrier outbound dialer bridging via Twilio Elastic SIP trunk with sub-400ms voice pipeline.",
    techSpec: "Deepgram Nova-2 STT • Cartesia Sonic Canadian voice persona • Answering Machine Detection (AMD)",
    complianceRule: "Canadian E.164 caller ID registration with valid Canadian callback number.",
    fallbackPolicy: "Automatic retry on busy/voicemail (max 3 attempts, 4-hour backoff window).",
  },
  {
    id: 4,
    stage: 1,
    stepNumber: "04",
    title: "AI Disclosure & Recording SLA",
    category: "Mandatory Opener",
    badge: "5s AI SLA",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
    icon: Bot,
    description: "Explicitly states automated AI caller identity and two-party recording notice in the very first sentence.",
    techSpec: "Non-negotiable opener prompt injection • Interruption-proof conversational state anchor",
    complianceRule: "CRTC ADAD Rules Section 3 & Ontario 2-party recording consent requirements.",
    fallbackPolicy: "Call auto-terminates if student challenges AI identity before acknowledgment.",
  },

  // STAGE 2: IN-CALL AUDIT & ADMISSIONS DISPATCH
  {
    id: 5,
    stage: 2,
    stepNumber: "05",
    title: "Identity & Program Check",
    category: "Data Hygiene",
    badge: "3 Fields",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900",
    icon: UserCheck,
    description: "Confirms student legal name, intended program interest, Ontario city of residence, and employment status.",
    techSpec: "Dual AI reasoning (OpenAI gpt-4o-mini primary + Gemini 2.0 Flash failover) • <300ms inference",
    complianceRule: "FIPPA student record verification before disclosing academic partner affiliations.",
    fallbackPolicy: "Flags record as 'Wrong Person / Reassigned' if phone holder denies identity.",
  },
  {
    id: 6,
    stage: 2,
    stepNumber: "06",
    title: "Tuition Expectation Filter",
    category: "Honest Expectation Filter",
    badge: "Tuition Gate",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
    icon: AlertTriangle,
    description: "Transparently explains programs are tuition-based diploma programs, not free government grants, with no job guarantees.",
    techSpec: "Deterministic qualifying gate • Filters false grant expectations • Saves admissions advisor time",
    complianceRule: "Ontario Career Colleges Act: Prohibits misleading advertising and guaranteed employment claims.",
    fallbackPolicy: "Polite close and 'Closed / Not Interested' Airtable update if seeking 100% free training.",
  },
  {
    id: 7,
    stage: 2,
    stepNumber: "07",
    title: "Verbal Consent & SHA-256",
    category: "Cryptographic Audit",
    badge: "SHA-256",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
    icon: FileCheck2,
    description: "Captures explicit verbal permission to transfer file to partner college; computes SHA-256 hash with ISO timestamp.",
    techSpec: "log_verbal_consent tool call • Audio segment slice stored • SHA-256 hash written to Airtable",
    complianceRule: "PIPEDA express verbal consent capture with verifiable cryptographic audit trail.",
    fallbackPolicy: "Zero third-party college data sharing without explicit affirmative verbal response.",
  },
  {
    id: 8,
    stage: 2,
    stepNumber: "08",
    title: "4-Way Routing & n8n Sync",
    category: "Admissions Handoff",
    badge: "Warm Transfer",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900",
    icon: PhoneForwarded,
    description: "Bridges confirmed students to live admissions reps via SIP conference, books calendar callback, or logs permanent DNC.",
    techSpec: "SIP REFER warm transfer • Cal.com callback API • n8n webhook writes 14 typed Airtable fields",
    complianceRule: "Immediate permanent DNC opt-out propagation across all future Ontario campaigns.",
    fallbackPolicy: "Automatic fallback to Cal.com SMS booking link if live rep lines are busy.",
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
        const next = activeStep + 1;
        setActiveStep(next);
        setSelectedNode(NODES[next - 1]);
      }, 1400);
    } else if (activeStep === NODES.length) {
      timer = setTimeout(() => {
        setIsSimulating(false);
      }, 1800);
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
    setSelectedNode(NODES[3]);
  };

  const stage1Nodes = NODES.filter((n) => n.stage === 1);
  const stage2Nodes = NODES.filter((n) => n.stage === 2);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 sm:p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
              Autonomous Admissions Voice Verification Architecture
            </h3>
            <span className="rounded-md bg-[var(--color-brand-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-brand-primary)] font-mono whitespace-nowrap shrink-0">
              Vapi • n8n Stack
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            End-to-end event orchestration: from stale Airtable lead ingestion to CRTC compliance lock, AI disclosure, tuition reality check, verbal consent, and live admissions transfer.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer ${
              isSimulating
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)]"
            }`}
          >
            <Play className={`h-3.5 w-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            {isSimulating ? `Executing Step ${activeStep}/8...` : "Simulate Full Pipeline"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] transition-colors cursor-pointer"
            title="Reset simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main 2-Tier Pipeline */}
      <div className="mt-6 space-y-6">
        {/* Tier 1: Pre-Call Ingestion & Compliance Gateway */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                Phase 1
              </span>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Pre-Call Ingestion &amp; Regulatory Compliance Gate (Steps 01–04)
              </h4>
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Hardware &amp; Telecom Guardrails
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stage1Nodes.map((node) => {
              const Icon = node.icon;
              const isCurrent = activeStep === node.id;
              const isPassed = activeStep !== null && activeStep > node.id;
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 sm:p-5 transition-all cursor-pointer ${
                    isCurrent
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-panel)] ring-2 ring-indigo-500/30 shadow-md scale-[1.01]"
                      : isPassed
                      ? "border-emerald-300 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      : isSelected
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-panel)] shadow-sm"
                      : "border-[var(--color-border)] bg-[var(--color-panel)] hover:border-[var(--color-text-secondary)] hover:shadow-sm"
                  }`}
                >
                  {/* Top Bar inside Card */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                            isCurrent
                              ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white"
                              : isPassed
                              ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-[var(--color-panel-subtle)] border-[var(--color-border)] text-[var(--color-brand-primary)]"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <span className="font-mono text-xs font-bold text-[var(--color-text-muted)]">
                          STEP {node.stepNumber}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-mono font-semibold whitespace-nowrap shrink-0 ${node.badgeColor}`}>
                        {node.badge}
                      </span>
                    </div>

                    {/* Card Title & Category */}
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-[var(--color-brand-primary)] uppercase tracking-wider block">
                        {node.category}
                      </span>
                      <h5 className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">
                        {node.title}
                      </h5>
                      <p className="mt-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech Spec Tag */}
                  <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                    <span className="font-mono text-[var(--color-text-muted)] truncate">
                      {node.techSpec.split("•")[0]}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-brand-primary)] shrink-0 ml-1">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transitional Flow Bridge */}
        <div className="rounded-xl border border-dashed border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-subtle)]/40 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-primary)] text-white">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-[var(--color-text-primary)]">
                PSTN Carrier Connection Established &bull; Real-Time Audio Streaming Initiated
              </span>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Twilio SIP trunk terminates at Toronto edge POP &bull; Deepgram Nova-2 STT &amp; Cartesia Sonic Canadian voice active &bull; Sub-400ms latency
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs text-[var(--color-brand-primary)] font-bold shrink-0">
            <span>Conversational State Machine</span>
            <ArrowDown className="h-4 w-4 sm:hidden" />
            <ArrowRight className="h-4 w-4 hidden sm:inline" />
          </div>
        </div>

        {/* Tier 2: In-Call Audit & Admissions Dispatch */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                Phase 2
              </span>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                In-Call Verification, Filtering &amp; Admissions Handoff (Steps 05–08)
              </h4>
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Deterministic 7-Stage Voice Machine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stage2Nodes.map((node) => {
              const Icon = node.icon;
              const isCurrent = activeStep === node.id;
              const isPassed = activeStep !== null && activeStep > node.id;
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 sm:p-5 transition-all cursor-pointer ${
                    isCurrent
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-panel)] ring-2 ring-indigo-500/30 shadow-md scale-[1.01]"
                      : isPassed
                      ? "border-emerald-300 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      : isSelected
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-panel)] shadow-sm"
                      : "border-[var(--color-border)] bg-[var(--color-panel)] hover:border-[var(--color-text-secondary)] hover:shadow-sm"
                  }`}
                >
                  {/* Top Bar inside Card */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                            isCurrent
                              ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white"
                              : isPassed
                              ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-[var(--color-panel-subtle)] border-[var(--color-border)] text-[var(--color-brand-primary)]"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <span className="font-mono text-xs font-bold text-[var(--color-text-muted)]">
                          STEP {node.stepNumber}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-mono font-semibold whitespace-nowrap shrink-0 ${node.badgeColor}`}>
                        {node.badge}
                      </span>
                    </div>

                    {/* Card Title & Category */}
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-[var(--color-brand-primary)] uppercase tracking-wider block">
                        {node.category}
                      </span>
                      <h5 className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">
                        {node.title}
                      </h5>
                      <p className="mt-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech Spec Tag */}
                  <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                    <span className="font-mono text-[var(--color-text-muted)] truncate">
                      {node.techSpec.split("•")[0]}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-brand-primary)] shrink-0 ml-1">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deep-Dive Technical Inspector Box */}
      {selectedNode && (
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-brand-primary)] shadow-sm">
                <selectedNode.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] font-mono uppercase tracking-wider">
                    STEP {selectedNode.stepNumber} &bull; PHASE {selectedNode.stage} &bull; {selectedNode.category}
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-xs font-mono font-bold whitespace-nowrap shrink-0">
                    Active Node
                  </span>
                </div>
                <h4 className="text-base font-bold text-[var(--color-text-primary)] mt-0.5">
                  {selectedNode.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-lg border px-3 py-1 text-xs font-mono font-bold whitespace-nowrap shrink-0 ${selectedNode.badgeColor}`}>
                {selectedNode.badge}
              </span>
            </div>
          </div>

          {/* Inspector 3-Column Spec Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Architecture & Specs */}
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)] mb-1.5">
                <Cpu className="h-4 w-4 text-indigo-500" />
                Technical Implementation
              </div>
              <p className="font-mono text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {selectedNode.techSpec}
              </p>
            </div>

            {/* 2. Regulatory Compliance */}
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)] mb-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                CRTC &amp; Privacy Rule
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {selectedNode.complianceRule}
              </p>
            </div>

            {/* 3. Failover & Resilience */}
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)] mb-1.5">
                <Activity className="h-4 w-4 text-amber-500" />
                Resilience &amp; Failover Policy
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {selectedNode.fallbackPolicy}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
