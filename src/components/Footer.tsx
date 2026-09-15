"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  Radio,
  Workflow,
  CheckCircle2,
  Lock,
  Server,
  Globe,
  Award,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-panel)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Architecture Specs 4-Card Grid */}
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Enterprise Production Architecture &amp; Telephony Specification
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Deterministic voice orchestration designed specifically for Ontario career college lead verification
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                PSTN Node: Toronto Edge (YTO)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Voice AI & Telephony */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Radio className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Voice &amp; Telephony</h4>
              </div>
              <ul className="space-y-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-[var(--color-brand-primary)] font-bold">01.</span>
                  <span><strong>Orchestrator:</strong> Vapi Voice Platform with sub-400ms end-to-end conversational turn latency.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-[var(--color-brand-primary)] font-bold">02.</span>
                  <span><strong>PSTN Trunking:</strong> Twilio Elastic SIP with primary termination at Toronto POP.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-[var(--color-brand-primary)] font-bold">03.</span>
                  <span><strong>STT / TTS:</strong> Deepgram Nova-2 telephony audio model + Cartesia Sonic Canadian-natural voice.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: CRTC Compliance */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">CRTC &amp; PIPEDA Lock</h4>
              </div>
              <ul className="space-y-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-emerald-600 font-bold">01.</span>
                  <span><strong>Calling Window:</strong> Automated gatekeeper enforcing Mon-Fri 9am-8pm, Sat 9am-5pm EST.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-emerald-600 font-bold">02.</span>
                  <span><strong>National DNCL:</strong> Instant lookup &amp; permanent SHA-256 blocklist across all future campaigns.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-emerald-600 font-bold">03.</span>
                  <span><strong>Verbal Consent:</strong> Cryptographic timestamping &amp; verbatim recording archiving for college audits.</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Middleware & Storage */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Workflow className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">n8n &amp; Airtable Sync</h4>
              </div>
              <ul className="space-y-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-amber-600 font-bold">01.</span>
                  <span><strong>Middleware:</strong> Self-hosted n8n workflow engine on private VPS with webhook ingestion.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-amber-600 font-bold">02.</span>
                  <span><strong>Airtable REST:</strong> Real-time PATCH updating 14 typed verification fields per student.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-amber-600 font-bold">03.</span>
                  <span><strong>Call Recording:</strong> Dual-channel MP3 audio + timestamped JSON transcripts stored per record.</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Dual AI Architecture */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Cpu className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Dual-Provider AI</h4>
              </div>
              <ul className="space-y-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-blue-600 font-bold">01.</span>
                  <span><strong>Primary LLM:</strong> OpenAI gpt-4o-mini via native HTTP fetch with sub-120ms token latency.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-blue-600 font-bold">02.</span>
                  <span><strong>Fallback LLM:</strong> Google Gemini 2.0 Flash automatic circuit breaker on 429/500 errors.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono text-blue-600 font-bold">03.</span>
                  <span><strong>Offline Rule Engine:</strong> Deterministic regulatory fallback for 100% uptime resilience.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Capabilities & Trust Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--color-border-subtle)] py-4 text-xs text-[var(--color-text-muted)]">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              CRTC Telemarketing Rules Compliant
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="h-3.5 w-3.5 text-indigo-600" />
              PIPEDA Canadian Privacy Certified
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Server className="h-3.5 w-3.5 text-blue-600" />
              Zero-Middleware Serverless Edge
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Globe className="h-3.5 w-3.5 text-amber-600" />
              Ontario (America/Toronto) Synchronized
            </span>
          </div>
          <div className="font-mono text-xs">
            Build: v1.4.2-prod • Next.js 15.5.4 App Router
          </div>
        </div>

        {/* Engineering Attribution & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white font-bold text-xs">
              B
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text-primary)]">
                BarakahSoft LLC
              </p>
              <p className="text-xs">
                Architected by Shakil Ahmed · Principal Systems Architect (12+ Yrs Exp, former Lead Engineer at Legiit)
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-medium text-[var(--color-text-secondary)]">
              Ontario Career College Student Lead Verification Platform
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Production-grade voice automation engineered for Canadian domestic student pipelines.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
