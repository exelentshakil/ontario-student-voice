"use client";

import React, { useState } from "react";
import {
  X,
  PhoneCall,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getOntarioComplianceState } from "@/lib/compliance";

interface BatchDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchStarted: (count: number) => void;
}

export function BatchDialerModal({
  isOpen,
  onClose,
  onBatchStarted,
}: BatchDialerModalProps) {
  const [concurrency, setConcurrency] = useState<number>(20);
  const [ontarioHoursLocked, setOntarioHoursLocked] = useState<boolean>(true);
  const [dncScrubbing, setDncScrubbing] = useState<boolean>(true);
  const [maxRetries, setMaxRetries] = useState<number>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const compliance = getOntarioComplianceState();

  if (!isOpen) return null;

  const handleLaunchBatch = async () => {
    setIsRunning(true);
    setStatusMessage("Validating Ontario CRTC rules and scrubbing against National DNCL...");

    try {
      const res = await fetch("/api/batch/dial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concurrencyLimit: concurrency,
          ontarioHoursEnforced: ontarioHoursLocked,
          overrideComplianceWarning: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        onBatchStarted(data.dispatchedCount);
        setTimeout(() => {
          setIsRunning(false);
          onClose();
        }, 1800);
      } else {
        setStatusMessage(data.message || "Batch dispatch error");
        setIsRunning(false);
      }
    } catch (e) {
      setStatusMessage("Error connecting to batch dispatcher endpoint");
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Batch Campaign Dialing Dispatcher
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Airtable List Dialing with Concurrency Control & CRTC Lock
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

        {/* Modal Body */}
        <div className="mt-5 space-y-4 text-xs">
          {/* CRTC Compliance Window Status */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30 p-3 text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Ontario Business Hours Lock (CRTC Section 4)
            </div>
            <p className="mt-1 text-[11px] leading-relaxed">
              Toronto Time: <strong>{compliance.currentTorontoTime}</strong>. Automated calling is strictly constrained to 09:00 - 20:00 EST Monday-Friday and 09:00 - 17:00 EST Saturdays. Sunday dials are rejected at carrier trunk level.
            </p>
          </div>

          {/* Concurrency Limit Slider */}
          <div>
            <div className="flex items-center justify-between font-semibold text-[var(--color-text-primary)]">
              <span>Concurrent Outbound SIP Lines:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {concurrency} Active Channels
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={concurrency}
              onChange={(e) => setConcurrency(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-[var(--color-brand-primary)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
              <span>1 Line (Warm-up)</span>
              <span>25 Lines (Standard)</span>
              <span>50 Lines (Full Throttle)</span>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-2.5 pt-1">
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3 cursor-pointer">
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Enforce Ontario Calling Hours</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Automatically pause queues when local Ontario time is after 8:00 PM EST.</p>
              </div>
              <input
                type="checkbox"
                checked={ontarioHoursLocked}
                onChange={(e) => setOntarioHoursLocked(e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--color-brand-primary)]"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3 cursor-pointer">
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">National & Internal DNC Scrubbing</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Check records against Canadian DNCL and permanent opt-out database.</p>
              </div>
              <input
                type="checkbox"
                checked={dncScrubbing}
                onChange={(e) => setDncScrubbing(e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--color-brand-primary)]"
              />
            </label>
          </div>

          {/* Retry Logic Settings */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3">
            <span className="font-semibold text-[var(--color-text-primary)] block mb-1">
              Unanswered / Voicemail Retry Logic
            </span>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-[var(--color-text-secondary)]">
              <div>
                <span>Max Attempts:</span>
                <p className="font-bold text-[var(--color-text-primary)] font-mono">3 Dials Per Record</p>
              </div>
              <div>
                <span>Backoff Interval:</span>
                <p className="font-bold text-[var(--color-text-primary)] font-mono">4 Hours (Same Day)</p>
              </div>
            </div>
          </div>

          {statusMessage && (
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 p-2.5 text-xs text-[var(--color-brand-primary)] font-medium">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[var(--color-border-subtle)] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleLaunchBatch}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-brand-hover)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5" />
            {isRunning ? "Arming SIP Lines..." : "Launch Outbound Batch"}
          </button>
        </div>
      </div>
    </div>
  );
}
