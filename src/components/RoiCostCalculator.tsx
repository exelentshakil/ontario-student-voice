"use client";

import React, { useState } from "react";
import {
  X,
  Calculator,
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  Bot,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface RoiCostCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoiCostCalculator({ isOpen, onClose }: RoiCostCalculatorProps) {
  const [recordCount, setRecordCount] = useState<number>(15000);
  const [humanHourlyRate, setHumanHourlyRate] = useState<number>(25); // CAD

  if (!isOpen) return null;

  // Unit economics
  // Human rep: ~12 dials per hour (including busy/voicemail/wrapup) -> 1,250 hours for 15,000 dials
  const humanHoursNeeded = Math.round(recordCount / 12);
  const humanTotalCost = humanHoursNeeded * humanHourlyRate;
  const humanDurationWeeks = (humanHoursNeeded / 120).toFixed(1); // 3 full-time reps

  // AI Voice Agent (Vapi + Twilio SIP + OpenAI gpt-4o-mini + Deepgram Nova-2 + Cartesia)
  // Average blended cost: $0.42 CAD per completed call attempt
  const aiCostPerCallCad = 0.42;
  const aiTotalCost = Math.round(recordCount * aiCostPerCallCad);
  const netSavingsCad = humanTotalCost - aiTotalCost;
  const savingsPct = Math.round((netSavingsCad / humanTotalCost) * 100);
  const aiDurationDays = Math.ceil(recordCount / (50 * 30)); // 50 concurrent lines, 30 calls/hr = 1,500 calls/hr -> ~10-12 hours across 2 days

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Ontario Lead Verification ROI &amp; Unit Economics
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Human Call Center Reps vs Autonomous AI Voice Verification
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

        {/* Content */}
        <div className="mt-5 space-y-5 text-xs">
          {/* Slider Control */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <div className="flex items-center justify-between font-semibold text-[var(--color-text-primary)]">
              <span>Stale Student Database Volume:</span>
              <span className="font-mono text-base font-bold text-[var(--color-brand-primary)]">
                {recordCount.toLocaleString()} Records
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={25000}
              step={1000}
              value={recordCount}
              onChange={(e) => setRecordCount(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-[var(--color-brand-primary)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
              <span>5,000 Records</span>
              <span>15,000 (Target)</span>
              <span>25,000 Records</span>
            </div>
          </div>

          {/* High-Impact Comparison Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Human Team Card */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Manual Human Callers
                </span>
                <span className="font-mono text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                  $25.00 CAD / Hour
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-400">
                  ${humanTotalCost.toLocaleString()} CAD
                </div>
                <div className="mt-2 space-y-1 text-[11px] text-[var(--color-text-secondary)]">
                  <div className="flex justify-between">
                    <span>Labor Hours Required:</span>
                    <strong className="font-mono">{humanHoursNeeded.toLocaleString()} hrs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnaround Window:</span>
                    <strong className="font-mono">~{humanDurationWeeks} Weeks (3 Reps)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Human Fatigue / Dropped Data:</span>
                    <strong className="text-rose-600">~22% Inconsistency</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Voice Agent Card */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Bot className="h-4 w-4" />
                  VeriStudent AI Voice Agent
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  $0.42 CAD / Attempt
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  ${aiTotalCost.toLocaleString()} CAD
                </div>
                <div className="mt-2 space-y-1 text-[11px] text-[var(--color-text-secondary)]">
                  <div className="flex justify-between">
                    <span>Concurrency Capacity:</span>
                    <strong className="font-mono">Up to 50 Live Lines</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Campaign Turnaround:</span>
                    <strong className="font-mono">2–3 Days (CRTC Compliant)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>CRTC Audit Compliance:</span>
                    <strong className="text-emerald-600 font-bold">100% Deterministic</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net ROI Callout Banner */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Net Capital Saved Across Campaign:
                </span>
                <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  +${netSavingsCad.toLocaleString()} CAD
                </div>
              </div>
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 text-center">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                  {savingsPct}% Budget Reduction
                </span>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  {humanHoursNeeded.toLocaleString()} human rep hours saved
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end border-t border-[var(--color-border-subtle)] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] cursor-pointer"
          >
            Got It, Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
